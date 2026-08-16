import { DurableObject } from 'cloudflare:workers';
import type { Pool } from 'pg';
import type { Env } from '../types';
import { createPool } from '../db';
import { calculateScore, isAnswerInTime } from '../scoring';

/**
 * QuizRoom — one Durable Object instance per live quiz (idFromName `quiz:<id>`).
 *
 * Replaces the Socket.IO + Redis quiz engine (backend/src/socket/quizController.ts
 * + redis.ts). The DO is single-threaded, so the Redis atomics (SETNX answer
 * locks, hard-lock sentinels) collapse into plain storage reads/writes. The
 * setTimeout phase chain (startQuestion → endQuestion → showLeaderboard → …)
 * becomes an alarm-driven state machine: each phase persists `nextPhase` and
 * schedules the next `storage.setAlarm(...)`.
 *
 * The client speaks a `{ type, ...payload }` envelope over a raw WebSocket; the
 * `type` values are the exact Socket.IO event names the frontend already uses.
 */

// ── Types (mirrors backend/src/socket/quizController.ts + redis.ts) ───────────
interface QuizUser {
  id: number;
  username: string;
  email: string;
  role: string;
  full_name?: string | null;
}

interface QuizOption {
  id: number;
  option_text: string;
  is_correct: boolean;
  option_index: number;
}

interface QuizQuestion {
  id: number;
  question_text: string;
  time_limit: number;
  order_index: number;
  options: QuizOption[];
}

type QuizStatus = 'LOBBY' | 'IN_PROGRESS' | 'SHOWING_ANSWER' | 'SHOWING_LEADERBOARD' | 'COMPLETED';

interface QuizState {
  currentQuestionId: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  status: QuizStatus;
  gracePeriodMs?: number;
}

interface QuizTimer {
  startTime: number;
  endTime: number;
  totalTime: number;
}

interface AnswerEntry {
  selectedOptionId: number | null;
  timeTakenMs: number;
  firstClickTs: number;
  hardLock: boolean;
}

interface UserScore {
  totalScore: number;
  totalTimeMs: number;
  correctCount: number;
}

type NextPhase =
  | { action: 'startQuestion'; questionIndex: number }
  | { action: 'endQuestion'; questionIndex: number }
  | { action: 'showLeaderboard'; questionIndex: number }
  | { action: 'endQuiz' }
  | { action: 'cleanup' };

const ADMIN_ROLES = ['admin', 'super_admin', 'teacher'];

export class QuizRoom extends DurableObject<Env> {
  // ── WebSocket lifecycle ─────────────────────────────────────────────────────
  async fetch(request: Request): Promise<Response> {
    if (request.headers.get('Upgrade') !== 'websocket') {
      return new Response('expected websocket', { status: 426 });
    }
    const userHeader = request.headers.get('x-quiz-user');
    if (!userHeader) return new Response('unauthorized', { status: 401 });
    const user = JSON.parse(userHeader) as QuizUser;
    const quizId = Number(request.headers.get('x-quiz-id'));

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    server.serializeAttachment({ user, quizId });
    await this.ctx.storage.put('quizId', quizId);

    return new Response(null, { status: 101, webSocket: client });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer): Promise<void> {
    const { user, quizId } = ws.deserializeAttachment() as { user: QuizUser; quizId: number };
    let msg: { type: string; [k: string]: unknown };
    try {
      msg = JSON.parse(typeof message === 'string' ? message : new TextDecoder().decode(message));
    } catch {
      return;
    }
    try {
      switch (msg.type) {
        case 'quiz:join':
          return await this.onJoin(ws, user, quizId);
        case 'quiz:start':
          return await this.onStart(ws, user, quizId);
        case 'answer:submit':
          return await this.onAnswer(ws, user, quizId, msg as unknown as { questionId: number; selectedOptionId: number });
        case 'quiz:focus_lost':
          return await this.onFocusLost(ws, user, quizId, msg as unknown as { questionId?: number });
        case 'admin:status':
          return await this.onAdminStatus(ws, user, quizId);
      }
    } catch (err) {
      console.error(`QuizRoom ${quizId} ${msg.type} error:`, err);
      this.sendTo(ws, { type: 'error', message: 'Internal error' });
    }
  }

