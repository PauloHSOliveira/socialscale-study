import type { Logger } from "../../domain/services/Logger";
import { PinoLogger } from "./PinoLogger";
import { WinstonLogger } from "./WinstonLogger";

export type LoggerType = "winston" | "pino";

export function createLogger(type?: LoggerType): Logger {
  const loggerType = type || (process.env.LOGGER_TYPE as LoggerType) || "winston";

  switch (loggerType) {
    case "pino":
      return new PinoLogger();
    default:
      return new WinstonLogger();
  }
}
