-- ============================================================
-- 004 · Enforce one response per (quiz, question, user) at DB level
--       and add useful performance indexes
-- ============================================================

-- Prevent duplicate responses even if Redis SETNX is bypassed
ALTER TABLE responses
  ADD CONSTRAINT IF NOT EXISTS uq_responses_quiz_question_user
  UNIQUE (quiz_id, question_id, user_id);

-- Speed up leaderboard / results lookups
CREATE INDEX IF NOT EXISTS idx_responses_quiz_user   ON responses(quiz_id, user_id);
CREATE INDEX IF NOT EXISTS idx_scores_quiz_rank      ON scores(quiz_id, rank);
