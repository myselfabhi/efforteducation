-- 005: store the Cloudflare RealtimeKit meeting id on each live class so
-- subsequent /join calls can reuse the same meeting instead of creating a new
-- one per participant.
ALTER TABLE live_classes
  ADD COLUMN IF NOT EXISTS realtimekit_meeting_id TEXT;

CREATE INDEX IF NOT EXISTS idx_live_classes_rtk_meeting
  ON live_classes (realtimekit_meeting_id)
  WHERE realtimekit_meeting_id IS NOT NULL;
