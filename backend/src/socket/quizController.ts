import { Server, Socket } from 'socket.io';
import pool from '../db';
import {
  setQuizState, getQuizState,
  setQuizTimer, getQuizTimer,
  trySubmitAnswer, getAnswersForQuestion,
  updateUserScore, getUserScore, getLeaderboard,
  addParticipant, getParticipants, getParticipantCount,
  cleanupQuizRedis, KEYS, redis,
} from '../redis';
import { calculateScore, isAnswerInTime, getRemainingTimeMs } from './scoringEngine';

interface QuizQuestion {
  id: number;
  question_text: string;
  time_limit: number;
  order_index: number;
  options: Array<{
    id: number;
    option_text: string;
    is_correct: boolean;
    option_index: number;
  }>;
}

// Track active quiz timers (only setTimeout for transitioning between phases)
const activeTimers: Map<number, NodeJS.Timeout> = new Map();

function clearQuizTimer(quizId: number) {
  const timer = activeTimers.get(quizId);
  if (timer) {
    clearTimeout(timer);
    activeTimers.delete(quizId);
  }
}

/**
 * Fetch all questions for a quiz, ordered
 */
async function getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
  const result = await pool.query(
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
    [quizId]
  );
  return result.rows;
}

/**
 * Build leaderboard with usernames
 */
async function buildLeaderboard(quizId: number) {
  const participants = await getParticipants(quizId);
  const leaderboardRaw = await getLeaderboard(quizId, 100);

  const entries = await Promise.all(
    leaderboardRaw.map(async (entry) => {
      const userScoreData = await getUserScore(quizId, entry.userId);
      return {
        userId: entry.userId,
        username: participants[String(entry.userId)] || `User ${entry.userId}`,
        totalScore: userScoreData.totalScore,
        totalTimeMs: userScoreData.totalTimeMs,
        correctCount: userScoreData.correctCount,
      };
    })
  );

  // Sort by score desc, then time asc
  entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return a.totalTimeMs - b.totalTimeMs;
  });

  return entries.map((e, i) => ({ ...e, rank: i + 1 }));
}

/**
 * Persist all quiz data from Redis to PostgreSQL
 */
