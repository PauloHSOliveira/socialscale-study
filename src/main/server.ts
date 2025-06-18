import http from "node:http";
import { disconnectRedis } from "../infrastructure/cache/RedisClient";
import { environment } from "../infrastructure/config/Environment";
import { disconnectDatabase } from "../infrastructure/database/PrismaClient";
import { createApp } from "./app";
import { logger } from "../infrastructure/logger/Logger";

async function startServer(): Promise<void> {
  try {
    const app = createApp();
    const server = http.createServer(app);

    server.listen(environment.port, () => {
      logger.info(`Server running at http://localhost:${environment.port}`);
      logger.info(`Process ${process.pid} is listening on port ${environment.port}`);
    });

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down gracefully...");
      server.close(async () => {
        await disconnectDatabase();
        await disconnectRedis();
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}
