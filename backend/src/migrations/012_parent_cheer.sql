-- Parent cheer — a one-tap encouragement a guardian can send on their child's
-- weekly report, separate from the teacher's cheer. Closes the loop with
-- encouragement, not a score.

ALTER TABLE weekly_reports
  ADD COLUMN IF NOT EXISTS parent_cheered_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS parent_cheered_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
