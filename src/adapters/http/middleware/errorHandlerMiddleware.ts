import type { NextFunction, Request, Response } from "express";
import { logger } from "../../../infrastructure/logger/Logger";
import { BaseError } from "../../../shared/errors/BaseError";

interface PrismaError extends Error {
  code: string;
  meta?: Record<string, unknown>;
}

export const errorHandlerMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error("Error occurred:", error, {
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle custom application errors
  if (error instanceof BaseError) {
    res.status(error.statusCode).json({
      error: error.message,
      type: error.name,
    });
    return;
  }

  // Handle Prisma errors
  if (error.name === "PrismaClientKnownRequestError") {
    const prismaError = error as PrismaError;
    if (prismaError.code === "P2002") {
      res.status(409).json({
        error: "Resource already exists",
        type: "ConflictError",
      });
      return;
    }

    // Handle other Prisma errors
    res.status(400).json({
      error: "Database operation failed",
      type: "DatabaseError",
    });
    return;
  }

  // Handle validation errors from other sources
  if (error.name === "ValidationError") {
    res.status(400).json({
      error: error.message,
      type: "ValidationError",
    });
    return;
  }

  // Default error response
  res.status(500).json({
    error: "Internal server error",
    type: "InternalServerError",
  });
};
