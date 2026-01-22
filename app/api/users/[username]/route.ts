import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_req: NextRequest) {
  try {
    const username = _req.nextUrl.pathname.split('/').pop()
    if (!username) return NextResponse.json({ error: 'Missing username' }, { status: 400 })

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        createdAt: true,
        registrations: {
          orderBy: { registrationDate: 'desc' },
          include: { race: true },
        },
      },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Transform registrations to a simpler list of races
    const attended = user.registrations?.map((r) => ({
      registrationId: r.id,
      registrationDate: r.registrationDate,
      preferredDistance: r.preferredDistance,
      race: r.race,
      userId: r.userId,
    })) || []

    return NextResponse.json({ user: { id: user.id, username: user.username, name: user.name, createdAt: user.createdAt, attended } })
  } catch (e: any) {
    console.error('Get user error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
