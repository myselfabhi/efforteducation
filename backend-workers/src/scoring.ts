/**
 * Scoring Engine (ported verbatim from backend/src/socket/scoringEngine.ts).
 * Formula: score = 100 + (remainingTime / totalTime) * 100
 * - Correct answer: 100-200 points based on speed
 * - Wrong answer: 0 points
 */

export function calculateScore(isCorrect: boolean, remainingTimeMs: number, totalTimeMs: number): number {
  if (!isCorrect) return 0;
  if (totalTimeMs <= 0) return 100;
  const ratio = Math.max(0, Math.min(1, remainingTimeMs / totalTimeMs));
  return Math.round(100 + ratio * 100);
}

/** Reject if submitted after question end time (+500ms network grace). */
export function isAnswerInTime(submissionTime: number, questionEndTime: number): boolean {
  return submissionTime <= questionEndTime + 500;
}

export function getRemainingTimeMs(submissionTime: number, questionStartTime: number, questionEndTime: number): number {
  return Math.max(0, questionEndTime - submissionTime);
}
