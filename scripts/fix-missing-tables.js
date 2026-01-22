#!/usr/bin/env node
const { Client } = require('pg')

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    console.error('fix-missing-tables: DATABASE_URL not set')
    process.exit(1)
  }

  // Allow self-signed / managed certificates — many hosts require ssl
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

  await client.connect()
  try {
    await client.query('BEGIN')

    // Create users table if missing
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" text NOT NULL,
        "email" text,
        "passwordHash" text NOT NULL,
        "name" text,
        "createdAt" timestamptz DEFAULT now(),
        "updatedAt" timestamptz DEFAULT now()
      );
    `)
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "users_username_unique" ON "users" ("username");`)
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "users_email_unique" ON "users" ("email");`)

    // Ensure users columns exist (in case table existed but columns missing)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('users') AND lower(column_name)=lower('passwordHash')) THEN
          ALTER TABLE "users" ADD COLUMN "passwordHash" text NOT NULL DEFAULT '';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('users') AND lower(column_name)=lower('username')) THEN
          ALTER TABLE "users" ADD COLUMN "username" text NOT NULL DEFAULT '';
        END IF;
      END
      $$;
    `)

    // Create races table if missing
    await client.query(`
      CREATE TABLE IF NOT EXISTS "races" (
        "id" SERIAL PRIMARY KEY,
        "externalId" integer UNIQUE NOT NULL,
        "title" text NOT NULL,
        "date" text NOT NULL,
        "location" text NOT NULL,
        "distance" text NOT NULL,
        "category" text NOT NULL,
        "description" text NOT NULL,
        "websiteUrl" text,
        "registrationUrl" text,
        "createdAt" timestamptz DEFAULT now(),
        "updatedAt" timestamptz DEFAULT now()
      );
    `)
    await client.query(`CREATE UNIQUE INDEX IF NOT EXISTS "races_externalId_unique" ON "races" ("externalId");`)

    // Ensure races columns exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('races') AND lower(column_name)=lower('externalId')) THEN
          ALTER TABLE "races" ADD COLUMN "externalId" integer UNIQUE;
        END IF;
      END
      $$;
    `)

    // Create registrations table if missing
    await client.query(`
      CREATE TABLE IF NOT EXISTS "registrations" (
        "id" SERIAL PRIMARY KEY,
        "raceId" integer NOT NULL,
        "userId" integer,
        "name" text NOT NULL,
        "surname" text NOT NULL,
        "email" text NOT NULL,
        "preferredDistance" text,
        "registrationDate" timestamptz DEFAULT now(),
        "createdAt" timestamptz DEFAULT now()
      );
    `)
    await client.query(`CREATE INDEX IF NOT EXISTS "registrations_raceId_index" ON "registrations" ("raceId");`)

    // Ensure registrations columns exist (add missing columns if table existed without them)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('registrations') AND lower(column_name)=lower('userid')) THEN
          ALTER TABLE "registrations" ADD COLUMN "userId" integer;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('registrations') AND lower(column_name)=lower('surname')) THEN
          ALTER TABLE "registrations" ADD COLUMN "surname" text;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('registrations') AND lower(column_name)=lower('preferreddistance')) THEN
          ALTER TABLE "registrations" ADD COLUMN "preferredDistance" text;
        END IF;
      END
      $$;
    `)

    // Add fk constraint from registrations(raceId) -> races(id) if not exists and columns exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'registrations_race_fk') THEN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('registrations') AND lower(column_name)=lower('raceid'))
             AND EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('races') AND lower(column_name)=lower('id')) THEN
            ALTER TABLE "registrations" ADD CONSTRAINT registrations_race_fk FOREIGN KEY ("raceId") REFERENCES "races"("id") ON DELETE CASCADE;
          END IF;
        END IF;
      END
      $$;
    `)

    // Add fk constraint from registrations(userId) -> users(id) if not exists and columns exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'registrations_user_fk') THEN
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('registrations') AND lower(column_name)=lower('userid'))
             AND EXISTS (SELECT 1 FROM information_schema.columns WHERE lower(table_name)=lower('users') AND lower(column_name)=lower('id')) THEN
            ALTER TABLE "registrations" ADD CONSTRAINT registrations_user_fk FOREIGN KEY ("userId") REFERENCES "users"("id");
          END IF;
        END IF;
      END
      $$;
    `)

    await client.query('COMMIT')
    console.log('fix-missing-tables: finished successfully')
    process.exit(0)
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('fix-missing-tables: error', e && e.message ? e.message : e)
    process.exit(2)
  } finally {
    await client.end().catch(() => {})
  }
}

main()