  async webSocketClose(ws: WebSocket, code: number): Promise<void> {
    try {
      ws.close(code);
    } catch {
      /* already closed */
    }
  }

  async webSocketError(_ws: WebSocket, error: unknown): Promise<void> {
    console.error('QuizRoom ws error:', error);
  }

  // ── Messaging helpers ───────────────────────────────────────────────────────
  private sendTo(ws: WebSocket, obj: Record<string, unknown>): void {
    try {
      ws.send(JSON.stringify(obj));
    } catch {
      /* socket gone */
    }
  }

  private broadcast(obj: Record<string, unknown>): void {
    const data = JSON.stringify(obj);
    for (const ws of this.ctx.getWebSockets()) {
      try {
        ws.send(data);
      } catch {
        /* socket gone */
      }
    }
  }

  // ── Storage helpers ─────────────────────────────────────────────────────────
  private async getState(): Promise<QuizState | null> {
    return (await this.ctx.storage.get<QuizState>('state')) ?? null;
  }
  private async setState(state: QuizState): Promise<void> {
    await this.ctx.storage.put('state', state);
  }
  private async getTimer(): Promise<QuizTimer | null> {
    return (await this.ctx.storage.get<QuizTimer>('timer')) ?? null;
  }
  private async getQuestions(): Promise<QuizQuestion[]> {
    return (await this.ctx.storage.get<QuizQuestion[]>('questions')) ?? [];
  }
  private async getParticipants(): Promise<Record<string, string>> {
    return (await this.ctx.storage.get<Record<string, string>>('participants')) ?? {};
  }
  private async getScores(): Promise<Record<string, UserScore>> {
    return (await this.ctx.storage.get<Record<string, UserScore>>('scores')) ?? {};
  }
  private async getAnswers(questionId: number): Promise<Record<string, AnswerEntry>> {
    return (await this.ctx.storage.get<Record<string, AnswerEntry>>(`answers:${questionId}`)) ?? {};
  }

  // ── DB helper ───────────────────────────────────────────────────────────────
  private async withDb<T>(fn: (pool: Pool) => Promise<T>): Promise<T> {
    const pool = createPool(this.env);
    try {
      return await fn(pool);
    } finally {
      await pool.end();
    }
  }

  private async loadQuestions(quizId: number): Promise<QuizQuestion[]> {
    return this.withDb(async (pool) => {
      const r = await pool.query(
        `SELECT q.id, q.question_text, q.time_limit, q.order_index,
           json_agg(
             json_build_object('id', o.id, 'option_text', o.option_text, 'is_correct', o.is_correct, 'option_index', o.option_index)
             ORDER BY o.option_index
           ) as options
         FROM questions q
         LEFT JOIN options o ON o.question_id = q.id
         WHERE q.quiz_id = $1
         GROUP BY q.id
         ORDER BY q.order_index`,
        [quizId],
      );
      return r.rows as QuizQuestion[];
    });
  }

  // ── Answer submission (single-threaded → no Redis atomics needed) ───────────
  private async trySubmitAnswer(
    questionId: number,
    userId: number,
    answer: { selectedOptionId: number | null; timeTakenMs: number },
    opts: { gracePeriodMs?: number; forceLock?: boolean } = {},
  ): Promise<{ accepted: true; firstClick: boolean } | { accepted: false; reason: 'hard_locked' | 'grace_expired' }> {
    const key = `answers:${questionId}`;
    const map = await this.getAnswers(questionId);
    const now = Date.now();
    const existing = map[String(userId)];

    if (!existing) {
      map[String(userId)] = {
        selectedOptionId: answer.selectedOptionId,
        timeTakenMs: answer.timeTakenMs,
        firstClickTs: now,
        hardLock: !!opts.forceLock,
      };
      await this.ctx.storage.put(key, map);
      return { accepted: true, firstClick: true };
    }

    if (existing.hardLock) return { accepted: false, reason: 'hard_locked' };

    const grace = Math.max(0, opts.gracePeriodMs ?? 0);
    const elapsed = now - existing.firstClickTs;
    if (opts.forceLock) existing.hardLock = true;

    if (grace <= 0 || elapsed > grace) {
      if (opts.forceLock) await this.ctx.storage.put(key, map);
      return { accepted: false, reason: 'grace_expired' };
    }

    // Within grace — overwrite the selection but PRESERVE the first click's time.
    existing.selectedOptionId = answer.selectedOptionId;
    map[String(userId)] = existing;
    await this.ctx.storage.put(key, map);
    return { accepted: true, firstClick: false };
  }

