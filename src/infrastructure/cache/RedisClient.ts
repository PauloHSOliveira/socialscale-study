import Redis from "ioredis";

let redisInstance: Redis | null = null;

export const getRedisClient = (): Redis => {
  if (!redisInstance) {
    redisInstance = new Redis({
      host: process.env.REDIS_HOST || "localhost",
      port: Number(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null,
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
