-- 006: hybrid request-to-join enrolment.
--
-- Students browse /courses/:slug, click "Request to join" on a batch, and
-- the row lands in `pending` state. Any teacher of that batch (or any
-- super_admin) can then approve or decline. On approve, a `batch_students`
-- row is inserted alongside.
--
-- The partial unique index allows historical declined/cancelled rows to
-- coexist with a fresh pending request from the same student.
CREATE TABLE IF NOT EXISTS batch_enrolment_requests (
  id            SERIAL PRIMARY KEY,
  batch_id      INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  student_id    INTEGER NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  status        VARCHAR(16) NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'approved', 'declined', 'cancelled')),
  message       TEXT,
  note          TEXT,                      -- decision note from approver
  requested_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  decided_at    TIMESTAMPTZ,
  decided_by    INTEGER REFERENCES users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_one_pending_request_per_pair
  ON batch_enrolment_requests (batch_id, student_id)
  WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_enrol_requests_batch
  ON batch_enrolment_requests (batch_id, status);

CREATE INDEX IF NOT EXISTS idx_enrol_requests_student
  ON batch_enrolment_requests (student_id, status);
