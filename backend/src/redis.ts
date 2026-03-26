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
  answerLock: (quizId: number, questionId: number, userId: number) =>
    `answer:${quizId}:${questionId}:${userId}`,
  userScore: (quizId: number, userId: number) => `quiz:${quizId}:userscore:${userId}`,
};

// =====================
// QUIZ STATE
// =====================

export async function setQuizState(quizId: number, state: {
  currentQuestionId: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  status: 'LOBBY' | 'IN_PROGRESS' | 'SHOWING_ANSWER' | 'SHOWING_LEADERBOARD' | 'COMPLETED';
}) {
  await redis.set(KEYS.quizState(quizId), JSON.stringify(state));
}

export async function getQuizState(quizId: number) {
  const data = await redis.get(KEYS.quizState(quizId));
  return data ? JSON.parse(data) : null;
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
// ANSWER SUBMISSION (SETNX for duplicate prevention)
// =====================

export async function trySubmitAnswer(
  quizId: number,
  questionId: number,
  userId: number,
  answer: { selectedOptionId: number; timeTakenMs: number }
): Promise<boolean> {
  const key = KEYS.answerLock(quizId, questionId, userId);
  // SETNX — returns 1 if set (first answer), 0 if already exists
  const result = await redis.set(key, '1', 'EX', 3600, 'NX');
  if (!result) return false; // duplicate

  // Store the actual answer in the hash
  await redis.hset(
    KEYS.quizAnswers(quizId, questionId),
    String(userId),
    JSON.stringify(answer)
  );
  return true;
}

export async function getAnswersForQuestion(quizId: number, questionId: number) {
  const data = await redis.hgetall(KEYS.quizAnswers(quizId, questionId));
  const parsed: Record<number, { selectedOptionId: number; timeTakenMs: number }> = {};
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
