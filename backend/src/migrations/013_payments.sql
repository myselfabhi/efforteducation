-- Online checkout (Phase 3): named plans an admin manages, offers a counsellor
-- assigns to a family, and a record of each Razorpay payment attempt.
-- Amounts are stored in PAISE (Razorpay's unit) to avoid rounding — ₹ = /100.

-- A small set of privately-priced, named plans. Prices are never shown publicly;
-- a counsellor quotes one at checkout by assigning it to a family (see offers).
CREATE TABLE IF NOT EXISTS payment_plans (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(160) NOT NULL,
  description    TEXT,
  amount_paise   INTEGER NOT NULL CHECK (amount_paise > 0),
  currency       VARCHAR(3) NOT NULL DEFAULT 'INR',
  interval_label VARCHAR(40),                 -- display only, e.g. 'per month', 'one term'
  course_id      INTEGER REFERENCES courses(id) ON DELETE SET NULL,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- An offer ties a plan to a specific family: "pay this to confirm your child's
-- seat". Created by an admin/counsellor; the parent (guardian) is who pays.
CREATE TABLE IF NOT EXISTS enrolment_offers (
  id          SERIAL PRIMARY KEY,
  guardian_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  batch_id    INTEGER REFERENCES batches(id) ON DELETE SET NULL,
  plan_id     INTEGER NOT NULL REFERENCES payment_plans(id) ON DELETE RESTRICT,
  status      VARCHAR(16) NOT NULL DEFAULT 'offered'
                CHECK (status IN ('offered', 'paid', 'cancelled')),
  note        TEXT,
  created_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at     TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_offers_guardian ON enrolment_offers (guardian_id, status);
CREATE INDEX IF NOT EXISTS idx_offers_student  ON enrolment_offers (student_id);

-- One row per Razorpay checkout attempt. The amount is copied from the plan at
-- order time (never trusted from the client); razorpay_order_id is unique so a
-- verify can't be replayed against a different row.
CREATE TABLE IF NOT EXISTS payments (
  id                  SERIAL PRIMARY KEY,
  offer_id            INTEGER REFERENCES enrolment_offers(id) ON DELETE SET NULL,
  guardian_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  student_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  plan_id             INTEGER REFERENCES payment_plans(id) ON DELETE SET NULL,
  amount_paise        INTEGER NOT NULL,
  currency            VARCHAR(3) NOT NULL DEFAULT 'INR',
  razorpay_order_id   VARCHAR(64) UNIQUE,
  razorpay_payment_id VARCHAR(64),
  razorpay_signature  VARCHAR(255),
  status              VARCHAR(16) NOT NULL DEFAULT 'created'
                        CHECK (status IN ('created', 'paid', 'failed')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at             TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_payments_guardian ON payments (guardian_id, status);
