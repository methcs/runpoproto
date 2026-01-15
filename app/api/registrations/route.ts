import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

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
    const { raceId, name, surname, email } = body

    // Validate input
    if (!raceId || !name || !surname || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if race exists
    const race = await prisma.race.findUnique({
      where: { externalId: raceId },
    })

    if (!race) {
      return NextResponse.json({ error: "Race not found" }, { status: 404 })
    }

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        raceId: race.id,
        name,
        surname,
        email,
      },
    })

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
