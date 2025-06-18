import type { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { getRedisClient } from "../../../infrastructure/cache/RedisClient";
import { environment } from "../../../infrastructure/config/Environment";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

type RedisReply = boolean | number | string | (boolean | number | string)[];

interface RateLimiterOptions {
  windowMs: number;
  max: number;
  prefix: string;
  message?: { error: string };
}

export function createExpressRateLimiter({
  windowMs,
  max,
  prefix,
  message = { error: "Too many requests, please try again later." },
}: RateLimiterOptions) {
  const redisClient = getRedisClient();

  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args: string[]) =>
        redisClient.call(...(args as [string, ...string[]])) as Promise<RedisReply>,
    }),
    windowMs,
    max,
    keyGenerator: (req: AuthRequest | Request) => {
      if ("userId" in req && req.userId) return `${prefix}:user:${req.userId}`;
      const token = req.headers.authorization?.split(" ")[1];
      if (token) return `${prefix}:token:${token}`;
      return `${prefix}:ip:${req.ip || "anonymous"}`;
    },
    standardHeaders: true,
    legacyHeaders: false,
    message,
  });
}

// Scaled rate limiters for high load
export const expressGeneralRateLimiter = createExpressRateLimiter({
  windowMs: 30 * 1000,
  max: environment.rateLimitGeneral,
  prefix: "general",
});

export const expressPostRateLimiter = createExpressRateLimiter({
  windowMs: 30 * 1000,
  max: environment.rateLimitPost,
  prefix: "post",
});

export const expressLoginRateLimiter = createExpressRateLimiter({
  windowMs: 60 * 1000,
  max: environment.rateLimitLogin,
  prefix: "login",
});

export const expressSignupRateLimiter = createExpressRateLimiter({
  windowMs: 60 * 1000,
  max: environment.rateLimitSignup,
  prefix: "signup",
});
