import { createClient, type RedisClientType } from 'redis';
import { env, isDev } from '../config/env.js';
import { logger } from './logger.js';

// Main Redis client
let redisClient: RedisClientType | null = null;

// Pub/Sub client (separate connection required)
let redisPubClient: RedisClientType | null = null;
let redisSubClient: RedisClientType | null = null;

// Connection status
let isConnected = false;

function createRedisClient(): RedisClientType {
  const client = createClient({
    socket: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
    password: env.REDIS_PASSWORD || undefined,
  });

  client.on('error', (err) => {
    logger.error({ err }, 'Redis client error');
    isConnected = false;
  });

  client.on('connect', () => {
    logger.info('Redis client connected');
    isConnected = true;
  });

  client.on('ready', () => {
    logger.info('Redis client ready');
  });

  client.on('end', () => {
    logger.info('Redis client disconnected');
    isConnected = false;
  });

  return client as RedisClientType;
}

export async function connectRedis(): Promise<RedisClientType | null> {
  try {
    redisClient = createRedisClient();
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.warn({ error }, 'Redis connection failed - running without cache');
    redisClient = null;
    return null;
  }
}

export async function connectRedisPubSub(): Promise<{
  pub: RedisClientType | null;
  sub: RedisClientType | null;
}> {
  try {
    redisPubClient = createRedisClient();
    redisSubClient = createRedisClient();
    await Promise.all([redisPubClient.connect(), redisSubClient.connect()]);
    return { pub: redisPubClient, sub: redisSubClient };
  } catch (error) {
    logger.warn({ error }, 'Redis Pub/Sub connection failed');
    return { pub: null, sub: null };
  }
}

export async function disconnectRedis(): Promise<void> {
  const clients = [redisClient, redisPubClient, redisSubClient];
  await Promise.all(
    clients.map(async (client) => {
      if (client?.isOpen) {
        await client.quit();
      }
    })
  );
}

export function getRedis(): RedisClientType | null {
  return redisClient;
}

export function isRedisConnected(): boolean {
  return isConnected && redisClient?.isOpen === true;
}

// Cache helpers with graceful degradation
export async function cacheGet<T>(key: string): Promise<T | null> {
  if (!redisClient?.isOpen) return null;

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    if (isDev) logger.warn({ error, key }, 'Cache get failed');
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = 300
): Promise<boolean> {
  if (!redisClient?.isOpen) return false;

  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
    return true;
  } catch (error) {
    if (isDev) logger.warn({ error, key }, 'Cache set failed');
    return false;
  }
}

export async function cacheDel(key: string): Promise<boolean> {
  if (!redisClient?.isOpen) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    if (isDev) logger.warn({ error, key }, 'Cache delete failed');
    return false;
  }
}

export async function cacheDelPattern(pattern: string): Promise<boolean> {
  if (!redisClient?.isOpen) return false;

  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
    return true;
  } catch (error) {
    if (isDev) logger.warn({ error, pattern }, 'Cache pattern delete failed');
    return false;
  }
}
