-- Migration: require email on User
-- This migration sets placeholder unique emails for existing users without email
-- then makes the column NOT NULL to match the Prisma schema change.

BEGIN;

-- Assign unique placeholder emails to users that currently have NULL email
UPDATE "users" SET email = 'user-' || id || '@no-email.local' WHERE email IS NULL;

-- Make the email column NOT NULL
ALTER TABLE "users" ALTER COLUMN email SET NOT NULL;

COMMIT;