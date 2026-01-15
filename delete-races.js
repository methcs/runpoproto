const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function deleteAllRaces() {
  try {
    // Delete registrations first (due to foreign key constraint)
    const deletedRegistrations = await prisma.registration.deleteMany({});
    console.log(`Deleted ${deletedRegistrations.count} registrations`);

    // Then delete races
    const deletedRaces = await prisma.race.deleteMany({});
    console.log(`Deleted ${deletedRaces.count} races`);

    console.log('✓ All races and registrations deleted successfully');
  } catch (error) {
    console.error('Error deleting races:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllRaces();
