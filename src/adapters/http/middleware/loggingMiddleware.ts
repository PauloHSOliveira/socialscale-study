import type { NextFunction, Request, Response } from "express";
import { logger } from "../../../infrastructure/logger/Logger";
import type { AuthRequest } from "../../../shared/types/AuthRequest";

export const loggingMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const startTime = process.hrtime.bigint();
  const requestId = generateRequestId();

  req.requestId = requestId;

  // Log incoming request
  logger.debug("Incoming request", {
    requestId,
    method: req.method,
    url: req.originalUrl,
    userAgent: req.get("User-Agent"),
    ip: getClientIP(req),
    timestamp: new Date().toISOString(),
  });

  res.on("finish", () => {
    const endTime = process.hrtime.bigint();
    const responseTime = Number(endTime - startTime) / 1_000_000; // Convert to milliseconds

    const logLevel = getLogLevel(res.statusCode);
    const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTime.toFixed(2)}ms`;

    const metadata = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: Math.round(responseTime),
      userId: req.userId || "anonymous",
      ip: getClientIP(req),
      userAgent: req.get("User-Agent"),
      contentLength: res.get("content-length") || "0",
      timestamp: new Date().toISOString(),
    };

    logger[logLevel](message, metadata);
  });

  next();
};

function getLogLevel(statusCode: number): "error" | "warn" | "info" | "debug" {
  if (statusCode >= 500) return "error";
  if (statusCode >= 400) return "warn";
  if (statusCode >= 300) return "info";
  return "info";
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function getClientIP(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"] as string;
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return (
    (req.headers["x-real-ip"] as string) ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    "unknown"
  );
}
