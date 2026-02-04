import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from './plugins/error-handler';
import { blogRoutes } from './modules/blog';
import { reviewRoutes } from './modules/reviews';
import { orderRoutes } from './modules/orders';
import { aiRoutes } from './modules/ai';

dotenv.config();

const fastify = Fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Plugins
fastify.register(cors, {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
});
fastify.register(helmet);
fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

// Error Handler
fastify.register(errorHandler);

// Health Check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API Routes
fastify.register(blogRoutes, { prefix: '/api/v1/blog' });
fastify.register(reviewRoutes, { prefix: '/api/v1/reviews' });
fastify.register(orderRoutes, { prefix: '/api/v1/orders' });
fastify.register(aiRoutes, { prefix: '/api/v1/ai' });

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8080');
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Blog API: http://localhost:${port}/api/v1/blog`);
    console.log(`Reviews API: http://localhost:${port}/api/v1/reviews`);
    console.log(`Orders API: http://localhost:${port}/api/v1/orders`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
