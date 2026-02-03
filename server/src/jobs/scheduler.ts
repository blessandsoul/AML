import cron from 'node-cron';
import { logger } from '../libs/logger.js';

// Store scheduled tasks for cleanup
const scheduledTasks: cron.ScheduledTask[] = [];

/**
 * Start all scheduled jobs
 * Add your cron jobs here
 */
export function startScheduler(): void {
  logger.info('Starting background job scheduler...');

  // Example: Health check every 5 minutes
  const healthCheck = cron.schedule('*/5 * * * *', async () => {
    logger.debug('Running scheduled health check');
    // Add your health check logic here
  });
  scheduledTasks.push(healthCheck);

  // Example: Cleanup expired sessions every hour
  const sessionCleanup = cron.schedule('0 * * * *', async () => {
    logger.debug('Running scheduled session cleanup');
    // Add your cleanup logic here
  });
  scheduledTasks.push(sessionCleanup);

  // Example: Daily report at midnight
  const dailyReport = cron.schedule('0 0 * * *', async () => {
    logger.debug('Running daily report');
    // Add your daily report logic here
  });
  scheduledTasks.push(dailyReport);

  logger.info(`Scheduler started with ${scheduledTasks.length} jobs`);
}

/**
 * Stop all scheduled jobs
 * Called during graceful shutdown
 */
export function stopScheduler(): void {
  logger.info('Stopping background job scheduler...');

  for (const task of scheduledTasks) {
    task.stop();
  }

  scheduledTasks.length = 0;
  logger.info('Scheduler stopped');
}

/**
 * Get scheduler status
 */
export function getSchedulerStatus(): { running: number; tasks: string[] } {
  return {
    running: scheduledTasks.filter((t) => t.now !== undefined).length,
    tasks: scheduledTasks.map((_, i) => `task-${i}`),
  };
}