  private async updateUserScore(userId: number, questionScore: number, timeTakenMs: number): Promise<void> {
    const scores = await this.getScores();
    const s = scores[String(userId)] ?? { totalScore: 0, totalTimeMs: 0, correctCount: 0 };
    s.totalScore += questionScore;
    s.totalTimeMs += timeTakenMs;
    if (questionScore > 0) s.correctCount += 1;
    scores[String(userId)] = s;
    await this.ctx.storage.put('scores', scores);
  }

  private async buildLeaderboard(): Promise<
    Array<{ userId: number; username: string; totalScore: number; totalTimeMs: number; correctCount: number; rank: number }>
  > {
    const participants = await this.getParticipants();
    const scores = await this.getScores();
    const entries = Object.keys(participants).map((uid) => {
      const s = scores[uid] ?? { totalScore: 0, totalTimeMs: 0, correctCount: 0 };
      return {
        userId: Number(uid),
        username: participants[uid] || `User ${uid}`,
        totalScore: s.totalScore,
        totalTimeMs: s.totalTimeMs,
        correctCount: s.correctCount,
      };
    });
    entries.sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      if (a.totalTimeMs !== b.totalTimeMs) return a.totalTimeMs - b.totalTimeMs;
      return a.userId - b.userId;
    });
    return entries.map((e, i) => ({ ...e, rank: i + 1 }));
  }

  // ── Message handlers ────────────────────────────────────────────────────────
  private async onJoin(ws: WebSocket, user: QuizUser, quizId: number): Promise<void> {
    const status = await this.withDb(async (pool) => {
      const r = await pool.query('SELECT status FROM quizzes WHERE id = $1', [quizId]);
      return r.rows.length === 0 ? null : (r.rows[0].status as string);
    });
    if (status === null) {
      this.sendTo(ws, { type: 'error', message: 'Quiz not found' });
      return;
    }
    if (status !== 'LIVE' && status !== 'DRAFT' && status !== 'UPCOMING') {
      if (status === 'COMPLETED') {
        this.sendTo(ws, { type: 'quiz:completed', quizId });
        return;
      }
      this.sendTo(ws, { type: 'error', message: 'Quiz is not available' });
      return;
    }

    const isAdmin = ADMIN_ROLES.includes(user.role);
    if (!isAdmin) {
      const participants = await this.getParticipants();
      participants[String(user.id)] = user.username;
      await this.ctx.storage.put('participants', participants);
    }
    const participants = await this.getParticipants();
    const participantCount = Object.keys(participants).length;

    this.broadcast({ type: 'participant:joined', userId: user.id, username: user.username, participantCount });

    // Reconnect handling — send the joining socket the current state.
    const state = await this.getState();
    if (state && state.status !== 'LOBBY') {
      const timer = await this.getTimer();
      const leaderboard = await this.buildLeaderboard();
      if (state.status === 'IN_PROGRESS' && timer) {
        const questions = await this.getQuestions();
        const currentQ = questions[state.currentQuestionIndex];
        if (currentQ) {
          const answers = await this.getAnswers(currentQ.id);
          this.sendTo(ws, {
            type: 'quiz:sync',
            state,
            timer,
            currentQuestion: {
              questionId: currentQ.id,
              questionIndex: state.currentQuestionIndex,
              totalQuestions: state.totalQuestions,
              questionText: currentQ.question_text,
              options: currentQ.options.map((o) => ({ id: o.id, option_text: o.option_text, option_index: o.option_index })),
              timeLimit: currentQ.time_limit,
              startTime: timer.startTime,
              endTime: timer.endTime,
            },
            alreadyAnswered: Boolean(answers[String(user.id)]),
            leaderboard,
          });
        }
      } else if (state.status === 'SHOWING_LEADERBOARD') {
        this.sendTo(ws, {
          type: 'quiz:sync',
          state,
          leaderboard,
          isLastQuestion: state.currentQuestionIndex === state.totalQuestions - 1,
        });
      } else if (state.status === 'COMPLETED') {
        this.sendTo(ws, { type: 'quiz:sync', state, leaderboard });
      }
    } else {
      this.sendTo(ws, { type: 'quiz:lobby', quizId, participantCount });
    }
  }

  private async onStart(ws: WebSocket, user: QuizUser, quizId: number): Promise<void> {
    if (!ADMIN_ROLES.includes(user.role)) {
      this.sendTo(ws, { type: 'error', message: 'Only admin can start quiz' });
      return;
    }
    const row = await this.withDb(async (pool) => {
      const r = await pool.query(
        `SELECT status, COALESCE(answer_grace_period_ms, 3000) AS grace FROM quizzes WHERE id = $1`,
        [quizId],
      );
      return r.rows[0] as { status: string; grace: number } | undefined;
    });
    if (!row || row.status !== 'LIVE') {
      this.sendTo(ws, { type: 'error', message: 'Quiz must be launched first' });
      return;
    }
    const gracePeriodMs = Math.max(0, Math.min(10_000, Number(row.grace) || 0));

    const existing = await this.getState();
    if (existing && existing.status !== 'LOBBY') {
      this.sendTo(ws, { type: 'error', message: 'Quiz is already in progress' });
      return;
    }

    const questions = await this.loadQuestions(quizId);
    if (questions.length === 0) {
      this.sendTo(ws, { type: 'error', message: 'No questions in quiz' });
      return;
    }
    await this.ctx.storage.put('questions', questions);

    await this.setState({
      currentQuestionId: 0,
      currentQuestionIndex: -1,
      totalQuestions: questions.length,
      status: 'LOBBY',
      gracePeriodMs,
    });

    this.broadcast({ type: 'quiz:starting', totalQuestions: questions.length, startsIn: 3 });

    await this.ctx.storage.put<NextPhase>('nextPhase', { action: 'startQuestion', questionIndex: 0 });
    await this.ctx.storage.setAlarm(Date.now() + 3000);
  }

  private async onAnswer(
    ws: WebSocket,
    user: QuizUser,
    _quizId: number,
    data: { questionId: number; selectedOptionId: number },
  ): Promise<void> {
    const now = Date.now();
    const state = await this.getState();
    if (!state || state.status !== 'IN_PROGRESS') {
      this.sendTo(ws, { type: 'answer:rejected', reason: 'Quiz is not in progress' });
      return;
    }
    if (state.currentQuestionId !== data.questionId) {
      this.sendTo(ws, { type: 'answer:rejected', reason: 'Wrong question' });
      return;
    }
    const timer = await this.getTimer();
    if (!timer || !isAnswerInTime(now, timer.endTime)) {
      this.sendTo(ws, { type: 'answer:rejected', reason: 'Time expired' });
      return;
    }
    const timeTakenMs = now - timer.startTime;
    const gracePeriodMs = state.gracePeriodMs ?? 0;

    const result = await this.trySubmitAnswer(
      data.questionId,
      user.id,
      { selectedOptionId: data.selectedOptionId, timeTakenMs },
      { gracePeriodMs },
    );
    if (!result.accepted) {
      this.sendTo(ws, {
        type: 'answer:rejected',
        reason: result.reason === 'hard_locked' ? 'Answer is locked' : 'Grace window expired',
      });
      return;
    }

    this.sendTo(ws, {
      type: 'answer:accepted',
      questionId: data.questionId,
      selectedOptionId: data.selectedOptionId,
      timeTakenMs,
      firstClick: result.firstClick,
      gracePeriodMs,
    });

    const answers = await this.getAnswers(data.questionId);
    const participants = await this.getParticipants();
    this.broadcast({
      type: 'answer:count',
      questionId: data.questionId,
      answerCount: Object.keys(answers).length,
      participantCount: Object.keys(participants).length,
    });
  }

  private async onFocusLost(ws: WebSocket, user: QuizUser, quizId: number, data: { questionId?: number }): Promise<void> {
    const state = await this.getState();
    if (!state || state.status !== 'IN_PROGRESS') return;
    const activeQuestionId =
      data.questionId && state.currentQuestionId === data.questionId ? data.questionId : state.currentQuestionId;
    if (!activeQuestionId) return;

    const count = await this.withDb(async (pool) => {
      await pool.query(
        `INSERT INTO quiz_violations (quiz_id, user_id, question_id, kind) VALUES ($1, $2, $3, 'focus_lost')`,
        [quizId, user.id, activeQuestionId],
      );
      const r = await pool.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count FROM quiz_violations WHERE quiz_id = $1 AND user_id = $2 AND kind = 'focus_lost'`,
        [quizId, user.id],
      );
      return parseInt(r.rows[0]?.count ?? '0', 10);
    });

    if (count >= 2) {
      const timer = await this.getTimer();
      const timeTakenMs = timer ? Date.now() - timer.startTime : 0;
      const result = await this.trySubmitAnswer(
        activeQuestionId,
        user.id,
        { selectedOptionId: null, timeTakenMs },
        { forceLock: true },
      );
      if (result.accepted) {
        this.sendTo(ws, { type: 'answer:rejected', reason: 'Auto-submitted blank — multiple focus losses detected' });
      }
    }
  }

  private async onAdminStatus(ws: WebSocket, user: QuizUser, _quizId: number): Promise<void> {
    if (!ADMIN_ROLES.includes(user.role)) return;
    const state = await this.getState();
    const timer = await this.getTimer();
    const participants = await this.getParticipants();
    const leaderboard = await this.buildLeaderboard();
    this.sendTo(ws, {
      type: 'admin:status',
      state,
      timer,
      participantCount: Object.keys(participants).length,
      leaderboard,
    });
  }

  // ── Alarm-driven phase state machine ────────────────────────────────────────
  async alarm(): Promise<void> {
    const next = await this.ctx.storage.get<NextPhase>('nextPhase');
    if (!next) return;
    const questions = await this.getQuestions();
    switch (next.action) {
      case 'startQuestion':
        return this.startQuestion(questions, next.questionIndex);
      case 'endQuestion':
        return this.endQuestion(questions, next.questionIndex);
      case 'showLeaderboard':
        return this.showLeaderboard(questions, next.questionIndex);
      case 'endQuiz':
        return this.endQuiz(questions);
      case 'cleanup':
        return this.cleanup();
    }
  }

  private async startQuestion(questions: QuizQuestion[], questionIndex: number): Promise<void> {
    if (questionIndex >= questions.length) {
      return this.endQuiz(questions);
    }
    const question = questions[questionIndex];
    const state = await this.getState();
    const gracePeriodMs = state?.gracePeriodMs ?? 0;
    const now = Date.now();
    const totalTimeMs = question.time_limit * 1000;
    const endTime = now + totalTimeMs;

    await this.setState({
      currentQuestionId: question.id,
      currentQuestionIndex: questionIndex,
      totalQuestions: questions.length,
      status: 'IN_PROGRESS',
      gracePeriodMs,
    });
    await this.ctx.storage.put<QuizTimer>('timer', { startTime: now, endTime, totalTime: question.time_limit });

    this.broadcast({
      type: 'question:start',
      questionId: question.id,
      questionIndex,
      totalQuestions: questions.length,
      questionText: question.question_text,
      options: question.options.map((o) => ({ id: o.id, option_text: o.option_text, option_index: o.option_index })),
      timeLimit: question.time_limit,
      startTime: now,
      endTime,
      gracePeriodMs,
    });

    await this.ctx.storage.put<NextPhase>('nextPhase', { action: 'endQuestion', questionIndex });
    await this.ctx.storage.setAlarm(endTime);
  }

  private async endQuestion(questions: QuizQuestion[], questionIndex: number): Promise<void> {
    const question = questions[questionIndex];
    const correctOption = question.options.find((o) => o.is_correct);

    await this.setState({
      currentQuestionId: question.id,
      currentQuestionIndex: questionIndex,
      totalQuestions: questions.length,
      status: 'SHOWING_ANSWER',
    });

    const answers = await this.getAnswers(question.id);
    const totalTimeMs = question.time_limit * 1000;
    for (const [uidStr, answer] of Object.entries(answers)) {
      const isCorrect = answer.selectedOptionId === correctOption?.id;
      const remainingMs = Math.max(0, totalTimeMs - answer.timeTakenMs);
      const score = calculateScore(isCorrect, remainingMs, totalTimeMs);
      await this.updateUserScore(Number(uidStr), score, answer.timeTakenMs);
    }
    // Zero score + max time for participants who didn't answer.
    const participants = await this.getParticipants();
    for (const uidStr of Object.keys(participants)) {
      if (!answers[uidStr]) await this.updateUserScore(Number(uidStr), 0, totalTimeMs);
    }

    this.broadcast({
      type: 'question:end',
      questionId: question.id,
      correctOptionId: correctOption?.id,
      correctOptionText: correctOption?.option_text,
      totalAnswers: Object.keys(answers).length,
    });

    await this.ctx.storage.put<NextPhase>('nextPhase', { action: 'showLeaderboard', questionIndex });
    await this.ctx.storage.setAlarm(Date.now() + 2000);
  }

  private async showLeaderboard(questions: QuizQuestion[], questionIndex: number): Promise<void> {
    await this.setState({
      currentQuestionId: questions[questionIndex].id,
      currentQuestionIndex: questionIndex,
      totalQuestions: questions.length,
      status: 'SHOWING_LEADERBOARD',
    });
    const leaderboard = await this.buildLeaderboard();
    this.broadcast({
      type: 'leaderboard:update',
      questionIndex,
      totalQuestions: questions.length,
      leaderboard,
      isLastQuestion: questionIndex === questions.length - 1,
    });

    await this.ctx.storage.put<NextPhase>('nextPhase', { action: 'startQuestion', questionIndex: questionIndex + 1 });
    await this.ctx.storage.setAlarm(Date.now() + 5000);
  }

  private async endQuiz(questions: QuizQuestion[]): Promise<void> {
    await this.setState({
      currentQuestionId: 0,
      currentQuestionIndex: questions.length,
      totalQuestions: questions.length,
      status: 'COMPLETED',
    });
    const leaderboard = await this.buildLeaderboard();
    this.broadcast({ type: 'quiz:end', leaderboard });

    await this.persistResults(questions);

    await this.ctx.storage.put<NextPhase>('nextPhase', { action: 'cleanup' });
    await this.ctx.storage.setAlarm(Date.now() + 60_000);
  }

  private async cleanup(): Promise<void> {
    await this.ctx.storage.deleteAlarm();
    await this.ctx.storage.deleteAll();
  }

  private async persistResults(questions: QuizQuestion[]): Promise<void> {
    const quizId = (await this.ctx.storage.get<number>('quizId'))!;
    const participants = await this.getParticipants();
    const scores = await this.getScores();

    await this.withDb(async (pool) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        for (const question of questions) {
          const answers = await this.getAnswers(question.id);
          const correctOptionId = question.options.find((o) => o.is_correct)?.id;
          for (const [uidStr, answer] of Object.entries(answers)) {
            const isCorrect = answer.selectedOptionId === correctOptionId;
            const score = calculateScore(isCorrect, Math.max(0, question.time_limit * 1000 - answer.timeTakenMs), question.time_limit * 1000);
            await client.query(
              `INSERT INTO responses (quiz_id, question_id, user_id, selected_option_id, is_correct, response_time_ms, score)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               ON CONFLICT (quiz_id, question_id, user_id) DO NOTHING`,
              [quizId, question.id, Number(uidStr), answer.selectedOptionId, isCorrect, answer.timeTakenMs, score],
            );
          }
        }
        for (const uidStr of Object.keys(participants)) {
          const s = scores[uidStr] ?? { totalScore: 0, totalTimeMs: 0, correctCount: 0 };
          await client.query(
            `INSERT INTO scores (quiz_id, user_id, total_score, total_time_ms)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (quiz_id, user_id) DO NOTHING`,
            [quizId, Number(uidStr), s.totalScore, s.totalTimeMs],
          );
        }
        await client.query(
          `UPDATE scores s SET rank = sub.rank
           FROM (SELECT id, ROW_NUMBER() OVER (ORDER BY total_score DESC, total_time_ms ASC) as rank
                 FROM scores WHERE quiz_id = $1) sub
           WHERE s.id = sub.id`,
          [quizId],
        );
        await client.query(
          `UPDATE quizzes SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW() WHERE id = $1`,
          [quizId],
        );
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK').catch(() => {});
        console.error(`Quiz ${quizId} persist failed:`, err);
      } finally {
        client.release();
      }
    });
  }
}
