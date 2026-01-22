import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { usernameOrEmail, password } = body

    if (!usernameOrEmail || !password) {
      return NextResponse.json({ error: 'username/email and password required' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({ where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] } })

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: user.id, username: user.username })

    const res = NextResponse.json({ success: true, token, user: { id: user.id, username: user.username, name: user.name } })

    // Set httpOnly cookie for persistent auth (7 days)
    res.cookies.set('rp_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return res
  } catch (e: any) {
    console.error('Login error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
