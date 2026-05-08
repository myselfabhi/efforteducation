-- ============================================================
-- 003 · Quiz UX additions: per-question explanations + anti-cheat violations log
-- ============================================================

-- Optional teacher-authored explanation, surfaced on the results page
ALTER TABLE questions ADD COLUMN IF NOT EXISTS explanation TEXT;

-- Anti-cheat: track focus-loss / suspicious events per quiz attempt.
-- 2nd violation in a quiz triggers an auto-submit on the active question
-- (handled in the socket controller).
CREATE TABLE IF NOT EXISTS quiz_violations (
  id           SERIAL PRIMARY KEY,
  quiz_id      INTEGER NOT NULL REFERENCES quizzes(id)   ON DELETE CASCADE,
  user_id      INTEGER NOT NULL REFERENCES users(id)     ON DELETE CASCADE,
  question_id  INTEGER          REFERENCES questions(id) ON DELETE SET NULL,
  kind         TEXT    NOT NULL,
  occurred_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_violations_quiz_user ON quiz_violations(quiz_id, user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_violations_occurred_at ON quiz_violations(occurred_at);
