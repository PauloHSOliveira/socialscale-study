import type { RateLimitService } from "../../domain/services/RateLimitService";
import { getRedisClient } from "../cache/RedisClient";

export class SlidingWindowRateLimitService implements RateLimitService {
  private redis = getRedisClient();

  async checkLimit(
    key: string,
    windowMs: number,
    maxRequests: number,
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const windowStart = now - windowMs;
    const redisKey = `sliding_rate_limit:${key}`;

    // Use Redis sorted set for sliding window
    const pipeline = this.redis.pipeline();

    // Remove old entries
    pipeline.zremrangebyscore(redisKey, 0, windowStart);

    // Count current requests in window
    pipeline.zcard(redisKey);

    // Add current request
    pipeline.zadd(redisKey, now, `${now}-${Math.random()}`);

    // Set expiration
    pipeline.expire(redisKey, Math.ceil(windowMs / 1000));

    const results = await pipeline.exec();
    const currentCount = (results?.[1]?.[1] as number) || 0;

    const allowed = currentCount < maxRequests;
    const remaining = Math.max(0, maxRequests - currentCount - 1);
    const resetTime = now + windowMs;

    if (!allowed) {
      // Remove the request we just added since it's not allowed
      await this.redis.zrem(redisKey, `${now}-${Math.random()}`);
    }

    return {
      allowed,
      remaining,
      resetTime,
    };
  }
}
