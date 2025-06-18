import type { Logger } from "../../domain/services/Logger";

export class ConsoleLogger implements Logger {
  info(message: string, meta?: object): void {
    console.log(`[INFO] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  error(message: string, error?: Error | unknown, meta?: object): void {
    console.error(`[ERROR] ${message}`, error, meta ? JSON.stringify(meta) : "");
  }

  warn(message: string, meta?: object): void {
    console.warn(`[WARN] ${message}`, meta ? JSON.stringify(meta) : "");
  }

  debug(message: string, meta?: object): void {
    console.debug(`[DEBUG] ${message}`, meta ? JSON.stringify(meta) : "");
  }
}
