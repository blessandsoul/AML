import { PrismaClient, UserRole } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('[SEED] Starting database seed...');

  // Create admin user
  const adminPassword = await argon2.hash('Admin123!');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aml.local' },
    update: {},
    create: {
      email: 'admin@aml.local',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`[OK] Admin user created: ${admin.email}`);

  // Create test user
  const userPassword = await argon2.hash('User1234!');
  const user = await prisma.user.upsert({
    where: { email: 'user@aml.local' },
    update: {},
    create: {
      email: 'user@aml.local',
      passwordHash: userPassword,
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`[OK] Test user created: ${user.email}`);

  // Create test company user
  const companyPassword = await argon2.hash('Company1!');
  const company = await prisma.user.upsert({
    where: { email: 'company@aml.local' },
    update: {},
    create: {
      email: 'company@aml.local',
      passwordHash: companyPassword,
      firstName: 'Company',
      lastName: 'Owner',
      role: UserRole.COMPANY,
      emailVerified: true,
      isActive: true,
    },
  });
  console.log(`[OK] Company user created: ${company.email}`);

  console.log('[DONE] Seed completed successfully!');
  console.log('');
  console.log('Test Accounts:');
  console.log('  Admin: admin@aml.local / Admin123!');
  console.log('  User: user@aml.local / User1234!');
  console.log('  Company: company@aml.local / Company1!');
}

main()
  .catch((e) => {
    console.error('[ERROR] Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
