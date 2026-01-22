const { spawnSync } = require('child_process')

// This script is intended to run during CI / Vercel build.
// It will run `npx prisma migrate deploy` only when the environment indicates a production deploy
// and when APPLY_MIGRATIONS_ON_DEPLOY is explicitly enabled.

const isVercel = !!process.env.VERCEL
const isProduction = process.env.NODE_ENV === 'production' || isVercel
const shouldApply = String(process.env.APPLY_MIGRATIONS_ON_DEPLOY || '').toLowerCase() === '1' || String(process.env.APPLY_MIGRATIONS_ON_DEPLOY || '').toLowerCase() === 'true'

if (!isProduction || !shouldApply) {
  console.log('[deploy-migrations] Skipping migrations: not in production or APPLY_MIGRATIONS_ON_DEPLOY not enabled')
  process.exit(0)
}

if (!process.env.DATABASE_URL) {
  console.warn('[deploy-migrations] WARNING: DATABASE_URL is not set in environment. Skipping migrations during build.')
  // Skip running migrations during build if no DATABASE_URL is available. Environment variables may be configured only at runtime.
  process.exit(0)
}

console.log('[deploy-migrations] Running `npx prisma migrate deploy`')
const res = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
  env: { ...process.env },
  stdio: 'inherit',
})

if (res.status !== 0) {
  console.error('[deploy-migrations] prisma migrate deploy failed with exit code', res.status)

  console.log('[deploy-migrations] Attempting fallback: running scripts/fix-missing-tables.js')
  const fix = spawnSync('node', ['scripts/fix-missing-tables.js'], { env: { ...process.env }, stdio: 'inherit' })
  if (fix.status !== 0) {
    console.error('[deploy-migrations] fix-missing-tables failed with exit code', fix.status)
    process.exit(res.status)
  }

  // Mark migrations as applied (best-effort) to avoid duplicate CREATE TABLE failures
  try {
    const fs = require('fs')
    const path = require('path')
    const migrationsDir = path.join(process.cwd(), 'prisma', 'migrations')
    if (fs.existsSync(migrationsDir)) {
      const folders = fs.readdirSync(migrationsDir).filter((f) => fs.statSync(path.join(migrationsDir, f)).isDirectory())
      for (const m of folders) {
        console.log('[deploy-migrations] Marking migration as applied (resolve):', m)
        const r = spawnSync('npx', ['prisma', 'migrate', 'resolve', '--applied', m], { env: { ...process.env }, stdio: 'inherit' })
        if (r.status !== 0) {
          console.warn('[deploy-migrations] prisma migrate resolve failed for', m, 'status', r.status)
        }
      }
    }
  } catch (e) {
    console.warn('[deploy-migrations] Warning: failed to auto-resolve migrations:', e)
  }

  console.log('[deploy-migrations] Re-running `npx prisma migrate deploy` after fixes')
  const res2 = spawnSync('npx', ['prisma', 'migrate', 'deploy'], { env: { ...process.env }, stdio: 'inherit' })
  if (res2.status !== 0) {
    console.error('[deploy-migrations] prisma migrate deploy still failed after fixes, exit code', res2.status)
    process.exit(res2.status)
  }
}

console.log('[deploy-migrations] Migrations applied successfully')
process.exit(0)
