import Redis from 'ioredis';
import { env } from './env.js';
import { logger } from './logger.js';

let redisClient = null;

if (env.redisUrl) {
  redisClient = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 2,
    lazyConnect: true,
  });

  redisClient.on('error', (error) => {
    logger.warn(`Redis error: ${error.message}`);
  });
}

export const connectRedis = async () => {
  if (!redisClient) return null;
  try {
    await redisClient.connect();
    logger.info('Redis connected');
    return redisClient;
  } catch (error) {
    logger.warn(`Redis connection failed, continuing without cache: ${error.message}`);
    return null;
  }
};

export { redisClient };
