import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create an admin user
  const adminEmail = 'admin@puddingmitgabel.de';
  const adminPassword = await hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
      isOrganizer: true,
    },
  });

  console.log('✅ Admin user created:');
  console.log('   Email:', adminEmail);
  console.log('   Password: admin123');
  console.log('   IMPORTANT: Change this password after first login!');

  // Create a sample organizer
  const organizerEmail = 'organizer@puddingmitgabel.de';
  const organizerPassword = await hash('organizer123', 12);

  const organizer = await prisma.user.upsert({
    where: { email: organizerEmail },
    update: {},
    create: {
      email: organizerEmail,
      password: organizerPassword,
      name: 'Max Mustermann',
      role: 'ORGANIZER',
      isOrganizer: true,
    },
  });

  console.log('\n✅ Organizer user created:');
  console.log('   Email:', organizerEmail);
  console.log('   Password: organizer123');

  // Create a sample event
  const event = await prisma.event.create({
    data: {
      title: 'Pudding-Gabel-Treffen im Stadtpark',
      description: 'Unser erstes großes Pudding-mit-Gabel Event! Bring deinen eigenen Pudding und deine liebste Gabel mit.',
      location: 'Stadtpark, Berlin',
      date: new Date('2024-12-15T15:00:00'),
      status: 'APPROVED',
      organizerId: organizer.id,
    },
  });

  console.log('\n✅ Sample event created:', event.title);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
