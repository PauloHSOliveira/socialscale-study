import type { NextFunction, Request, Response } from "express";
import { RedisRateLimitService } from "../../../infrastructure/rate-limit/RedisRateLimitService";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

interface RateLimitConfig {
  windowMs: number;
  max: number;
  prefix: string;
  message?: { error: string };
}

export function createRateLimitMiddleware({
  windowMs,
  max,
  prefix,
  message = { error: "Too many requests, please try again later." },
}: RateLimitConfig) {
  const rateLimitService = new RedisRateLimitService();

  return async (req: AuthRequest | Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const key = generateKey(req, prefix);
      const result = await rateLimitService.checkLimit(key, windowMs, max);

      // Set rate limit headers
      res.set({
        "X-RateLimit-Limit": max.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
      });

      if (!result.allowed) {
        res.status(429).json(message);
        return;
      }

      next();
    } catch (error) {
      console.error("Rate limit error:", error);
      // If rate limiting fails, allow the request to continue
      next();
    }
  };
}

function generateKey(req: AuthRequest | Request, prefix: string): string {
  // Check if it's an authenticated request
  if ("userId" in req && req.userId) {
    return `${prefix}:user:${req.userId}`;
  }

  // Check for token in authorization header
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return `${prefix}:token:${token}`;
  }

  // Fall back to IP address
  return `${prefix}:ip:${req.ip || "anonymous"}`;
}
