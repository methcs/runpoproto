const { PrismaClient, Prisma } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
})

;(async () => {
  try {
    const body = {
      title: 'Direct Test Race ' + Date.now(),
      date: '2026-06-01',
      location: 'Istanbul',
      distance: '5 km',
      category: 'Test',
      description: 'Created directly via script',
      websiteUrl: '',
      registrationUrl: '',
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      // Use seconds since epoch (fits into 32-bit signed int) + small random component
      const externalId = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000)
      try {
        const race = await prisma.race.create({
          data: {
            externalId,
            title: body.title,
            date: body.date,
            location: body.location,
            distance: body.distance,
            category: body.category,
            description: body.description,
            websiteUrl: body.websiteUrl,
            registrationUrl: body.registrationUrl,
          },
        })
        console.log('Created race:', race)
        process.exit(0)
      } catch (err) {
        if (
          err instanceof Prisma.PrismaClientKnownRequestError &&
          err.code === 'P2002' &&
          (err.meta || {}).target &&
          (err.meta.target).includes('externalId')
        ) {
          console.warn('externalId collision, retrying...')
          continue
        }
        throw err
      }
    }

    console.error('Failed to generate unique externalId after retries')
    process.exit(1)
  } catch (e) {
    console.error('SCRIPT ERROR', e)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
})()
