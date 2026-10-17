-- Skill mastery (Phase 3, two-axis progress): the "skill" half, derived from
-- quiz performance. A quiz is tagged with one skill; a child's mastery of that
-- skill is computed from their accuracy on its quizzes (see services/mastery.ts).

CREATE TABLE IF NOT EXISTS skills (
  id          SERIAL PRIMARY KEY,
  key         VARCHAR(40) UNIQUE NOT NULL,     -- stable slug, e.g. 'fast_maths'
  name        VARCHAR(80) NOT NULL,
  emoji       VARCHAR(8),
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- A quiz measures at most one skill. Nullable: untagged quizzes don't count
-- toward mastery. Mirrors how quizzes.batch_id was added.
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS skill_id INTEGER REFERENCES skills(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_quizzes_skill ON quizzes (skill_id);

-- Seed the default Young Scholar set (all quiz-measurable). Admin-editable later;
-- ON CONFLICT keeps any edits on re-run.
INSERT INTO skills (key, name, emoji, sort_order) VALUES
  ('fast_maths',    'Fast Maths',            '🔢', 1),
  ('reasoning',     'Reasoning & Logic',     '🧩', 2),
  ('world_gk',      'World & GK',            '🌍', 3),
  ('reading_vocab', 'Reading & Vocabulary',  '📖', 4),
  ('current_affairs','Current Affairs',      '📰', 5)
ON CONFLICT (key) DO NOTHING;
