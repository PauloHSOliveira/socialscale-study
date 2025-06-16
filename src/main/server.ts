import http from "node:http";
import { disconnectRedis } from "../infrastructure/cache/RedisClient";
import { environment } from "../infrastructure/config/Environment";
import { disconnectDatabase } from "../infrastructure/database/PrismaClient";
import { createApp } from "./app";

async function startServer(): Promise<void> {
  try {
    const app = createApp();
    const server = http.createServer(app);

    server.listen(environment.port, () => {
      console.log(`Server running at http://localhost:${environment.port}`);
      console.log(`Process ${process.pid} is listening on port ${environment.port}`);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received, shutting down gracefully...");
      server.close(async () => {
        await disconnectDatabase();
        await disconnectRedis();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}
