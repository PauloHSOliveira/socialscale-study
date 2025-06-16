import { environment } from "../infrastructure/config/Environment";
import { setupCluster } from "./cluster";

if (environment.nodeEnv === "production") {
  setupCluster();
} else {
  require("./server");
}
