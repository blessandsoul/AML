import type { FastifyCorsOptions } from '@fastify/cors';
import { corsOrigins, isProd } from './env.js';

/**
 * CORS Configuration
 * Defines allowed origins and request options for cross-origin requests
 */
export const CORS_CONFIG: FastifyCorsOptions = {
  // Allowed origins (from environment variable or defaults)
  origin: corsOrigins,

  // Allow credentials (cookies, authorization headers)
  credentials: true,

  // Allowed HTTP methods
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  // Allowed request headers
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],

  // Exposed response headers (accessible to client)
  exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],

  // Preflight request cache duration (in seconds)
  maxAge: isProd ? 86400 : 0, // 24 hours in production, no cache in dev

  // Send preflight response immediately
  preflight: true,
  strictPreflight: true,
};

/**
 * Default allowed origins for development
 */
export const DEFAULT_ORIGINS = [
  'http://localhost:3000', // Next.js dev server
  'http://127.0.0.1:3000',
];

/**
 * Check if an origin is allowed
 */
export function isOriginAllowed(origin: string): boolean {
  return corsOrigins.includes(origin);
}
