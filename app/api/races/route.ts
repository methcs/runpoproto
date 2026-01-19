import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

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

// Helper: on missing-table errors (P2021) try to sync schema (dev: db push, prod: migrate deploy)
import { ensureDatabaseSync } from '../../../lib/db-utils'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, date, location, distance, category, description, websiteUrl, registrationUrl } = body

    // Validation
    if (!title || !date || !location || !distance || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate a unique external ID (use timestamp + random to avoid unique constraint collisions)
    // Try a few times in case of rare collisions on externalId (unique constraint)
    for (let attempt = 0; attempt < 5; attempt++) {
      // Use seconds since epoch (fits into 32-bit signed int) + small random component
      const externalId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000)
      try {
        const race = await prisma.race.create({
          data: {
            externalId,
            title,
            date,
            location,
            distance,
            category,
            description: description || '',
            websiteUrl: websiteUrl || '',
            registrationUrl: registrationUrl || '',
          },
        })

        return NextResponse.json(race, { status: 201 })
      } catch (err: any) {
        // If the table doesn't exist (P2021), try to sync the schema and retry once
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2021') {
          console.warn('Detected missing table, attempting to sync DB schema...')
          const res = await ensureDatabaseSync()
          console.warn('DB sync result:', res)
          // Attempt the create once more after sync
          try {
            const race = await prisma.race.create({
              data: {
                externalId,
                title,
                date,
                location,
                distance,
                category,
                description: description || '',
                websiteUrl: websiteUrl || '',
                registrationUrl: registrationUrl || '',
              },
            })
            return NextResponse.json(race, { status: 201 })
          } catch (err2: any) {
            console.error('Retry after DB sync failed:', err2)
            return NextResponse.json(
              { error: process.env.NODE_ENV === 'production' ? 'Failed to create race' : String(err2) },
              { status: 500 }
            )
          }
        }

        // If unique constraint on externalId occurs, retry; otherwise bubble up
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002' &&
          (err.meta as any)?.target?.includes('externalId')
        ) {
          // collision — try again
          continue
        }
        throw err
      }
    }

    // If we reach here, we failed to generate a unique externalId after several attempts
    return NextResponse.json({ error: 'Failed to generate a unique externalId' }, { status: 500 })
  } catch (error: any) {
    console.error('Error creating race:', error)
    const isProd = process.env.NODE_ENV === 'production'
    return NextResponse.json(
      { error: isProd ? 'Failed to create race' : error?.message || String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const races = await prisma.race.findMany({
      orderBy: { date: 'asc' },
      include: {
        registrations: {
          select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            registrationDate: true,
          },
        },
      },
    })

    // Transform registrations array to participants
    const racesWithParticipants = races.map((race) => ({
      ...race,
      participants: race.registrations,
      registrations: undefined,
    }))

    return NextResponse.json(racesWithParticipants)
  } catch (error: any) {
    console.error('Error fetching races:', error)
    // If tables missing, attempt to sync and retry once (dev-friendly)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021') {
      console.warn('Detected missing table when fetching races — attempting to sync DB')
      const res = await ensureDatabaseSync()
      console.warn('DB sync result:', res)
      try {
        const racesRetry = await prisma.race.findMany({
          orderBy: { date: 'asc' },
          include: {
            registrations: {
              select: {
                id: true,
                name: true,
                surname: true,
                email: true,
                registrationDate: true,
              },
            },
          },
        })

        const racesWithParticipantsRetry = racesRetry.map((race) => ({
          ...race,
          participants: race.registrations,
          registrations: undefined,
        }))

        return NextResponse.json(racesWithParticipantsRetry)
      } catch (err2) {
        console.error('Retry fetch after db sync failed:', err2)
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch races' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Race ID is required' },
        { status: 400 }
      )
    }

    // Delete registrations first (due to foreign key)
    await prisma.registration.deleteMany({
      where: { raceId: id },
    })

    // Then delete the race
    const race = await prisma.race.delete({
      where: { id },
    })

    return NextResponse.json(race)
  } catch (error) {
    console.error('Error deleting race:', error)
    return NextResponse.json(
      { error: 'Failed to delete race' },
      { status: 500 }
    )
  }
}
