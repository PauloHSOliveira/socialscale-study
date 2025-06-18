import { RedisCacheService } from "../../adapters/cache/RedisCacheService";
import { PrismaFollowRepository } from "../../adapters/db/PrismaFollowRepository";
import { PrismaPostRepository } from "../../adapters/db/PrismaPostRepository";
import { PrismaUserRepository } from "../../adapters/db/PrismaUserRepository";
import type { FollowRepository } from "../../domain/repositories/FollowRepository";
import type { PostRepository } from "../../domain/repositories/PostRepository";
import type { UserRepository } from "../../domain/repositories/UserRepository";
import type { AuthService } from "../../domain/services/AuthService";
import type { CacheService } from "../../domain/services/CacheService";
import type { Logger } from "../../domain/services/Logger";
import type { RateLimitService } from "../../domain/services/RateLimitService";
import { BcryptAuthService } from "../auth/BcryptAuthService";
import { WinstonLogger } from "../logger/WinstonLogger";
import { RedisRateLimitService } from "../rate-limit/RedisRateLimitService";
import { container } from "./Container";

export function registerServices(): void {
  // Repositories
  container.registerSingleton<UserRepository>("UserRepository", PrismaUserRepository);
  container.registerSingleton<PostRepository>("PostRepository", PrismaPostRepository);
  container.registerSingleton<FollowRepository>("FollowRepository", PrismaFollowRepository);

  // Services
  container.registerSingleton<CacheService>("CacheService", RedisCacheService);
  container.registerSingleton<AuthService>("AuthService", BcryptAuthService);
  container.registerSingleton<RateLimitService>("RateLimitService", RedisRateLimitService);

  // Logger
  container.registerSingleton<Logger>("Logger", WinstonLogger);
}
