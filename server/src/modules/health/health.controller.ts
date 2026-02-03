import type { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse } from '../../libs/response.js';
import { isRedisConnected } from '../../libs/redis.js';
import { testDbConnection } from '../../libs/prisma.js';
import { env } from '../../config/env.js';

/**
 * Health check response data
 */
interface HealthData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: 'connected' | 'disconnected';
    redis: 'connected' | 'disconnected';
  };
}

/**
 * Health check controller
 * Returns server status and service connectivity
 */
export async function getHealth(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const dbConnected = await testDbConnection();
  const redisConnected = isRedisConnected();

  // Determine overall status
  let status: HealthData['status'] = 'healthy';
  if (!dbConnected) {
    status = 'unhealthy';
  } else if (!redisConnected) {
    status = 'degraded';
  }

  const healthData: HealthData = {
    status,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    services: {
      database: dbConnected ? 'connected' : 'disconnected',
      redis: redisConnected ? 'connected' : 'disconnected',
    },
  };

  // Return 503 if unhealthy (for load balancer health checks)
  const statusCode = status === 'unhealthy' ? 503 : 200;

  return reply.status(statusCode).send(
    successResponse('Health check completed', healthData)
  );
}

/**
 * Simple ping endpoint
 * Returns minimal response for quick health checks
 */
export async function getPing(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  return reply.send(successResponse('pong', { timestamp: Date.now() }));
}
