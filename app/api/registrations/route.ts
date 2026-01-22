import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, Prisma } from "@prisma/client"

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set')
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { raceId, name, surname, email, preferredDistance } = body

    // Optionally get authenticated user from Bearer header or httpOnly cookie
    let token: string | null = null
    const auth = request.headers.get('authorization')
    if (auth && auth.startsWith('Bearer ')) {
      token = auth.replace(/^Bearer\s+/i, '')
    } else {
      const cookie = request.cookies.get('rp_token')
      token = cookie?.value || null
    }

    let user: any = null
    if (token) {
      try {
        const payload: any = (await import('../../../lib/auth')).verifyToken(token)
        if (payload?.id) {
          user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, name: true, email: true } })
        }
      } catch (e) {
        // ignore invalid token
        user = null
      }
    }

    // Validate input: if not authenticated, require name/email
    if (!raceId || (!user && (!name || !surname || !email))) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if race exists
    let race = null
    try {
      race = await prisma.race.findUnique({
        where: { externalId: raceId },
      })
    } catch (err: any) {
      // If missing table, attempt to sync db and retry once
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2021') {
        console.warn('Detected missing table while finding race, attempting DB sync...')
        const res = await (await import('../../../lib/db-utils')).ensureDatabaseSync()
        console.warn('DB sync result:', res)
        // retry
        race = await prisma.race.findUnique({ where: { externalId: raceId } })
      } else {
        throw err
      }
    }

    if (!race) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 })
    }

    // Create registration
    let registration = null
    try {
      registration = await prisma.registration.create({
        data: {
          raceId: race.id,
          userId: user?.id || null,
          name: user?.name || name,
          surname: surname || '',
          email: user?.email || email,
          preferredDistance: preferredDistance || null,
        },
      })
    } catch (err: any) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2021') {
        console.warn('Detected missing registration table, attempting DB sync...')
        const res = await (await import('../../../lib/db-utils')).ensureDatabaseSync()
        console.warn('DB sync result:', res)
        registration = await prisma.registration.create({
          data: {
            raceId: race.id,
            userId: user?.id || null,
            name: user?.name || name,
            surname: surname || '',
            email: user?.email || email,
            preferredDistance: preferredDistance || null,
          },
        })
      } else {
        throw err
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        registration,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to register. Please try again." },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const raceId = request.nextUrl.searchParams.get("raceId")

    if (!raceId) {
      return NextResponse.json({ error: "Missing raceId parameter" }, { status: 400 })
    }

    // Get race by externalId
    const race = await prisma.race.findUnique({
      where: { externalId: parseInt(raceId) },
      include: {
        registrations: {
          orderBy: { registrationDate: "desc" },
        },
      },
    })

    if (!race) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 })
    }

    return NextResponse.json(race)
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    )
  }
}
