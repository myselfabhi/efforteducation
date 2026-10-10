-- 008 — Young Scholar: add 'parent' to the user_role enum.
-- Named *step1*enum* so the migrate runner applies it auto-commit: ALTER TYPE
-- ADD VALUE must not share a transaction with code that reads the new value.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'parent';
