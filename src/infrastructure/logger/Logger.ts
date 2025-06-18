import type { Logger as ILogger } from "../../domain/services/Logger";
import { container } from "../di/Container";

let loggerInstance: ILogger | null = null;

export const logger = {
  info: (message: string, meta?: object) => getLogger().info(message, meta),
  error: (message: string, error?: Error | unknown, meta?: object) =>
    getLogger().error(message, error, meta),
  warn: (message: string, meta?: object) => getLogger().warn(message, meta),
  debug: (message: string, meta?: object) => getLogger().debug(message, meta),
};

function getLogger(): ILogger {
  if (!loggerInstance) {
    try {
      loggerInstance = container.resolve<ILogger>("Logger");
    } catch (error) {
      // Fallback to console if DI not ready
      loggerInstance = {
        info: (message: string, meta?: object) => console.log(`[INFO] ${message}`, meta || ""),
        error: (message: string, error?: Error | unknown, meta?: object) =>
          console.error(`[ERROR] ${message}`, error, meta || ""),
        warn: (message: string, meta?: object) => console.warn(`[WARN] ${message}`, meta || ""),
        debug: (message: string, meta?: object) => console.debug(`[DEBUG] ${message}`, meta || ""),
      };
    }
  }
  return loggerInstance;
}
