import type { NextFunction, Request, Response } from "express";
import { logger } from "../../../infrastructure/logger/Logger";

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    logger.info(`[${res.statusCode}] ${req.method} ${req.originalUrl}`);
  });
  next();
};
