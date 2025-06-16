import type { RateLimitService } from "../../../domain/services/RateLimitService";

export class CheckRateLimitUseCase {
  constructor(private rateLimitService: RateLimitService) {}

  async execute(
    identifier: string,
    windowMs: number,
    maxRequests: number,
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    return this.rateLimitService.checkLimit(identifier, windowMs, maxRequests);
  }
}
