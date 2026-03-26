/**
 * Scoring Engine
 * Formula: score = 100 + (remainingTime / totalTime) * 100
 * - Correct answer: 100-200 points based on speed
 * - Wrong answer: 0 points
 * - Time stored for tie-breaking
 */

export function calculateScore(
  isCorrect: boolean,
  remainingTimeMs: number,
  totalTimeMs: number
): number {
  if (!isCorrect) return 0;
  if (totalTimeMs <= 0) return 100;

  const ratio = Math.max(0, Math.min(1, remainingTimeMs / totalTimeMs));
  return Math.round(100 + ratio * 100);
}

/**
 * Validate answer timing — reject if submitted after question end time
 */
export function isAnswerInTime(
  submissionTime: number,
  questionEndTime: number
): boolean {
  // Allow 500ms grace period for network latency
  return submissionTime <= questionEndTime + 500;
}

/**
 * Calculate remaining time in ms
 */
export function getRemainingTimeMs(
  submissionTime: number,
  questionStartTime: number,
  questionEndTime: number
): number {
  const remaining = questionEndTime - submissionTime;
  return Math.max(0, remaining);
}

/**
 * Sort leaderboard entries by score (desc) then total time (asc)
 */
export function sortLeaderboard(
  entries: Array<{ userId: number; username: string; totalScore: number; totalTimeMs: number }>
) {
  return entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    return a.totalTimeMs - b.totalTimeMs;
  });
}
