import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { prisma } from '../src/libs/prisma.js';

/**
 * Global test setup
 */

// Ensure we're using a test database
if (!process.env.DATABASE_URL?.includes('test')) {
  console.warn('Warning: DATABASE_URL does not contain "test". Tests may affect production data.');
}

beforeAll(async () => {
  // Connect to database
  await prisma.$connect();
});

afterAll(async () => {
  // Disconnect from database
  await prisma.$disconnect();
});

// Optional: Clean up specific tables before each test
beforeEach(async () => {
  // Add specific table cleanups if needed
});

afterEach(async () => {
  // Add specific cleanups after each test if needed
});
