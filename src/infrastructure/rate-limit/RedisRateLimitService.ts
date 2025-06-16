import type { RateLimitService } from "../../domain/services/RateLimitService";
import { getRedisClient } from "../cache/RedisClient";

export class RedisRateLimitService implements RateLimitService {
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
    const window = Math.floor(now / windowMs);
    const redisKey = `rate_limit:${key}:${window}`;

    const current = await this.redis.incr(redisKey);

    if (current === 1) {
      await this.redis.expire(redisKey, Math.ceil(windowMs / 1000));
    }

    const resetTime = (window + 1) * windowMs;
    const remaining = Math.max(0, maxRequests - current);
    const allowed = current <= maxRequests;

    return {
      allowed,
      remaining,
      resetTime,
    };
  }
}
