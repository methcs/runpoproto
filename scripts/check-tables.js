#!/usr/bin/env node
const { Client } = require('pg')

async function main() {
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    console.error('check-tables: DATABASE_URL not set')
    process.exit(1)
  }

  const c = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await c.connect()
  try {
    const r = await c.query(`SELECT to_regclass('public.users') AS users, to_regclass('public.races') AS races, to_regclass('public.registrations') AS registrations`)
    console.log('tables:', r.rows[0])
    process.exit(0)
  } catch (e) {
    console.error('check-tables error:', e && e.message ? e.message : e)
    process.exit(2)
  } finally {
    await c.end().catch(() => {})
  }
}

main()
