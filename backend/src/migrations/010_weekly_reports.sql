-- Weekly Reports — the Young Scholar reflection the child writes after class.
-- Scaffolded (Rose / Thorn / Bud): went_well / tricky / next_goal, plus an
-- optional mood and work photo. Teachers respond with a cheer and/or a comment.
-- One report per student per ISO week (week_start = Monday, IST).

CREATE TABLE IF NOT EXISTS weekly_reports (
  id              SERIAL PRIMARY KEY,
  student_id      INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  batch_id        INTEGER          REFERENCES batches(id) ON DELETE SET NULL,
  week_start      DATE NOT NULL,

  -- the child's reflection (scaffolded prompts)
  went_well       TEXT,   -- Rose:  something that went great
  tricky          TEXT,   -- Thorn: something that was tricky
  next_goal       TEXT,   -- Bud:   something to try next
  mood            SMALLINT,  -- optional 1–5 "how the week felt"
  photo_url       TEXT,      -- optional photo of their work

  -- teacher feedback (the human response that makes the report worth writing)
  teacher_comment TEXT,
  commented_by    INTEGER REFERENCES users(id) ON DELETE SET NULL,
  commented_at    TIMESTAMPTZ,
  cheered_by      INTEGER REFERENCES users(id) ON DELETE SET NULL,
  cheered_at      TIMESTAMPTZ,

  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (student_id, week_start)
);

CREATE INDEX IF NOT EXISTS idx_weekly_reports_student ON weekly_reports (student_id, week_start DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_reports_batch   ON weekly_reports (batch_id,   week_start DESC);
