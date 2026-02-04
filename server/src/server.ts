import 'dotenv/config';
import { env, isDev } from './config/env.js';
import { logger } from './libs/logger.js';
import { testDbConnection, disconnectDb } from './libs/prisma.js';
import { connectRedis, disconnectRedis, isRedisConnected } from './libs/redis.js';
import { ensureUploadDir } from './libs/file-upload.js';
import { startScheduler, stopScheduler } from './jobs/scheduler.js';
import buildApp from './app.js';

// Track if server is shutting down
let isShuttingDown = false;

/**
 * Main server startup function
 */
async function main(): Promise<void> {
  logger.info('[START] Starting AML API Server...');

  // Ensure upload directory exists
  ensureUploadDir();
  logger.info('[OK] Upload directory ready');

  // Test database connection
  logger.info('[DB] Connecting to database...');
  const dbConnected = await testDbConnection();
  if (!dbConnected) {
    logger.error('[ERROR] Failed to connect to database');
    process.exit(1);
  }
  logger.info('[OK] Database connected');

  // Connect to Redis (optional - graceful degradation)
  logger.info('[REDIS] Connecting to Redis...');
  await connectRedis();
  if (isRedisConnected()) {
    logger.info('[OK] Redis connected');
  } else {
    logger.warn('[WARN] Redis not available - running without cache');
  }

  // Build Fastify app
  const app = await buildApp();

  // Start server
  try {
    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    logger.info(`[OK] Server running on http://localhost:${env.PORT}`);
    logger.info(`[ENV] Environment: ${env.NODE_ENV}`);

    // Signal PM2 that app is ready
    if (process.send) {
      process.send('ready');
      logger.info('[PM2] Ready signal sent');
    }

    // Start background jobs
    if (!isDev) {
      startScheduler();
      logger.info('[JOBS] Background scheduler started');
    }
  } catch (err) {
    logger.error({ err }, 'Failed to start server');
    process.exit(1);
  }

  // Graceful shutdown handlers
  const shutdown = async (signal: string): Promise<void> => {
    if (isShuttingDown) {
      logger.info('Shutdown already in progress...');
      return;
    }

    isShuttingDown = true;
    logger.info(`${signal} received. Starting graceful shutdown...`);

    // Stop accepting new connections
    try {
      await app.close();
      logger.info('[OK] HTTP server closed');
    } catch (err) {
      logger.error({ err }, 'Error closing HTTP server');
    }

    // Stop scheduler
    stopScheduler();
    logger.info('[OK] Scheduler stopped');

    // Disconnect Redis
    try {
      await disconnectRedis();
      logger.info('[OK] Redis disconnected');
    } catch (err) {
      logger.error({ err }, 'Error disconnecting Redis');
    }

    // Disconnect database
    try {
      await disconnectDb();
      logger.info('[OK] Database disconnected');
    } catch (err) {
      logger.error({ err }, 'Error disconnecting database');
    }

    logger.info('[DONE] Graceful shutdown complete');
    process.exit(0);
  };

  // Register shutdown handlers
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught errors
  process.on('uncaughtException', (err) => {
    logger.fatal({ err }, 'Uncaught exception');
    shutdown('UNCAUGHT_EXCEPTION');
  });

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Unhandled rejection');
    shutdown('UNHANDLED_REJECTION');
  });
}

// Start the server
main().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});
