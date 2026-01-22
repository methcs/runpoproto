import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Support cookie auth
    const cookie = req.cookies.get('rp_token')
    const token = cookie?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = verifyToken(token)
    if (!payload?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, username: true, name: true, email: true, createdAt: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch (e: any) {
    console.error('GET /api/users/me error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const cookie = req.cookies.get('rp_token')
    const token = cookie?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = verifyToken(token)
    if (!payload?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const body = await req.json()
    const { name, email } = body

    const updated = await prisma.user.update({ where: { id: payload.id }, data: { name: name || null, email: email || null }, select: { id: true, username: true, name: true, email: true } })

    return NextResponse.json({ user: updated })
  } catch (e: any) {
    console.error('PATCH /api/users/me error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}