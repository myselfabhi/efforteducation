-- Effort (Scholar) Points — a persistent, cumulative profile that rewards
-- SHOWING UP, not performance: writing a weekly report, attending a live class,
-- completing a quiz. Fixes the "scores reset every quiz, no cumulative progress"
-- gap. One ledger row per earned award; unique per source so points are awarded
-- exactly once and the ledger can be reconciled idempotently on read.

CREATE TABLE IF NOT EXISTS effort_points (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points      INTEGER NOT NULL,
  reason      VARCHAR(48) NOT NULL,   -- 'weekly_report' | 'class_attended' | 'quiz_completed'
  source_type VARCHAR(32) NOT NULL,   -- 'report' | 'class' | 'quiz'
  source_id   INTEGER NOT NULL,       -- the report / live_class / quiz id
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, source_type, source_id)
);

CREATE INDEX IF NOT EXISTS idx_effort_points_user ON effort_points (user_id, created_at DESC);
