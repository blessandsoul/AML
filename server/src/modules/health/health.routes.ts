import type { FastifyInstance } from 'fastify';
import { getHealth, getReady, getPing } from './health.controller.js';

/**
 * Health check routes
 * Provides endpoints for monitoring and load balancer health checks
 */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  // Full health check with service status
  app.get('/health', {
    schema: {
      tags: ['Health'],
      summary: 'Health check',
      description: 'Returns the health status of the API and its dependencies',
      response: {
        200: {
          description: 'Service is healthy',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Service is healthy' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string', example: 'healthy' },
                timestamp: { type: 'string', format: 'date-time' },
                uptime: { type: 'number' },
                services: {
                  type: 'object',
                  properties: {
                    database: { type: 'string', example: 'connected' },
                    redis: { type: 'string', example: 'connected' },
                  },
                },
              },
            },
          },
        },
      },
    },
  }, getHealth);

  // Readiness probe - checks DB + Redis connectivity
  // Returns 503 if critical services are down
  app.get('/health/ready', {
    schema: {
      tags: ['Health'],
      summary: 'Readiness check',
      description: 'Checks if the service is ready to accept traffic (DB + Redis connectivity)',
      response: {
        200: {
          description: 'Service is ready',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Service is ready' },
            data: {
              type: 'object',
              properties: {
                ready: { type: 'boolean', example: true },
                database: { type: 'string', example: 'connected' },
                redis: { type: 'string', example: 'connected' },
              },
            },
          },
        },
        503: {
          description: 'Service is not ready',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'SERVICE_UNAVAILABLE' },
                message: { type: 'string', example: 'Service is not ready' },
              },
            },
          },
        },
      },
    },
  }, getReady);

  // Simple ping endpoint for liveness probes
  app.get('/ping', {
    schema: {
      tags: ['Health'],
      summary: 'Ping',
      description: 'Simple liveness probe endpoint',
      response: {
        200: {
          description: 'Pong response',
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'pong' },
            data: {
              type: 'object',
              properties: {
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
  }, getPing);
}
