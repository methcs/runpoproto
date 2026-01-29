import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { signToken } from '../../../../lib/auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, email, password, name } = body

    // Validate inputs
    if (!username || !password || !email) {
      return NextResponse.json({ error: 'username, email and password are required' }, { status: 400 })
    }

    // Basic email format check
    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // check existing
    const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
    if (existing) {
      return NextResponse.json({ error: 'Username or email already taken' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { username, email: email || null, passwordHash, name: name || null },
      select: { id: true, username: true, email: true, name: true, createdAt: true },
    })

    const token = signToken({ id: user.id, username: user.username })
    const res = NextResponse.json({ success: true, user }, { status: 201 })
    res.cookies.set('rp_token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })

    return res
  } catch (e: any) {
    console.error('Signup error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
