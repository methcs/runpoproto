import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ success: true })
  res.cookies.set('rp_token', '', { httpOnly: true, path: '/', maxAge: 0, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' })
  return res
}
