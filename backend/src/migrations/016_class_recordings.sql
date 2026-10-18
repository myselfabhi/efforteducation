-- Automatic class recordings (Phase 3): RealtimeKit records each live class and
-- fires a webhook when the file is ready; we copy it into our R2 and store the
-- URL. live_classes already has recording_url (migration 002) + a student
-- "Watch recording" button; these two columns track the RealtimeKit lifecycle.

ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS recording_id TEXT;
-- NULL (never started) | STARTING | RECORDING | UPLOADED | ERRORED
ALTER TABLE live_classes ADD COLUMN IF NOT EXISTS recording_status TEXT;

CREATE INDEX IF NOT EXISTS idx_live_classes_recording_id ON live_classes (recording_id);
