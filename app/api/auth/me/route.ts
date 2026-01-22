import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function GET(req: NextRequest) {
  try {
    // Support either Bearer header or httpOnly cookie (rp_token)
    let token: string | null = null
    const auth = req.headers.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.replace(/^Bearer\s+/i, '')
    } else {
      const cookie = req.cookies.get('rp_token')
      token = cookie?.value || null
    }

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload: any = verifyToken(token)
    if (!payload?.id) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, username: true, name: true } })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({ user })
  } catch (e: any) {
    console.error('Auth me error:', e)
    return NextResponse.json({ error: String(e?.message || e) }, { status: 401 })
  }
}
