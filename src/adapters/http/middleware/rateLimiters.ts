import { createRateLimitMiddleware } from "./rateLimitMiddleware";

export const signupRateLimiter = createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  max: 1000,
  prefix: "signup",
});

export const loginRateLimiter = createRateLimitMiddleware({
  windowMs: 60 * 1000, // 1 minute
  max: 3000,
  prefix: "login",
});

export const postRateLimiter = createRateLimitMiddleware({
  windowMs: 30 * 1000, // 30 seconds
  max: 6000,
  prefix: "post",
});

export const generalRateLimiter = createRateLimitMiddleware({
  windowMs: 30 * 1000, // 30 seconds
  max: 3000,
  prefix: "general",
});
