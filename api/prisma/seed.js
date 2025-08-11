// Prisma seed script for IoT project
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create default user
  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'admin123', // ควรใช้ hash จริงใน production
    },
  });

  // Create devices
  await prisma.device.createMany({
    data: [
      { name: 'Main Door', type: 'door', location: 'front', state: false },
      { name: 'Living Room Light', type: 'light', location: 'downstairs', state: false },
      { name: 'Bedroom AC', type: 'ac', location: 'upstairs', state: false },
      { name: 'Front Camera', type: 'camera', location: 'front', state: true },
      { name: 'Back Camera', type: 'camera', location: 'back', state: true },
    ],
  });

  // Create sample log
  await prisma.log.create({
    data: {
      deviceId: 1,
      event: 'face_scan_unlock',
      imageUrl: 'https://example.com/image1.jpg',
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
