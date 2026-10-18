-- Spam-hardening for the public leads endpoint: store a salted hash of the
-- submitter IP (never the raw IP) so we can rate-limit repeated submissions.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip_hash TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_ip_recent ON leads (ip_hash, created_at);
