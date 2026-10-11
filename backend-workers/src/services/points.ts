import type { Pool } from 'pg';

// Effort points reward participation, not performance.
export const POINT_VALUES = {
  weekly_report: 20,
  class_attended: 15,
  quiz_completed: 10,
} as const;

/**
 * Idempotently credit a student for everything they've earned but not yet been
 * awarded — reports written, classes attended, quizzes completed. Every insert
 * is keyed on its source via the (user_id, source_type, source_id) unique
 * constraint, so this is safe to run on every read and never double-counts. It
 * also back-fills points for activity that happened before this feature existed.
 */
export async function reconcilePoints(db: Pool, userId: number): Promise<void> {
  await db.query(
    `INSERT INTO effort_points (user_id, points, reason, source_type, source_id)
       SELECT $1, $2, 'weekly_report', 'report', id
         FROM weekly_reports WHERE student_id = $1
     ON CONFLICT (user_id, source_type, source_id) DO NOTHING`,
    [userId, POINT_VALUES.weekly_report],
  );
  await db.query(
    `INSERT INTO effort_points (user_id, points, reason, source_type, source_id)
       SELECT $1, $2, 'quiz_completed', 'quiz', quiz_id
         FROM scores WHERE user_id = $1
     ON CONFLICT (user_id, source_type, source_id) DO NOTHING`,
    [userId, POINT_VALUES.quiz_completed],
  );
  await db.query(
    `INSERT INTO effort_points (user_id, points, reason, source_type, source_id)
       SELECT $1, $2, 'class_attended', 'class', live_class_id
         FROM live_class_attendance WHERE user_id = $1
     ON CONFLICT (user_id, source_type, source_id) DO NOTHING`,
    [userId, POINT_VALUES.class_attended],
  );
}

export interface PointsSummary {
  total: number;
  by_reason: Array<{ reason: string; count: number; points: number }>;
}

export async function getPointsSummary(db: Pool, userId: number): Promise<PointsSummary> {
  const total = await db.query(
    'SELECT COALESCE(SUM(points), 0)::INT AS total FROM effort_points WHERE user_id = $1',
    [userId],
  );
  const byReason = await db.query(
    `SELECT reason, COUNT(*)::INT AS count, COALESCE(SUM(points), 0)::INT AS points
       FROM effort_points WHERE user_id = $1
      GROUP BY reason`,
    [userId],
  );
  return { total: total.rows[0].total, by_reason: byReason.rows };
}

/** Reconcile then return the fresh summary — what the API endpoints return. */
export async function reconcileAndSummarize(db: Pool, userId: number): Promise<PointsSummary> {
  await reconcilePoints(db, userId);
  return getPointsSummary(db, userId);
}
