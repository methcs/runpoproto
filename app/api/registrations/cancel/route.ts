import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const registrationId = body?.registrationId
    if (!registrationId) return NextResponse.json({ error: 'registrationId required' }, { status: 400 })

    const cookie = req.cookies.get('rp_token')
    const token = cookie?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = verifyToken(token)
    if (!payload?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const reg = await prisma.registration.findUnique({ where: { id: Number(registrationId) } })
    if (!reg) return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    if (reg.userId !== payload.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    await prisma.registration.delete({ where: { id: reg.id } })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('POST /api/registrations/cancel error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}