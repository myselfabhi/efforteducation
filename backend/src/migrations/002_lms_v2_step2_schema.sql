-- ============================================
-- LMS v2 — Step 2: backfill roles + new tables
-- Safe to run in a transaction.
-- ============================================

-- Backfill existing rows to new role names
UPDATE users SET role = 'super_admin' WHERE role = 'admin';
UPDATE users SET role = 'student'     WHERE role = 'user';

-- =====================
-- USER PROFILE FIELDS
-- =====================
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS class_grade TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

-- =====================
-- COURSES (catalog, replaces hardcoded frontend data)
-- =====================
CREATE TABLE IF NOT EXISTS courses (
  id              SERIAL PRIMARY KEY,
  slug            VARCHAR(120) UNIQUE NOT NULL,
  title           VARCHAR(255) NOT NULL,
  category        VARCHAR(64) NOT NULL,
  description     TEXT,
  duration_months INTEGER,
  price_inr       INTEGER,
  hero_image_url  TEXT,
  highlights      JSONB,
  is_published    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_courses_category  ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_published ON courses(is_published);

-- =====================
-- BATCHES
-- =====================
CREATE TABLE IF NOT EXISTS batches (
  id                   SERIAL PRIMARY KEY,
  course_id            INTEGER NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  name                 VARCHAR(255) NOT NULL,
  start_date           DATE NOT NULL,
  end_date             DATE,
  schedule_description TEXT,
  capacity             INTEGER,
  status               VARCHAR(32) NOT NULL DEFAULT 'upcoming',
  created_by           INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batches_course ON batches(course_id);
CREATE INDEX IF NOT EXISTS idx_batches_status ON batches(status);

-- =====================
-- BATCH ↔ TEACHERS (many-to-many)
-- =====================
CREATE TABLE IF NOT EXISTS batch_teachers (
  batch_id    INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  teacher_id  INTEGER NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  is_primary  BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (batch_id, teacher_id)
);

CREATE INDEX IF NOT EXISTS idx_batch_teachers_teacher ON batch_teachers(teacher_id);

-- =====================
-- BATCH ↔ STUDENTS (many-to-many)
-- =====================
CREATE TABLE IF NOT EXISTS batch_students (
  batch_id    INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  student_id  INTEGER NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status      VARCHAR(32) DEFAULT 'active',
  PRIMARY KEY (batch_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_batch_students_student ON batch_students(student_id);

-- =====================
-- MATERIALS / NOTES
-- =====================
CREATE TABLE IF NOT EXISTS materials (
  id           SERIAL PRIMARY KEY,
  batch_id     INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  uploaded_by  INTEGER NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  type         VARCHAR(32) NOT NULL,            -- pdf|video_link|image|doc|text_note
  url          TEXT,
  text_body    TEXT,
  size_bytes   BIGINT,
  is_pinned    BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_batch ON materials(batch_id);

-- =====================
-- LIVE CLASSES (Jitsi)
-- =====================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'live_class_status') THEN
    CREATE TYPE live_class_status AS ENUM ('SCHEDULED','LIVE','ENDED','CANCELLED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS live_classes (
  id              SERIAL PRIMARY KEY,
  batch_id        INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  teacher_id      INTEGER NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end   TIMESTAMPTZ NOT NULL,
  room_id         VARCHAR(120) UNIQUE NOT NULL,
  room_password   VARCHAR(64),
  status          live_class_status DEFAULT 'SCHEDULED',
  started_at      TIMESTAMPTZ,
  ended_at        TIMESTAMPTZ,
  recording_url   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_classes_batch     ON live_classes(batch_id);
CREATE INDEX IF NOT EXISTS idx_live_classes_scheduled ON live_classes(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_live_classes_status    ON live_classes(status);

-- =====================
-- LIVE CLASS ATTENDANCE
-- =====================
CREATE TABLE IF NOT EXISTS live_class_attendance (
  id                SERIAL PRIMARY KEY,
  live_class_id     INTEGER NOT NULL REFERENCES live_classes(id) ON DELETE CASCADE,
  user_id           INTEGER NOT NULL REFERENCES users(id)        ON DELETE CASCADE,
  joined_at         TIMESTAMPTZ NOT NULL,
  left_at           TIMESTAMPTZ,
  last_heartbeat_at TIMESTAMPTZ,
  duration_seconds  INTEGER,
  UNIQUE (live_class_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_attendance_user ON live_class_attendance(user_id);

-- =====================
-- QUIZ → BATCH SCOPE (additive, doesn't break existing free-floating quizzes)
-- =====================
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL;
ALTER TABLE quizzes ADD COLUMN IF NOT EXISTS is_practice BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_quizzes_batch ON quizzes(batch_id);

-- =====================
-- ANNOUNCEMENTS PER BATCH
-- =====================
CREATE TABLE IF NOT EXISTS batch_announcements (
  id         SERIAL PRIMARY KEY,
  batch_id   INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  posted_by  INTEGER NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
  title      VARCHAR(255) NOT NULL,
  body       TEXT NOT NULL,
  is_pinned  BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_batch ON batch_announcements(batch_id);

-- =====================
-- IN-APP NOTIFICATIONS
-- =====================
CREATE TABLE IF NOT EXISTS notifications (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       VARCHAR(64) NOT NULL,
  title      VARCHAR(255) NOT NULL,
  body       TEXT,
  link_url   TEXT,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, read_at);

-- =====================
-- MIGRATIONS LEDGER
-- =====================
CREATE TABLE IF NOT EXISTS schema_migrations (
  filename   TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW()
);
