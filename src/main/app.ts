import cors from "cors";
import express from "express";
import { errorHandlerMiddleware } from "../adapters/http/middleware/errorHandlerMiddleware";
import { loggingMiddleware } from "../adapters/http/middleware/loggingMiddleware";
import { createAuthRoutes } from "../adapters/http/routes/authRoutes";
import { createHealthRoutes } from "../adapters/http/routes/healthRoutes";
import { createPostRoutes } from "../adapters/http/routes/postRoutes";
import { createUserRoutes } from "../adapters/http/routes/userRoutes";
import { registerServices } from "../infrastructure/di/ServiceRegistration";

export function createApp(): express.Application {
  const app = express();

  // Register dependencies
  registerServices();

  // Global middleware
  app.use(express.json({ limit: "10mb" }));
  app.use(cors());
  app.use(loggingMiddleware);

  // Routes
  app.use("/", createHealthRoutes());
  app.use("/", createAuthRoutes());
  app.use("/posts", createPostRoutes());
  app.use("/user", createUserRoutes());

  // Error handling middleware (must be last)
  app.use(errorHandlerMiddleware);

  return app;
}
