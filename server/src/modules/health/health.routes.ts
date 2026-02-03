import type { FastifyInstance } from 'fastify';
import { getHealth, getPing } from './health.controller.js';

/**
 * Health check routes
 * Provides endpoints for monitoring and load balancer health checks
 */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  // Full health check with service status
  app.get('/health', getHealth);

  // Simple ping endpoint
  app.get('/ping', getPing);
}
