import Fastify, { type FastifyInstance, type FastifyError } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyCsrf from '@fastify/csrf-protection';
import fastifyHelmet from '@fastify/helmet';
import fastifyStatic from '@fastify/static';
import fastifyMultipart from '@fastify/multipart';
import fastifyRateLimit from '@fastify/rate-limit';
import fastifyWebsocket from '@fastify/websocket';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { join } from 'node:path';

import { env, isProd } from './config/env.js';
import { CORS_CONFIG } from './config/cors.js';
import { defaultRateLimit } from './config/rateLimit.js';
import { swaggerConfig, swaggerUiConfig } from './config/swagger.js';
import { logger } from './libs/logger.js';
import { isAppError, ValidationError } from './libs/errors.js';
import { errorResponse } from './libs/response.js';

// Import route modules
import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/index.js';
import { blogRoutes } from './modules/blog/index.js';
import { orderRoutes } from './modules/orders/index.js';
import { reviewRoutes } from './modules/reviews/index.js';

/**
 * Build and configure Fastify application
 */
export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // We use our own logger
    trustProxy: true,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

  // ===== REGISTER PLUGINS =====

  // CORS - using centralized configuration
  await app.register(fastifyCors, CORS_CONFIG);

  // Cookie
  await app.register(fastifyCookie, {
    secret: env.ACCESS_TOKEN_SECRET,
    parseOptions: {},
  });

  // CSRF Protection (disabled for API-first apps, enable if needed)
  if (isProd) {
    await app.register(fastifyCsrf, {
      cookieOpts: { signed: true },
    });
  }

  // Security headers
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: isProd,
    crossOriginEmbedderPolicy: false,
  });

  // Static file serving
  await app.register(fastifyStatic, {
    root: join(process.cwd(), env.UPLOAD_DIR),
    prefix: env.STATIC_URL_PREFIX,
    decorateReply: false,
  });

  // Multipart/file upload
  await app.register(fastifyMultipart, {
    limits: {
      fileSize: env.MAX_FILE_SIZE,
      files: 10,
    },
  });

  // Rate limiting (using in-memory store)
  // Note: @fastify/rate-limit requires ioredis for Redis support
  // For distributed rate limiting, switch to ioredis package
  await app.register(fastifyRateLimit, {
    ...defaultRateLimit,
    skipOnError: true,
  });

  // WebSocket support
  await app.register(fastifyWebsocket, {
    options: {
      maxPayload: 1048576, // 1MB
    },
  });

  // ===== API DOCUMENTATION =====
  // Swagger/OpenAPI documentation (available at /docs)
  await app.register(fastifySwagger, swaggerConfig);
  await app.register(fastifySwaggerUi, swaggerUiConfig);

  // ===== GLOBAL ERROR HANDLER =====
  app.setErrorHandler((error: FastifyError, request, reply) => {
    // Log error details (internal only)
    logger.error(
      {
        err: error,
        url: request.url,
        method: request.method,
        statusCode: error.statusCode,
      },
      'Request error'
    );

    // Handle AppError instances
    if (isAppError(error)) {
      const response = error instanceof ValidationError
        ? errorResponse(error.code, error.message, error.details)
        : errorResponse(error.code, error.message);

      return reply.status(error.statusCode).send(response);
    }

    // Handle Fastify validation errors
    if (error.validation) {
      const details: Record<string, string[]> = {};
      error.validation.forEach((err) => {
        const key = err.instancePath.replace('/', '') || 'body';
        if (!details[key]) details[key] = [];
        details[key].push(err.message || 'Validation error');
      });

      return reply.status(400).send(
        errorResponse('VALIDATION_ERROR', 'Validation failed', details)
      );
    }

    // Handle rate limit errors
    if (error.statusCode === 429) {
      return reply.status(429).send(
        errorResponse('RATE_LIMIT_EXCEEDED', error.message)
      );
    }

    // Default error response
    const statusCode = error.statusCode || 500;
    const message = isProd && statusCode >= 500
      ? 'Internal server error'
      : error.message;

    return reply.status(statusCode).send(
      errorResponse('INTERNAL_ERROR', message)
    );
  });

  // ===== NOT FOUND HANDLER =====
  app.setNotFoundHandler((request, reply) => {
    return reply.status(404).send(
      errorResponse('NOT_FOUND', `Route ${request.method} ${request.url} not found`)
    );
  });

  // ===== REGISTER ROUTES =====
  await app.register(healthRoutes, { prefix: '/api/v1' });
  await app.register(authRoutes, { prefix: '/api/v1' });
  await app.register(blogRoutes, { prefix: '/api/v1' });
  await app.register(orderRoutes, { prefix: '/api/v1' });
  await app.register(reviewRoutes, { prefix: '/api/v1' });

  return app;
}

export default buildApp;
