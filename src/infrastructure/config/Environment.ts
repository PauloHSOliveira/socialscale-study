export interface EnvironmentConfig {
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  redisUrl: string;
  nodeEnv: string;
  logLevel: string;
  // Rate limiting config
  rateLimitGeneral: number;
  rateLimitPost: number;
  rateLimitLogin: number;
  rateLimitSignup: number;
}

// Database configuration builder
const buildDatabaseUrl = (): string => {
  const baseUrl =
    process.env.DATABASE_URL || "postgresql://socialscale:devpass@localhost:5432/socialscale";

  // Database performance parameters
  const connectionLimit = process.env.DB_CONNECTION_LIMIT || "50";
  const poolTimeout = process.env.DB_POOL_TIMEOUT || "10000";
  const statementTimeout = process.env.DB_STATEMENT_TIMEOUT || "30000";

  // Build query parameters
  const params = new URLSearchParams({
    connection_limit: connectionLimit,
    pool_timeout: poolTimeout,
    statement_timeout: statementTimeout,
  });

  return `${baseUrl}?${params.toString()}`;
};

export const environment: EnvironmentConfig = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  databaseUrl: buildDatabaseUrl(),
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
  // Configurable rate limits
  rateLimitGeneral: Number(process.env.RATE_LIMIT_GENERAL) || 15000,
  rateLimitPost: Number(process.env.RATE_LIMIT_POST) || 10000,
  rateLimitLogin: Number(process.env.RATE_LIMIT_LOGIN) || 5000,
  rateLimitSignup: Number(process.env.RATE_LIMIT_SIGNUP) || 2000,
};
