import { container } from "../di/Container";
import type { Logger as ILogger } from "../../domain/services/Logger";

export const logger = container.resolve<ILogger>("Logger"); 