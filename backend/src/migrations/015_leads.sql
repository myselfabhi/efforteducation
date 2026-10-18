-- Leads (Phase 3 ops tooling): "Book a call" submissions, captured so they live
-- somewhere the team can work them — not only in a one-off WhatsApp message.

CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(160) NOT NULL,
  phone       VARCHAR(40) NOT NULL,
  email       VARCHAR(255),
  interest    VARCHAR(80),                 -- e.g. 'Young Scholar (Class 4–8)'
  message     TEXT,
  source      VARCHAR(40) NOT NULL DEFAULT 'contact_form',
  status      VARCHAR(16) NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
  note        TEXT,                         -- staff follow-up note
  handled_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status, created_at DESC);
