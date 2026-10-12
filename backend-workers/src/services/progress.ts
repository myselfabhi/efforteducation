import type { Pool } from 'pg';
import type { PointsSummary } from './points';

// Gamification derived from the same weekly activity that drives effort points —
// no new tables. A "week" is the IST Monday a report/quiz/class falls in.

export interface Badge {
  key: string;
  label: string;
  emoji: string;
  earned: boolean;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/** The weeks a student was active, newest first, plus whether any week was a
 *  "perfect week" (class + quiz + report together), and the current IST week. */
async function weekData(db: Pool, userId: number) {
  const rows = (
    await db.query(
      `SELECT to_char(week, 'YYYY-MM-DD') AS week, array_agg(DISTINCT src) AS sources
         FROM (
           SELECT date_trunc('week', (created_at AT TIME ZONE 'Asia/Kolkata'))::date AS week, 'quiz'::text AS src
             FROM scores WHERE user_id = $1
           UNION ALL
           SELECT date_trunc('week', (joined_at AT TIME ZONE 'Asia/Kolkata'))::date, 'class'
             FROM live_class_attendance WHERE user_id = $1
           UNION ALL
           SELECT week_start, 'report' FROM weekly_reports WHERE student_id = $1
         ) t
        GROUP BY week
        ORDER BY week DESC`,
      [userId],
    )
  ).rows as Array<{ week: string; sources: string[] }>;

  const cur = (
    await db.query(
      `SELECT to_char(date_trunc('week', (NOW() AT TIME ZONE 'Asia/Kolkata'))::date, 'YYYY-MM-DD') AS cur`,
    )
  ).rows[0].cur as string;

  const weeks = rows.map((r) => r.week);
  const perfectWeek = rows.some(
    (r) => r.sources.includes('class') && r.sources.includes('quiz') && r.sources.includes('report'),
  );
  return { weeks, perfectWeek, currentWeek: cur };
}

/**
 * Consecutive active weeks, newest first, with a safety valve: the current
 * week (still in progress) is never a break, and one earlier missed week is
 * forgiven once (the "freeze") — so a single skipped week doesn't reset it.
 */
function streakFrom(weeks: string[], currentWeek: string): number {
  const active = new Set(weeks.map((w) => Date.parse(w)));
  let streak = 0;
  let freezeUsed = false;
  let first = true;
  let w = Date.parse(currentWeek);
  // Walk back at most ~2 years as a safety bound.
  for (let i = 0; i < 110; i++, w -= WEEK_MS) {
    if (active.has(w)) {
      streak++;
      first = false;
    } else if (first) {
      first = false; // current week not started yet — grace, not a break
    } else if (!freezeUsed) {
      freezeUsed = true; // forgive one missed week
    } else {
      break;
    }
  }
  return streak;
}

function buildBadges(d: {
  reports: number;
  quizzes: number;
  classes: number;
  points: number;
  streak: number;
  perfectWeek: boolean;
}): Badge[] {
  return [
    { key: 'first_report', label: 'First reflection', emoji: '📝', earned: d.reports >= 1 },
    { key: 'perfect_week', label: 'Perfect week', emoji: '🌟', earned: d.perfectWeek },
    { key: 'quiz_whiz', label: 'Quiz whiz', emoji: '⚡', earned: d.quizzes >= 5 },
    { key: 'streak_3', label: 'On a roll', emoji: '🔥', earned: d.streak >= 3 },
    { key: 'century', label: 'Century club', emoji: '💯', earned: d.points >= 100 },
    { key: 'streak_6', label: 'Unstoppable', emoji: '🚀', earned: d.streak >= 6 },
  ];
}

const reasonCount = (s: PointsSummary, reason: string) =>
  s.by_reason.find((r) => r.reason === reason)?.count ?? 0;

/** Streak + badges for a student, given their already-computed points summary. */
export async function getStreakAndBadges(
  db: Pool,
  userId: number,
  summary: PointsSummary,
): Promise<{ streak: number; badges: Badge[] }> {
  const { weeks, perfectWeek, currentWeek } = await weekData(db, userId);
  const streak = streakFrom(weeks, currentWeek);
  const badges = buildBadges({
    reports: reasonCount(summary, 'weekly_report'),
    quizzes: reasonCount(summary, 'quiz_completed'),
    classes: reasonCount(summary, 'class_attended'),
    points: summary.total,
    streak,
    perfectWeek,
  });
  return { streak, badges };
}

/** Just the streak (for the parent weekly card). */
export async function computeStreak(db: Pool, userId: number): Promise<number> {
  const { weeks, currentWeek } = await weekData(db, userId);
  return streakFrom(weeks, currentWeek);
}
