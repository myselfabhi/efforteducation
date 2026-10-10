-- 009 — Young Scholar: link a parent/guardian account to its children.
-- A parent is a users row with role='parent'; each child is a users row with
-- role='student' that the parent created. This table owns the relationship so a
-- parent can hold several children and a child could have more than one guardian.
CREATE TABLE IF NOT EXISTS guardian_students (
  id           SERIAL PRIMARY KEY,
  guardian_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(32) DEFAULT 'parent',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (guardian_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_guardian_students_guardian ON guardian_students (guardian_id);
CREATE INDEX IF NOT EXISTS idx_guardian_students_student  ON guardian_students (student_id);
