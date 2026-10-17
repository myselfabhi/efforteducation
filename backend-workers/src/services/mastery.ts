import type { Pool } from 'pg';

// Skill mastery derived from quiz performance. For each active skill we take the
// student's quizzes tagged with that skill, compute each quiz's accuracy
// (correct answers ÷ answered), average those per-quiz accuracies (so one long
// quiz doesn't dominate), and map the result onto a 0–5 level.

export const MASTERY_LEVELS = ['Not started', 'Starting', 'Building', 'Confident', 'Strong', 'Mastered'] as const;

export interface SkillMastery {
  skill_id: number;
  key: string;
  name: string;
  emoji: string | null;
  quizzes: number;
  accuracy_pct: number | null; // null = no quizzes taken yet
  level: number; // 0–5
  level_label: string;
  trend: number; // -1 down / 0 flat / +1 up, vs the student's average for that skill
}

function levelFromPct(pct: number): number {
  if (pct >= 88) return 5;
  if (pct >= 75) return 4;
  if (pct >= 60) return 3;
  if (pct >= 45) return 2;
  return 1;
}

export async function getMastery(db: Pool, userId: number): Promise<SkillMastery[]> {
  const rows = (
    await db.query(
      `WITH per_quiz AS (
         SELECT q.skill_id,
                q.id AS quiz_id,
                COUNT(*) FILTER (WHERE r.is_correct)::float / NULLIF(COUNT(*), 0) AS acc,
                MAX(r.created_at) AS taken_at
           FROM quizzes q
           JOIN responses r ON r.quiz_id = q.id AND r.user_id = $1
          WHERE q.skill_id IS NOT NULL
          GROUP BY q.skill_id, q.id
       ),
       agg AS (
         SELECT skill_id,
                COUNT(*)::int AS quizzes,
                AVG(acc) AS overall_acc,
                (array_agg(acc ORDER BY taken_at DESC))[1] AS latest_acc
           FROM per_quiz
          GROUP BY skill_id
       )
       SELECT s.id, s.key, s.name, s.emoji,
              COALESCE(a.quizzes, 0) AS quizzes, a.overall_acc, a.latest_acc
         FROM skills s
         LEFT JOIN agg a ON a.skill_id = s.id
        WHERE s.active = TRUE
        ORDER BY s.sort_order, s.id`,
      [userId],
    )
  ).rows as Array<{
    id: number; key: string; name: string; emoji: string | null;
    quizzes: number; overall_acc: number | null; latest_acc: number | null;
  }>;

  return rows.map((r) => {
    const quizzes = Number(r.quizzes) || 0;
    if (quizzes === 0 || r.overall_acc == null) {
      return {
        skill_id: r.id, key: r.key, name: r.name, emoji: r.emoji,
        quizzes: 0, accuracy_pct: null, level: 0, level_label: MASTERY_LEVELS[0], trend: 0,
      };
    }
    const overall = Number(r.overall_acc);
    const pct = Math.round(overall * 100);
    const level = levelFromPct(pct);
    let trend = 0;
    if (quizzes >= 2 && r.latest_acc != null) {
      const diff = Number(r.latest_acc) - overall;
      trend = diff > 0.05 ? 1 : diff < -0.05 ? -1 : 0;
    }
    return {
      skill_id: r.id, key: r.key, name: r.name, emoji: r.emoji,
      quizzes, accuracy_pct: pct, level, level_label: MASTERY_LEVELS[level], trend,
    };
  });
}
