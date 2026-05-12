import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Main client for commands
export const redis = new Redis(redisUrl, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// Pub/Sub clients for Socket.IO adapter
export const pubClient = new Redis(redisUrl);
export const subClient = new Redis(redisUrl);

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('Redis connected'));

// =====================
// KEY HELPERS
// =====================

export const KEYS = {
  quizState: (quizId: number) => `quiz:${quizId}:state`,
  quizTimer: (quizId: number) => `quiz:${quizId}:timer`,
  quizLeaderboard: (quizId: number) => `quiz:${quizId}:leaderboard`,
  quizAnswers: (quizId: number, questionId: number) => `quiz:${quizId}:answers:${questionId}`,
  quizParticipants: (quizId: number) => `quiz:${quizId}:participants`,
  // Holds the FIRST-click timestamp (ms) for this user / question. While
  // present, the entry is treated as "soft-locked" — overwrites are accepted
  // until `firstClickTs + gracePeriodMs`.
  answerLock: (quizId: number, questionId: number, userId: number) =>
    `answer:${quizId}:${questionId}:${userId}`,
  // Sentinel set by anti-cheat (focus_lost auto-submit) or by an explicit
  // hard-lock request. When present, no further overwrites are allowed even
  // if we're still within the grace window.
  answerHardLock: (quizId: number, questionId: number, userId: number) =>
    `answer:${quizId}:${questionId}:${userId}:hardlock`,
  userScore: (quizId: number, userId: number) => `quiz:${quizId}:userscore:${userId}`,
};

// =====================
// QUIZ STATE
// =====================

export interface QuizState {
  currentQuestionId: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  status: 'LOBBY' | 'IN_PROGRESS' | 'SHOWING_ANSWER' | 'SHOWING_LEADERBOARD' | 'COMPLETED';
  /** Per-quiz answer-change grace window (ms). Optional for backwards-compat
   *  with quizzes started before migration 007. */
  gracePeriodMs?: number;
}

export async function setQuizState(quizId: number, state: QuizState) {
  await redis.set(KEYS.quizState(quizId), JSON.stringify(state));
}

export async function getQuizState(quizId: number): Promise<QuizState | null> {
  const data = await redis.get(KEYS.quizState(quizId));
  return data ? (JSON.parse(data) as QuizState) : null;
}

// =====================
// TIMER (TIMESTAMP-BASED)
// =====================

export async function setQuizTimer(quizId: number, timer: {
  startTime: number;   // Unix ms
  endTime: number;     // Unix ms
  totalTime: number;   // total seconds
}) {
  await redis.set(KEYS.quizTimer(quizId), JSON.stringify(timer));
}

export async function getQuizTimer(quizId: number) {
  const data = await redis.get(KEYS.quizTimer(quizId));
  return data ? JSON.parse(data) : null;
}

// =====================
// ANSWER SUBMISSION
// First click sets the lock (TS in ms) + the answer hash. Subsequent clicks
// within `gracePeriodMs` overwrite the selection but PRESERVE the first
// click's time-taken so the time bonus stays honest. After the grace window
// or once the hard-lock sentinel is present, further submissions are
// rejected — same as classic Kahoot behaviour.
// =====================

export type SubmitAnswerResult =
  | { accepted: true;  firstClick: boolean }
  | { accepted: false; reason: 'hard_locked' | 'grace_expired' };

