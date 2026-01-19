import { NextRequest, NextResponse } from 'next/server'
import { ensureDatabaseSync } from '../../../../lib/db-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const password = body?.password || req.headers.get('x-admin-password')

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Server ADMIN_PASSWORD not set' }, { status: 500 })
    }

    if (!password || password !== process.env.ADMIN_PASSWORD.trim()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const res = await ensureDatabaseSync()

    return NextResponse.json({ success: res.success, stdout: res.stdout, stderr: res.stderr })
  } catch (e: any) {
    console.error('Admin ensure-db error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}