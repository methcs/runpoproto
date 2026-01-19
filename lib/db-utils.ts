import { spawnSync } from 'child_process'

export async function ensureDatabaseSync(): Promise<{ success: boolean; stdout: string; stderr: string }>
{
  const isProd = process.env.NODE_ENV === 'production'
  const DATABASE_URL = process.env.DATABASE_URL

  if (!DATABASE_URL) {
    return { success: false, stdout: '', stderr: 'DATABASE_URL not set in environment' }
  }

  try {
    if (isProd) {
      // In production try to run migrations (safer than db push) — this requires migrations created and available
      const result = spawnSync('npx', ['prisma', 'migrate', 'deploy'], {
        env: { ...process.env, DATABASE_URL },
        encoding: 'utf8',
        stdio: 'pipe',
      })

      return { success: result.status === 0, stdout: result.stdout || '', stderr: result.stderr || '' }
    }

    // In dev, db push is quick and idempotent — push the Prisma schema to the DB
    const result = spawnSync('npx', ['prisma', 'db', 'push'], {
      env: { ...process.env, DATABASE_URL },
      encoding: 'utf8',
      stdio: 'pipe',
    })

    return { success: result.status === 0, stdout: result.stdout || '', stderr: result.stderr || '' }
  } catch (e: any) {
    return { success: false, stdout: '', stderr: String(e) }
  }
}
