import type { FastifyRequest, FastifyReply } from 'fastify';
import { logger } from '../libs/logger.js';
import { isDev } from '../config/env.js';

/**
 * Request logging middleware
 * Logs incoming requests with method, url, and timing
 */
export async function requestLogger(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const startTime = Date.now();

  // Log request start (only in development for verbose logging)
  if (isDev) {
    logger.debug(
      {
        method: request.method,
        url: request.url,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
      },
      'Incoming request'
    );
  }

  // Add response hook to log completion
  reply.raw.on('finish', () => {
    const duration = Date.now() - startTime;

    const logData = {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration: `${duration}ms`,
      ip: request.ip,
    };

    // Log at different levels based on status code
    if (reply.statusCode >= 500) {
      logger.error(logData, 'Request failed');
    } else if (reply.statusCode >= 400) {
      logger.warn(logData, 'Request error');
    } else {
      logger.info(logData, 'Request completed');
    }
  });
}

/**
 * Skip logging for certain paths (health checks, static files)
 */
const SKIP_PATHS = ['/api/v1/health', '/favicon.ico'];

export function shouldSkipLogging(url: string): boolean {
  return SKIP_PATHS.some((path) => url.startsWith(path));
}
