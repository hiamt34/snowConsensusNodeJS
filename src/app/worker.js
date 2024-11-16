const { Worker, isMainThread, workerData } = require("worker_threads");
const { NUM_PROCESSES, NODES_PER_PROCESS } = require("./constants");
const nodeProcess = require("./node_process");

if (isMainThread) {
  for (let i = 0; i < NUM_PROCESSES; i++) {
    const startId = i * NODES_PER_PROCESS;
    const endId = (i + 1) * NODES_PER_PROCESS;
    new Worker(__filename, { workerData: { startId, endId } });
  }
} else {
  const { startId, endId } = workerData;
  nodeProcess(startId, endId);
}
