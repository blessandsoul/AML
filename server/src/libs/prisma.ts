import { PrismaClient } from '@prisma/client';
import { isDev } from '../config/env.js';

// Prisma Client singleton pattern
// Prevents multiple instances in development due to hot reloading

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: isDev ? ['query', 'error', 'warn'] : ['error'],
  });

if (isDev) {
  globalForPrisma.prisma = prisma;
}

// Test database connection
export async function testDbConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('[ERROR] Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function disconnectDb(): Promise<void> {
  await prisma.$disconnect();
}