async function persistQuizResults(quizId: number, questions: QuizQuestion[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const participants = await getParticipants(quizId);
    const userIds = Object.keys(participants).map(Number);

    // Persist each response
    for (const question of questions) {
      const answers = await getAnswersForQuestion(quizId, question.id);
      const correctOptionId = question.options.find((o) => o.is_correct)?.id;

      for (const [userIdStr, answer] of Object.entries(answers)) {
        const userId = Number(userIdStr);
        const isCorrect = answer.selectedOptionId === correctOptionId;
        const remainingMs = Math.max(0, question.time_limit * 1000 - answer.timeTakenMs);
        const score = calculateScore(isCorrect, remainingMs, question.time_limit * 1000);

        await client.query(
          `INSERT INTO responses (quiz_id, question_id, user_id, selected_option_id, is_correct, response_time_ms, score)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (quiz_id, question_id, user_id) DO NOTHING`,
          [quizId, question.id, userId, answer.selectedOptionId, isCorrect, answer.timeTakenMs, score]
        );
      }
    }

    // Persist final scores
    for (const userId of userIds) {
      const userScore = await getUserScore(quizId, userId);
      await client.query(
        `INSERT INTO scores (quiz_id, user_id, total_score, total_time_ms)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (quiz_id, user_id) DO NOTHING`,
        [quizId, userId, userScore.totalScore, userScore.totalTimeMs]
      );
    }

    // Update ranks
    await client.query(
      `UPDATE scores s SET rank = sub.rank
       FROM (
         SELECT id, ROW_NUMBER() OVER (ORDER BY total_score DESC, total_time_ms ASC) as rank
         FROM scores WHERE quiz_id = $1
       ) sub
       WHERE s.id = sub.id`,
      [quizId]
    );

    // Mark quiz completed
    await client.query(
      `UPDATE quizzes SET status = 'COMPLETED', completed_at = NOW(), updated_at = NOW() WHERE id = $1`,
      [quizId]
    );

    await client.query('COMMIT');
    console.log(`Quiz ${quizId} results persisted to DB`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(`Failed to persist quiz ${quizId} results:`, err);
  } finally {
    client.release();
  }
}

// =====================
// QUIZ FLOW CONTROLLER
// =====================

async function startQuestion(io: Server, quizId: number, questions: QuizQuestion[], questionIndex: number) {
  if (questionIndex >= questions.length) {
    // Quiz complete
    await endQuiz(io, quizId, questions);
    return;
  }

  const question = questions[questionIndex];
  const now = Date.now();
  const totalTimeMs = question.time_limit * 1000;
  const endTime = now + totalTimeMs;

  // Set state in Redis
  await setQuizState(quizId, {
    currentQuestionId: question.id,
    currentQuestionIndex: questionIndex,
    totalQuestions: questions.length,
    status: 'IN_PROGRESS',
  });

  // Set timestamp-based timer in Redis
  await setQuizTimer(quizId, {
    startTime: now,
    endTime: endTime,
    totalTime: question.time_limit,
  });

  // Emit question to all clients (without correct answer)
  const safeOptions = question.options.map((o) => ({
    id: o.id,
    option_text: o.option_text,
    option_index: o.option_index,
  }));

  io.to(`quiz:${quizId}`).emit('question:start', {
    questionId: question.id,
    questionIndex: questionIndex,
    totalQuestions: questions.length,
    questionText: question.question_text,
    options: safeOptions,
    timeLimit: question.time_limit,
    startTime: now,
    endTime: endTime,
  });

  console.log(`Quiz ${quizId}: Question ${questionIndex + 1}/${questions.length} started (${question.time_limit}s)`);

  // Schedule question end using setTimeout for the transition only
  // The actual timing validation is done via timestamps
  clearQuizTimer(quizId);
  const timer = setTimeout(async () => {
    await endQuestion(io, quizId, questions, questionIndex);
  }, totalTimeMs);
  activeTimers.set(quizId, timer);
}

async function endQuestion(io: Server, quizId: number, questions: QuizQuestion[], questionIndex: number) {
  clearQuizTimer(quizId);

  const question = questions[questionIndex];
  const correctOption = question.options.find((o) => o.is_correct);

  // Update state
  await setQuizState(quizId, {
    currentQuestionId: question.id,
    currentQuestionIndex: questionIndex,
    totalQuestions: questions.length,
    status: 'SHOWING_ANSWER',
  });

  // Calculate scores for all answers
  const answers = await getAnswersForQuestion(quizId, question.id);
  const timer = await getQuizTimer(quizId);

  for (const [userIdStr, answer] of Object.entries(answers)) {
    const userId = Number(userIdStr);
    const isCorrect = answer.selectedOptionId === correctOption?.id;
    const remainingMs = Math.max(0, timer.totalTime * 1000 - answer.timeTakenMs);
    const score = calculateScore(isCorrect, remainingMs, timer.totalTime * 1000);
    await updateUserScore(quizId, userId, score, answer.timeTakenMs);
  }

  // Also give 0 score + max time to users who didn't answer
  const participants = await getParticipants(quizId);
  for (const userIdStr of Object.keys(participants)) {
    const userId = Number(userIdStr);
    if (!answers[userId]) {
      await updateUserScore(quizId, userId, 0, question.time_limit * 1000);
    }
  }

  const answerCount = Object.keys(answers).length;

  // Emit correct answer
  io.to(`quiz:${quizId}`).emit('question:end', {
    questionId: question.id,
    correctOptionId: correctOption?.id,
    correctOptionText: correctOption?.option_text,
    totalAnswers: answerCount,
  });

  // After 2 seconds, show leaderboard
  const leaderboardTimer = setTimeout(async () => {
    await showLeaderboard(io, quizId, questions, questionIndex);
  }, 2000);
  activeTimers.set(quizId, leaderboardTimer);
}

async function showLeaderboard(io: Server, quizId: number, questions: QuizQuestion[], questionIndex: number) {
  clearQuizTimer(quizId);

  await setQuizState(quizId, {
    currentQuestionId: questions[questionIndex].id,
    currentQuestionIndex: questionIndex,
    totalQuestions: questions.length,
    status: 'SHOWING_LEADERBOARD',
  });

  const leaderboard = await buildLeaderboard(quizId);

  io.to(`quiz:${quizId}`).emit('leaderboard:update', {
    questionIndex: questionIndex,
    totalQuestions: questions.length,
    leaderboard: leaderboard,
    isLastQuestion: questionIndex === questions.length - 1,
  });

  // After 5 seconds, go to next question
  const nextTimer = setTimeout(async () => {
    await startQuestion(io, quizId, questions, questionIndex + 1);
  }, 5000);
  activeTimers.set(quizId, nextTimer);
}

async function endQuiz(io: Server, quizId: number, questions: QuizQuestion[]) {
  clearQuizTimer(quizId);

  await setQuizState(quizId, {
    currentQuestionId: 0,
    currentQuestionIndex: questions.length,
    totalQuestions: questions.length,
    status: 'COMPLETED',
  });

  const leaderboard = await buildLeaderboard(quizId);

  io.to(`quiz:${quizId}`).emit('quiz:end', {
    leaderboard: leaderboard,
  });

  // Persist to PostgreSQL
  await persistQuizResults(quizId, questions);

  // Cleanup Redis after a delay (keep for reconnects)
  setTimeout(async () => {
    await cleanupQuizRedis(quizId);
    console.log(`Quiz ${quizId}: Redis data cleaned up`);
  }, 60000); // 1 minute delay
}

// =====================
// SOCKET HANDLER
// =====================

export function setupQuizSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    if (!user) {
      socket.disconnect();
      return;
    }

    console.log(`User connected: ${user.username} (${user.id})`);

    // --- JOIN QUIZ ---
    socket.on('quiz:join', async (data: { quizId: number }) => {
      try {
        const { quizId } = data;
        const room = `quiz:${quizId}`;

        // Verify quiz exists and is LIVE
        const quizResult = await pool.query('SELECT status FROM quizzes WHERE id = $1', [quizId]);
        if (quizResult.rows.length === 0) {
          socket.emit('error', { message: 'Quiz not found' });
          return;
        }

        const status = quizResult.rows[0].status;
        if (status !== 'LIVE' && status !== 'DRAFT' && status !== 'UPCOMING') {
          // Allow joining completed quizzes to see results
          if (status === 'COMPLETED') {
            socket.join(room);
            socket.emit('quiz:completed', { quizId });
            return;
          }
          socket.emit('error', { message: 'Quiz is not available' });
          return;
        }

        socket.join(room);
        await addParticipant(quizId, user.id, user.username);

        const participantCount = await getParticipantCount(quizId);

        // Notify room of new participant
        io.to(room).emit('participant:joined', {
          userId: user.id,
          username: user.username,
          participantCount,
        });

        // --- RECONNECT HANDLING ---
        // If quiz is in progress, send current state to this user
        const quizState = await getQuizState(quizId);
        if (quizState && quizState.status !== 'LOBBY') {
          const timer = await getQuizTimer(quizId);
          const leaderboard = await buildLeaderboard(quizId);

          if (quizState.status === 'IN_PROGRESS' && timer) {
            // Send current question
            const questions = await getQuizQuestions(quizId);
            const currentQ = questions[quizState.currentQuestionIndex];
            if (currentQ) {
              const safeOptions = currentQ.options.map((o) => ({
                id: o.id,
                option_text: o.option_text,
                option_index: o.option_index,
              }));

              // Check if user already answered
              const answerKey = KEYS.answerLock(quizId, currentQ.id, user.id);
              const alreadyAnswered = await redis.exists(answerKey);

              socket.emit('quiz:sync', {
                state: quizState,
                timer: timer,
                currentQuestion: {
                  questionId: currentQ.id,
                  questionIndex: quizState.currentQuestionIndex,
                  totalQuestions: quizState.totalQuestions,
                  questionText: currentQ.question_text,
                  options: safeOptions,
                  timeLimit: currentQ.time_limit,
                  startTime: timer.startTime,
                  endTime: timer.endTime,
                },
                alreadyAnswered: alreadyAnswered === 1,
                leaderboard: leaderboard,
              });
            }
          } else if (quizState.status === 'SHOWING_LEADERBOARD') {
            socket.emit('quiz:sync', {
              state: quizState,
              leaderboard: leaderboard,
            });
          } else if (quizState.status === 'COMPLETED') {
            socket.emit('quiz:sync', {
              state: quizState,
              leaderboard: leaderboard,
            });
          }
        } else {
          // Quiz hasn't started yet, user is in lobby
          socket.emit('quiz:lobby', {
            quizId,
            participantCount,
          });
        }

        console.log(`User ${user.username} joined quiz ${quizId} (${participantCount} participants)`);
      } catch (err) {
        console.error('quiz:join error:', err);
        socket.emit('error', { message: 'Failed to join quiz' });
      }
    });

    // --- START QUIZ (admin only) ---
    socket.on('quiz:start', async (data: { quizId: number }) => {
      try {
        if (user.role !== 'admin') {
          socket.emit('error', { message: 'Only admin can start quiz' });
          return;
        }

        const { quizId } = data;

        // Verify quiz is LIVE
        const quizResult = await pool.query('SELECT status FROM quizzes WHERE id = $1', [quizId]);
        if (quizResult.rows.length === 0 || quizResult.rows[0].status !== 'LIVE') {
          socket.emit('error', { message: 'Quiz must be launched first' });
          return;
        }

        const questions = await getQuizQuestions(quizId);
        if (questions.length === 0) {
          socket.emit('error', { message: 'No questions in quiz' });
          return;
        }

        // Initialize state
        await setQuizState(quizId, {
          currentQuestionId: 0,
          currentQuestionIndex: -1,
          totalQuestions: questions.length,
          status: 'LOBBY',
        });

        io.to(`quiz:${quizId}`).emit('quiz:starting', {
          totalQuestions: questions.length,
          startsIn: 3,
        });

        // 3 second countdown before first question
        setTimeout(async () => {
          await startQuestion(io, quizId, questions, 0);
        }, 3000);

        console.log(`Quiz ${quizId} started by admin ${user.username}`);
      } catch (err) {
        console.error('quiz:start error:', err);
        socket.emit('error', { message: 'Failed to start quiz' });
      }
    });

    // --- SUBMIT ANSWER ---
    socket.on('answer:submit', async (data: { quizId: number; questionId: number; selectedOptionId: number }) => {
      try {
        const { quizId, questionId, selectedOptionId } = data;
        const now = Date.now();

        // 1. Validate quiz is live and in progress
        const quizState = await getQuizState(quizId);
        if (!quizState || quizState.status !== 'IN_PROGRESS') {
          socket.emit('answer:rejected', { reason: 'Quiz is not in progress' });
          return;
        }

        // 2. Validate correct question
        if (quizState.currentQuestionId !== questionId) {
          socket.emit('answer:rejected', { reason: 'Wrong question' });
          return;
        }

        // 3. Validate timing using backend timestamps
        const timer = await getQuizTimer(quizId);
        if (!timer || !isAnswerInTime(now, timer.endTime)) {
          socket.emit('answer:rejected', { reason: 'Time expired' });
          return;
        }

        // 4. Calculate time taken
        const timeTakenMs = now - timer.startTime;

        // 5. Atomic duplicate prevention with SETNX
        const accepted = await trySubmitAnswer(quizId, questionId, user.id, {
          selectedOptionId,
          timeTakenMs,
        });

        if (!accepted) {
          socket.emit('answer:rejected', { reason: 'Already answered' });
          return;
        }

        socket.emit('answer:accepted', {
          questionId,
          selectedOptionId,
          timeTakenMs,
        });

        // Notify admin of answer count
        const answerCount = await redis.hlen(KEYS.quizAnswers(quizId, questionId));
        const participantCount = await getParticipantCount(quizId);

        io.to(`quiz:${quizId}`).emit('answer:count', {
          questionId,
          answerCount,
          participantCount,
        });

        console.log(`User ${user.username} answered Q${questionId} in ${timeTakenMs}ms`);
      } catch (err) {
        console.error('answer:submit error:', err);
        socket.emit('error', { message: 'Failed to submit answer' });
      }
    });

    // --- ADMIN: GET LIVE STATUS ---
    socket.on('admin:status', async (data: { quizId: number }) => {
      try {
        if (user.role !== 'admin') return;

        const { quizId } = data;
        const state = await getQuizState(quizId);
        const timer = await getQuizTimer(quizId);
        const participantCount = await getParticipantCount(quizId);
        const leaderboard = await buildLeaderboard(quizId);

        socket.emit('admin:status', {
          state,
          timer,
          participantCount,
          leaderboard,
        });
      } catch (err) {
        console.error('admin:status error:', err);
      }
    });

    // --- DISCONNECT ---
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user.username} (${user.id})`);
    });
  });
}
