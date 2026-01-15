import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    // Generate a simple external ID (can be customized)
    const externalId = Math.floor(Math.random() * 100000)

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
  } catch (error) {
    console.error('Error creating race:', error)
    return NextResponse.json(
      { error: 'Failed to create race' },
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
  } catch (error) {
    console.error('Error fetching races:', error)
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
