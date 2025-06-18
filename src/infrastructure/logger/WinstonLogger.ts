import path from "node:path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import type { Logger } from "../../domain/services/Logger";
import { environment } from "../config/Environment";

interface ExtendedError extends Error {
  cause?: unknown;
}

export class WinstonLogger implements Logger {
  private winston: winston.Logger;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = environment.nodeEnv === "development";
    this.winston = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const logDir = path.join(process.cwd(), "logs");

    // Custom format for structured logging
    const structuredFormat = winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
      winston.format.errors({ stack: true }),
      winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "stack"] }),
      winston.format.json(),
    );

    // Human-readable format for development
    const devFormat = winston.format.combine(
      winston.format.timestamp({ format: "HH:mm:ss.SSS" }),
      winston.format.errors({ stack: true }),
      winston.format.colorize({ all: true }),
      winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
        const levelUpper = level.toUpperCase().padEnd(5);
        const metaStr = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta, null, 2)}` : "";
        return `${timestamp} [${levelUpper}]: ${message}${stack ? `\n${stack}` : ""}${metaStr}`;
      }),
    );

    const transports: winston.transport[] = [
      // Console transport
      new winston.transports.Console({
        format: this.isDevelopment ? devFormat : structuredFormat,
        level: environment.logLevel,
      }),
    ];

    // File transports for production
    if (!this.isDevelopment) {
      transports.push(
        // Combined logs with rotation
        new DailyRotateFile({
          filename: path.join(logDir, "application-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
          format: structuredFormat,
          level: environment.logLevel,
        }),

        // Error logs with rotation
        new DailyRotateFile({
          filename: path.join(logDir, "error-%DATE%.log"),
          datePattern: "YYYY-MM-DD",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "30d",
          format: structuredFormat,
          level: "error",
        }),
      );
    }

    return winston.createLogger({
      level: environment.logLevel,
      format: structuredFormat,
      defaultMeta: {
        service: "socialscale",
        environment: environment.nodeEnv,
        pid: process.pid,
      },
      transports,
      exceptionHandlers: !this.isDevelopment
        ? [
            new DailyRotateFile({
              filename: path.join(logDir, "exceptions-%DATE%.log"),
              datePattern: "YYYY-MM-DD",
              zippedArchive: true,
              maxSize: "20m",
              maxFiles: "30d",
            }),
          ]
        : [],
      rejectionHandlers: !this.isDevelopment
        ? [
            new DailyRotateFile({
              filename: path.join(logDir, "rejections-%DATE%.log"),
              datePattern: "YYYY-MM-DD",
              zippedArchive: true,
              maxSize: "20m",
              maxFiles: "30d",
            }),
          ]
        : [],
      exitOnError: false,
    });
  }

  info(message: string, meta?: object): void {
    this.winston.info(message, this.sanitizeMeta(meta));
  }

  error(message: string, error?: Error | unknown, meta?: object): void {
    const errorMeta = this.formatError(error);
    this.winston.error(message, { ...errorMeta, ...this.sanitizeMeta(meta) });
  }

  warn(message: string, meta?: object): void {
    this.winston.warn(message, this.sanitizeMeta(meta));
  }

  debug(message: string, meta?: object): void {
    this.winston.debug(message, this.sanitizeMeta(meta));
  }

  private formatError(error?: Error | unknown): object {
    if (!error) return {};

    if (error instanceof Error) {
      const extendedError = error as ExtendedError;
      const errorObj = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };

      if (extendedError.cause) {
        return { error: { ...errorObj, cause: extendedError.cause } };
      }

      return { error: errorObj };
    }

    return { error: String(error) };
  }

  private sanitizeMeta(meta?: object): object {
    if (!meta) return {};

    // Remove sensitive information
    const sanitized = { ...meta };
    const sensitiveKeys = ["password", "token", "secret", "key", "authorization"];

    for (const key of sensitiveKeys) {
      if (key in sanitized) {
        (sanitized as Record<string, unknown>)[key] = "[REDACTED]";
      }
    }

    return sanitized;
  }
}
