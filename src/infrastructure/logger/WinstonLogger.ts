import winston from "winston";
import type { Logger } from "../../domain/services/Logger";

export class WinstonLogger implements Logger {
  private winston: winston.Logger;

  constructor() {
    this.winston = winston.createLogger({
      level: process.env.LOG_LEVEL || "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
          return `${timestamp} [${level}]: ${message}${stack ? `\n${stack}` : ""}${metaStr}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ 
          filename: "logs/error.log", 
          level: "error" 
        }),
        new winston.transports.File({ 
          filename: "logs/combined.log" 
        })
      ],
      exceptionHandlers: [
        new winston.transports.File({ filename: "logs/exceptions.log" })
      ],
    });
  }

  info(message: string, meta?: object): void {
    this.winston.info(message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: object): void {
    this.winston.error(message, { error, ...meta });
  }

  warn(message: string, meta?: object): void {
    this.winston.warn(message, meta);
  }

  debug(message: string, meta?: object): void {
    this.winston.debug(message, meta);
  }
} 