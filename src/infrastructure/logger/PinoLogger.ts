import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import type { Logger } from "../../domain/services/Logger";
import { environment } from "../config/Environment";

interface ExtendedError extends Error {
  cause?: unknown;
}

export class PinoLogger implements Logger {
  private pino: pino.Logger;
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = environment.nodeEnv === "development";
    this.pino = this.createLogger();
  }

  private createLogger(): pino.Logger {
    const logDir = path.join(process.cwd(), "logs");

    // Ensure log directory exists
    if (!this.isDevelopment && !fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const baseConfig: pino.LoggerOptions = {
      level: environment.logLevel,
      base: {
        service: "socialscale",
        environment: environment.nodeEnv,
        pid: process.pid,
      },
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level: (label) => ({ level: label }),
        bindings: (bindings) => ({
          service: bindings.service,
          environment: bindings.environment,
          pid: bindings.pid,
        }),
      },
      serializers: {
        error: pino.stdSerializers.err,
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
      },
    };

    if (this.isDevelopment) {
      // Pretty print for development
      return pino({
        ...baseConfig,
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss.l",
            ignore: "pid,hostname,service,environment",
            singleLine: false,
            hideObject: false,
          },
        },
      });
    }

    // Production configuration with file rotation
    const multistream = pino.multistream([
      // Console output (structured JSON)
      { stream: process.stdout, level: environment.logLevel },
      // Application logs
      {
        stream: pino.destination({
          dest: path.join(logDir, "application.log"),
          sync: false,
          mkdir: true,
        }),
        level: environment.logLevel,
      },
      // Error logs
      {
        stream: pino.destination({
          dest: path.join(logDir, "error.log"),
          sync: false,
          mkdir: true,
        }),
        level: "error",
      },
    ]);

    return pino(baseConfig, multistream);
  }

  info(message: string, meta?: object): void {
    this.pino.info(this.sanitizeMeta(meta), message);
  }

  error(message: string, error?: Error | unknown, meta?: object): void {
    const errorMeta = this.formatError(error);
    this.pino.error({ ...errorMeta, ...this.sanitizeMeta(meta) }, message);
  }

  warn(message: string, meta?: object): void {
    this.pino.warn(this.sanitizeMeta(meta), message);
  }

  debug(message: string, meta?: object): void {
    this.pino.debug(this.sanitizeMeta(meta), message);
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
