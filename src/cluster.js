import cluster from "cluster";
import { cpus } from "os";
import logger from "./utils/logger.util.js";
import initializeApp from "./app.js";

const processors = cpus().length;

if (cluster.isPrimary) {
  for (let i = 0; i < processors; i++) {
    cluster.fork();
  }
} else {
  logger.info(`Child process started with PID '${process.pid}'`);
  initializeApp();
}
