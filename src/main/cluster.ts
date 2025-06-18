import cluster from "node:cluster";
import os from "node:os";
import { logger } from "../infrastructure/logger/Logger";

const numCPUs = os.cpus().length;

export function setupCluster(): void {
  if (cluster.isPrimary) {
    logger.info(`Master ${process.pid} is running`);
    logger.info(`Starting ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      logger.warn(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
      logger.info("Starting a new worker...");
      cluster.fork();
    });
  } else {
    require("./server");
    logger.info(`Worker ${process.pid} started`);
  }
}
