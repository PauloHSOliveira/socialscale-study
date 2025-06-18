import Redis from "ioredis";

let redisInstance: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisInstance) {
    redisInstance = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      enableOfflineQueue: false,
      family: 4,
      keepAlive: 30000,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });
  }
  return redisInstance;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redisInstance) {
    redisInstance.disconnect();
    redisInstance = null;
  }
};
