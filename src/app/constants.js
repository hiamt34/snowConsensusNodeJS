module.exports = {
  NUM_PROCESSES: 10,
  NODES_PER_PROCESS: 20,
  NUM_NODES: 200,
  K: 200 * 0.2, // Number of validators to sample
  BROADCAST_COUNT: 10, // Number of nodes to broadcast the transaction to
  CONFIDENCE_THRESHOLD: 0.5, // Threshold for consensus
  BETA: 10, // Number of consecutive successful rounds needed to finalize a decision
  MAX_ROUNDS: 20, // Maximum number of rounds to try for consensus
};
