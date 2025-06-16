export interface EnvironmentConfig {
  port: number;
  jwtSecret: string;
  databaseUrl: string;
  redisHost: string;
  redisPort: number;
  nodeEnv: string;
}

export const environment: EnvironmentConfig = {
  port: Number(process.env.PORT) || 3333,
  jwtSecret: process.env.JWT_SECRET || "supersecretkey",
  databaseUrl: process.env.DATABASE_URL || "",
  redisHost: process.env.REDIS_HOST || "localhost",
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  nodeEnv: process.env.NODE_ENV || "development",
};
