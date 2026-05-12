-- 007: per-quiz answer-change grace period.
--
-- During the first `answer_grace_period_ms` after a player's FIRST click on a
-- question they may change their selection; the LATEST option is what gets
-- scored. The FIRST click's time-to-respond is preserved so the Kahoot-style
-- time bonus still rewards quick recognition (a 5-second-late "change of
-- mind" doesn't downgrade your time bonus).
--
-- Default 3000 ms (3 s). 0 disables the grace period entirely (classic Kahoot
-- behaviour). Range capped at 10 s in the API.
ALTER TABLE quizzes
  ADD COLUMN IF NOT EXISTS answer_grace_period_ms INTEGER NOT NULL DEFAULT 3000;

-- Defensive: clamp any value already in the table to a sane range.
UPDATE quizzes
   SET answer_grace_period_ms = LEAST(GREATEST(answer_grace_period_ms, 0), 10000)
 WHERE answer_grace_period_ms NOT BETWEEN 0 AND 10000;
