import type { FastifyRateLimitOptions, errorResponseBuilderContext } from '@fastify/rate-limit';
import type { FastifyRequest } from 'fastify';
import { isProd } from './env.js';

/**
 * Rate Limiting Configuration
 *
 * NOTE: Currently using in-memory store. For distributed deployments,
 * switch to Redis store by installing `ioredis` and configuring:
 *
 * ```typescript
 * import Redis from 'ioredis';
 * const redis = new Redis({ host: 'localhost', port: 6379 });
 *
 * await app.register(fastifyRateLimit, {
 *   ...defaultRateLimit,
 *   redis: redis,
 * });
 * ```
 */

// Default rate limit for public endpoints (100 requests/minute)
export const defaultRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 100 : 1000, // requests per window
  timeWindow: '1 minute',
  errorResponseBuilder: (_request: FastifyRequest, context: errorResponseBuilderContext) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};

// Strict rate limit for auth endpoints (10 requests/minute)
// Applies to: login, register, password reset
export const authRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 10 : 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request: FastifyRequest, context: errorResponseBuilderContext) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Too many attempts. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};

// Admin endpoints rate limit (200 requests/minute)
// Higher limit for admin operations and bulk actions
export const adminRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 200 : 2000,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request: FastifyRequest, context: errorResponseBuilderContext) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Admin rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};

// File upload rate limit (20 requests/minute)
export const uploadRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 20 : 200,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request: FastifyRequest, context: errorResponseBuilderContext) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Upload limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};
