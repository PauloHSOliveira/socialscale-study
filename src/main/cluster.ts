import cluster from "node:cluster";
import os from "node:os";

const numCPUs = os.cpus().length;

export function setupCluster(): void {
  if (cluster.isPrimary) {
    console.log(`Master ${process.pid} is running`);
    console.log(`Starting ${numCPUs} workers...`);

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
      console.log("Starting a new worker...");
      cluster.fork();
    });
  } else {
    require("./server");
    console.log(`Worker ${process.pid} started`);
  }
}
