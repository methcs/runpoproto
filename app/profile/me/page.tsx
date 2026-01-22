import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyToken } from '../../../lib/auth'
import { PrismaClient } from '@prisma/client'

// This route uses request cookies to perform a per-request redirect, so ensure it's treated as dynamic.
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export default async function MePage() {
  try {
    const cookieStore = await cookies()
    const cookie = cookieStore.get('rp_token')
    const token = cookie?.value
    if (!token) return redirect('/')

    const payload: any = verifyToken(token)
    if (!payload?.id) return redirect('/')

    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { username: true } })
    if (!user) return redirect('/')

    return redirect(`/profile/${user.username}`)
  } catch (e) {
    console.error('Me redirect error:', e)
    return redirect('/')
  }
}
