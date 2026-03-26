-- ============================================
-- Real-Time Quiz Platform — PostgreSQL Schema
-- ============================================

-- Enum for user roles
CREATE TYPE user_role AS ENUM ('admin', 'user');

-- Enum for quiz status
CREATE TYPE quiz_status AS ENUM ('DRAFT', 'UPCOMING', 'LIVE', 'COMPLETED');

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          user_role DEFAULT 'user',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- =====================
-- QUIZZES
-- =====================
CREATE TABLE quizzes (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  created_by    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status        quiz_status DEFAULT 'DRAFT',
  scheduled_at  TIMESTAMPTZ,
  launched_at   TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_quizzes_status ON quizzes(status);
CREATE INDEX idx_quizzes_created_by ON quizzes(created_by);

-- =====================
-- QUESTIONS
-- =====================
CREATE TABLE questions (
  id            SERIAL PRIMARY KEY,
  quiz_id       INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  time_limit    INTEGER NOT NULL DEFAULT 30,  -- seconds
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_quiz_id ON questions(quiz_id);

-- =====================
-- OPTIONS
-- =====================
CREATE TABLE options (
  id            SERIAL PRIMARY KEY,
  question_id   INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text   TEXT NOT NULL,
  is_correct    BOOLEAN DEFAULT FALSE,
  option_index  INTEGER NOT NULL DEFAULT 0   -- 0-3 for A-D
);

CREATE INDEX idx_options_question_id ON options(question_id);

-- =====================
-- RESPONSES (persisted from Redis after quiz ends)
-- =====================
CREATE TABLE responses (
  id            SERIAL PRIMARY KEY,
  quiz_id       INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id   INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  selected_option_id INTEGER REFERENCES options(id),
  is_correct    BOOLEAN DEFAULT FALSE,
  response_time_ms INTEGER NOT NULL DEFAULT 0,  -- milliseconds to answer
  score         INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quiz_id, question_id, user_id)
);

CREATE INDEX idx_responses_quiz_id ON responses(quiz_id);
CREATE INDEX idx_responses_user_id ON responses(user_id);
CREATE INDEX idx_responses_question_id ON responses(question_id);

-- =====================
-- SCORES (final per-quiz scores, persisted after quiz ends)
-- =====================
CREATE TABLE scores (
  id              SERIAL PRIMARY KEY,
  quiz_id         INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_score     INTEGER NOT NULL DEFAULT 0,
  total_time_ms   INTEGER NOT NULL DEFAULT 0,  -- total response time (tie-breaker)
  rank            INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(quiz_id, user_id)
);

CREATE INDEX idx_scores_quiz_id ON scores(quiz_id);
CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_ranking ON scores(quiz_id, total_score DESC, total_time_ms ASC);
