export interface RateLimitService {
  checkLimit(
    key: string,
    windowMs: number,
    maxRequests: number,
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }>;
}
