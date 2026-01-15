import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const races = body.races || []

    if (!Array.isArray(races) || races.length === 0) {
      return NextResponse.json({ error: "Invalid races data" }, { status: 400 })
    }

    // Sync each race to database
    const syncedRaces = []
    for (const race of races) {
      const existingRace = await prisma.race.findUnique({
        where: { externalId: race.id },
      })

      if (existingRace) {
        // Update existing race
        const updated = await prisma.race.update({
          where: { externalId: race.id },
          data: {
            title: race.title,
            date: race.date,
            location: race.location,
            distance: race.distance,
            category: race.category,
            description: race.description,
            websiteUrl: race.websiteUrl,
            registrationUrl: race.registrationUrl,
          },
        })
        syncedRaces.push(updated)
      } else {
        // Create new race
        const created = await prisma.race.create({
          data: {
            externalId: race.id,
            title: race.title,
            date: race.date,
            location: race.location,
            distance: race.distance,
            category: race.category,
            description: race.description,
            websiteUrl: race.websiteUrl,
            registrationUrl: race.registrationUrl,
          },
        })
        syncedRaces.push(created)
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Synced ${syncedRaces.length} races`,
        races: syncedRaces,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Sync error:", error)
    return NextResponse.json(
      { error: "Failed to sync races" },
      { status: 500 }
    )
  }
}
