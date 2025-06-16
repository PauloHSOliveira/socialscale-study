export interface RateLimitRule {
  windowMs: number;
  max: number;
  prefix: string;
  message?: { error: string };
}

export const rateLimitConfig = {
  signup: {
    windowMs: 60 * 1000, // 1 minute
    max: 1000,
    prefix: "signup",
  },
  login: {
    windowMs: 60 * 1000, // 1 minute
    max: 3000,
    prefix: "login",
  },
  post: {
    windowMs: 30 * 1000, // 30 seconds
    max: 6000,
    prefix: "post",
  },
  general: {
    windowMs: 30 * 1000, // 30 seconds
    max: 3000,
    prefix: "general",
  },
} as const;
