import type { Request, Response } from "express";
import { getRedisClient } from "../../../infrastructure/cache/RedisClient";
import { getDatabaseClient } from "../../../infrastructure/database/PrismaClient";

export class HealthController {
  async healthCheck(req: Request, res: Response): Promise<void> {
    const health = {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: "unknown",
        cache: "unknown",
      },
    };

    try {
      await getDatabaseClient().$queryRaw`SELECT 1`;
      health.services.database = "healthy";
    } catch (error) {
      health.services.database = "unhealthy";
      health.status = "degraded";
    }

    try {
      await getRedisClient().ping();
      health.services.cache = "healthy";
    } catch (error) {
      health.services.cache = "unhealthy";
      health.status = "degraded";
    }

    const statusCode = health.status === "ok" ? 200 : 503;
    res.status(statusCode).json(health);
  }

  async readiness(req: Request, res: Response): Promise<void> {
    try {
      await getDatabaseClient().$queryRaw`SELECT 1`;
      await getRedisClient().ping();
      res.status(200).json({ status: "ready" });
    } catch (error) {
      res.status(503).json({
        status: "not ready",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async liveness(req: Request, res: Response): Promise<void> {
    res.status(200).json({ status: "alive" });
  }
}