export async function trySubmitAnswer(
  quizId: number,
  questionId: number,
  userId: number,
  answer: { selectedOptionId: number | null; timeTakenMs: number },
  opts: { gracePeriodMs?: number; forceLock?: boolean } = {}
): Promise<SubmitAnswerResult> {
  const lockKey     = KEYS.answerLock(quizId, questionId, userId);
  const hardLockKey = KEYS.answerHardLock(quizId, questionId, userId);
  const answersKey  = KEYS.quizAnswers(quizId, questionId);
  const grace       = Math.max(0, opts.gracePeriodMs ?? 0);
  const now         = Date.now();

  // Once hard-locked, never accept anything else.
  if ((await redis.exists(hardLockKey)) === 1) {
    return { accepted: false, reason: 'hard_locked' };
  }

  // Atomic first-click insert. SETNX returns the value on success, null on
  // existing key. We store the FIRST-click timestamp as the value so any
  // subsequent call can compute elapsed.
  const setRes = await redis.set(lockKey, String(now), 'EX', 3600, 'NX');
  if (setRes) {
    // First submission for this user/question.
    await redis.hset(
      answersKey,
      String(userId),
      JSON.stringify(answer)
    );
    if (opts.forceLock) {
      await redis.set(hardLockKey, '1', 'EX', 3600);
    }
    return { accepted: true, firstClick: true };
  }

  // Subsequent submission: gated by the grace window.
  const firstClickRaw = await redis.get(lockKey);
  const firstClick    = firstClickRaw ? parseInt(firstClickRaw, 10) : now;
  const elapsed       = now - firstClick;

  // forceLock implies "this is a final attempt" (e.g. focus_lost auto-blank).
  // Set the hard-lock immediately and reject any later overwrites.
  if (opts.forceLock) {
    await redis.set(hardLockKey, '1', 'EX', 3600);
  }
  if (grace <= 0 || elapsed > grace) {
    return { accepted: false, reason: 'grace_expired' };
  }

  // Within grace — overwrite the selection, but keep the original timeTakenMs.
  const existingRaw = await redis.hget(answersKey, String(userId));
  const preservedTime = existingRaw
    ? (JSON.parse(existingRaw) as { timeTakenMs: number }).timeTakenMs
    : answer.timeTakenMs;
  await redis.hset(
    answersKey,
    String(userId),
    JSON.stringify({ selectedOptionId: answer.selectedOptionId, timeTakenMs: preservedTime })
  );
  return { accepted: true, firstClick: false };
}

export async function getAnswersForQuestion(quizId: number, questionId: number) {
  const data = await redis.hgetall(KEYS.quizAnswers(quizId, questionId));
  const parsed: Record<number, { selectedOptionId: number | null; timeTakenMs: number }> = {};
  for (const [uid, val] of Object.entries(data)) {
    parsed[Number(uid)] = JSON.parse(val);
  }
  return parsed;
}

// =====================
// LEADERBOARD (ZSET)
// =====================

export async function updateLeaderboard(quizId: number, userId: number, score: number) {
  await redis.zadd(KEYS.quizLeaderboard(quizId), score, String(userId));
}

export async function getLeaderboard(quizId: number, limit = 50): Promise<Array<{ userId: number; score: number }>> {
  // ZREVRANGE returns highest scores first
  const results = await redis.zrevrange(KEYS.quizLeaderboard(quizId), 0, limit - 1, 'WITHSCORES');
  const leaderboard: Array<{ userId: number; score: number }> = [];
  for (let i = 0; i < results.length; i += 2) {
    leaderboard.push({
      userId: Number(results[i]),
      score: Number(results[i + 1]),
    });
  }
  return leaderboard;
}

// =====================
// USER SCORE TRACKING (for tie-breaker)
// =====================

export async function updateUserScore(quizId: number, userId: number, questionScore: number, timeTakenMs: number) {
  const key = KEYS.userScore(quizId, userId);
  const existing = await redis.get(key);
  let data = { totalScore: 0, totalTimeMs: 0, correctCount: 0 };
  if (existing) data = JSON.parse(existing);
  data.totalScore += questionScore;
  data.totalTimeMs += timeTakenMs;
  if (questionScore > 0) data.correctCount += 1;
  await redis.set(key, JSON.stringify(data));
  // Also update ZSET leaderboard — use composite score for sorting
  // Score in ZSET: totalScore * 1000000 - totalTimeMs (to handle tie-breaking in single sort)
  const compositeScore = data.totalScore * 1000000 - data.totalTimeMs;
  await redis.zadd(KEYS.quizLeaderboard(quizId), compositeScore, String(userId));
  return data;
}

export async function getUserScore(quizId: number, userId: number) {
  const key = KEYS.userScore(quizId, userId);
  const data = await redis.get(key);
  return data ? JSON.parse(data) : { totalScore: 0, totalTimeMs: 0, correctCount: 0 };
}

// =====================
// PARTICIPANTS
// =====================

export async function addParticipant(quizId: number, userId: number, username: string) {
  await redis.hset(KEYS.quizParticipants(quizId), String(userId), username);
}

export async function getParticipants(quizId: number) {
  return redis.hgetall(KEYS.quizParticipants(quizId));
}

export async function getParticipantCount(quizId: number) {
  return redis.hlen(KEYS.quizParticipants(quizId));
}

// =====================
// CLEANUP
// =====================

export async function cleanupQuizRedis(quizId: number) {
  const keys = await redis.keys(`quiz:${quizId}:*`);
  const answerKeys = await redis.keys(`answer:${quizId}:*`);
  const allKeys = [...keys, ...answerKeys];
  if (allKeys.length > 0) {
    await redis.del(...allKeys);
  }
}
