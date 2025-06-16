import express from "express";
import { HealthController } from "../controllers/HealthController";

export function createHealthRoutes(): express.Router {
  const router = express.Router();
  const healthController = new HealthController();

  router.get("/health", healthController.healthCheck);
  router.get("/health/readiness", healthController.readiness);
  router.get("/health/liveness", healthController.liveness);

  return router;
}
