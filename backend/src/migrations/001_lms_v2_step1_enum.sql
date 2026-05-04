-- ============================================
-- LMS v2 — Step 1: extend user_role enum
-- Run this in its own deploy/transaction-free step.
-- Postgres ALTER TYPE ADD VALUE cannot be used in
-- the same transaction as code that reads the new
-- value, so we isolate it.
-- ============================================

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'teacher';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'student';
