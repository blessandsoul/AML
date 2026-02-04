import pino from 'pino';
import { isDev, isProd } from '../config/env.js';

const devTransport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:standard',
    ignore: 'pid,hostname',
  },
};

export const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev ? devTransport : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  ...(isProd && {
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie', 'password'],
      remove: true,
    },
  }),
});

// Create child loggers for different modules
export const createLogger = (module: string) => logger.child({ module });

// Convenience exports
export const logInfo = (msg: string, data?: object) => logger.info(data, msg);
export const logError = (msg: string, error?: unknown) => logger.error({ error }, msg);
export const logWarn = (msg: string, data?: object) => logger.warn(data, msg);
export const logDebug = (msg: string, data?: object) => logger.debug(data, msg);
