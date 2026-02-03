import type { FastifyRateLimitOptions } from '@fastify/rate-limit';
import { isProd } from './env.js';

// Default rate limit configuration
export const defaultRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 100 : 1000, // requests per window
  timeWindow: '1 minute',
  errorResponseBuilder: (_request, context) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};

// Strict rate limit for sensitive endpoints (login, register, password reset)
export const authRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 5 : 50,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request, context) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Too many attempts. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};

// File upload rate limit
export const uploadRateLimit: FastifyRateLimitOptions = {
  max: isProd ? 10 : 100,
  timeWindow: '1 minute',
  errorResponseBuilder: (_request, context) => ({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: `Upload limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
    },
  }),
};
