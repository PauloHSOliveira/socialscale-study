export interface EnvironmentConfig {
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  redisUrl: string;
  nodeEnv: string;
  logLevel: string;
}

export const environment: EnvironmentConfig = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production",
  databaseUrl:
    process.env.DATABASE_URL || "postgresql://username:password@localhost:5432/socialscale",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  nodeEnv: process.env.NODE_ENV || "development",
  logLevel: process.env.LOG_LEVEL || "info",
};
