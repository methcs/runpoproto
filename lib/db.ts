import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function syncRacesToDatabase(races: any[]) {
  try {
    for (const race of races) {
      await prisma.race.upsert({
        where: { externalId: race.id },
        update: {
          title: race.title,
          date: race.date,
          location: race.location,
          distance: race.distance,
          category: race.category,
          description: race.description,
          websiteUrl: race.websiteUrl,
          registrationUrl: race.registrationUrl,
        },
        create: {
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
    }
    console.log(`✓ Synced ${races.length} races to database`)
  } catch (error) {
    console.error("Error syncing races:", error)
  }
}

export async function createRegistration(
  raceId: number,
  name: string,
  surname: string,
  email: string
) {
  try {
    const race = await prisma.race.findUnique({
      where: { externalId: raceId },
    })

    if (!race) {
      throw new Error("Race not found")
    }

    const registration = await prisma.registration.create({
      data: {
        raceId: race.id,
        name,
        surname,
        email,
      },
    })

    return registration
  } catch (error) {
    console.error("Error creating registration:", error)
    throw error
  }
}

export async function getRegistrations(raceId: number) {
  try {
    const race = await prisma.race.findUnique({
      where: { externalId: raceId },
      include: {
        registrations: {
          orderBy: { registrationDate: "desc" },
        },
      },
    })

    return race?.registrations || []
  } catch (error) {
    console.error("Error fetching registrations:", error)
    return []
  }
}

export { prisma }
