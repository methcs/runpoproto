const { spawnSync } = require('child_process')

function ensureDatabaseSync() {
  const isProd = process.env.NODE_ENV === 'production'
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL) {
    console.error('DATABASE_URL not set')
    process.exit(1)
  }

  try {
    if (isProd) {
      const r = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
        env: { ...process.env, DATABASE_URL },
        stdio: 'inherit',
      })
      process.exit(r.status || 0)
    }

    const r = spawnSync('npx', ['prisma', 'db', 'push'], {
      env: { ...process.env, DATABASE_URL },
      stdio: 'inherit',
    })
    process.exit(r.status || 0)
  } catch (e) {
    console.error('Error running ensure-db:', e)
    process.exit(1)
  }
}

ensureDatabaseSync()
