import { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { prisma } from '../src/libs/prisma.js';
import { authService } from '../src/modules/auth/auth.service.js';

/**
 * Build a fresh Fastify app instance for testing
 */
export async function buildTestApp(): Promise<FastifyInstance> {
  const app = await buildApp();
  await app.ready();
  return app;
}

/**
 * Close the test app
 */
export async function closeTestApp(app: FastifyInstance): Promise<void> {
  await app.close();
}

/**
 * Create a test user and return the user with tokens
 */
export async function createTestUser(
  email: string = `test-${Date.now()}@example.com`,
  password: string = 'TestPassword123!',
  role: 'USER' | 'ADMIN' = 'USER'
) {
  const result = await authService.register({
    email,
    password,
    firstName: 'Test',
    lastName: 'User',
  });

  // If admin role needed, update the user
  if (role === 'ADMIN') {
    await prisma.user.update({
      where: { id: result.user.id },
      data: { role: 'ADMIN' },
    });
    result.user.role = 'ADMIN';
  }

  return result;
}

/**
 * Create an admin user for testing protected routes
 */
export async function createTestAdmin() {
  return createTestUser(
    `admin-${Date.now()}@example.com`,
    'AdminPassword123!',
    'ADMIN'
  );
}

/**
 * Clean up test users
 */
export async function cleanupTestUsers() {
  await prisma.refreshToken.deleteMany({
    where: {
      user: {
        email: { contains: 'test-' },
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: { contains: 'test-' } },
        { email: { contains: 'admin-' } },
      ],
    },
  });
}

/**
 * Clean up test blog data
 */
export async function cleanupTestBlogData() {
  await prisma.blogReaction.deleteMany({
    where: {
      sessionId: { startsWith: 'test-' },
    },
  });
  await prisma.blogPostTag.deleteMany({
    where: {
      post: { slug: { startsWith: 'test-' } },
    },
  });
  await prisma.blogPost.deleteMany({
    where: { slug: { startsWith: 'test-' } },
  });
  await prisma.blogTag.deleteMany({
    where: { slug: { startsWith: 'test-' } },
  });
  await prisma.blogCategory.deleteMany({
    where: { slug: { startsWith: 'test-' } },
  });
}

/**
 * Clean up test order data
 */
export async function cleanupTestOrders() {
  await prisma.orderStatusHistory.deleteMany({
    where: {
      order: { trackingCode: { startsWith: 'TEST-' } },
    },
  });
  await prisma.order.deleteMany({
    where: { trackingCode: { startsWith: 'TEST-' } },
  });
}

/**
 * Clean up test review data
 */
export async function cleanupTestReviews() {
  await prisma.reviewPhoto.deleteMany({
    where: {
      review: { customerName: { startsWith: 'Test' } },
    },
  });
  await prisma.review.deleteMany({
    where: { customerName: { startsWith: 'Test' } },
  });
  await prisma.completedDealPhoto.deleteMany({
    where: {
      completedDeal: { carVin: { startsWith: 'TEST' } },
    },
  });
  await prisma.completedDeal.deleteMany({
    where: { carVin: { startsWith: 'TEST' } },
  });
}

/**
 * Make an authenticated request helper
 */
export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Parse JSON response body
 */
export function parseBody<T>(response: { body: string }): T {
  return JSON.parse(response.body) as T;
}
