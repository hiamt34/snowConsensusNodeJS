const {
  K,
  CONFIDENCE_THRESHOLD,
  MAX_BROADCASTS,
  MAX_ROUNDS,
  BETA,
} = require("./constants");
const Transaction = require("./transaction");

class Node {
  constructor(nodeId, network) {
    this.nodeId = nodeId;
    this.network = network;
    this.transactions = new Set();
    this.confidences = {};
    this.broadcastedTransactions = new Set();
  }

  receiveTransaction(transaction) {
    if (
      this.validateTransaction(transaction) &&
      !this.transactions.has(transaction.txId)
    ) {
      this.transactions.add(transaction.txId);
      this.broadcastTransaction(transaction);
    }
  }

  broadcastTransaction(transaction) {
    if (!this.broadcastedTransactions.has(transaction.txId)) {
      this.broadcastedTransactions.add(transaction.txId);
      transaction.broadcastCount++;
      this.network.broadcastTransaction(transaction, this.nodeId);
    }
  }

  validateTransaction(transaction) {
    return Math.random() > 0.2;
  }

  queryValidators(transaction) {
    const selectedValidators = this.network.sampleNodes(K);
    let validVotes = 0;
    selectedValidators.forEach((validator) => {
      if (validator.transactions.has(transaction.txId)) {
        validVotes++;
      }
    });
    return validVotes / K;
  }

  startConsensus() {
    this.transactions.forEach((transactionId) => {
      let decisionMade = false;
      let preference = true; // Assume initially that the node prefers accepting the transaction
      let consecutiveSuccesses = 0;

      for (let round = 0; round < MAX_ROUNDS && !decisionMade; round++) {
        const confidence = this.queryValidators(new Transaction(transactionId));
        const majorityPreference = confidence >= CONFIDENCE_THRESHOLD;

        if (majorityPreference === preference) {
          consecutiveSuccesses++;
          if (consecutiveSuccesses >= BETA) {
            decisionMade = true;
            this.confidences[transactionId] = confidence;
            if (preference) {
              console.log(
                `Node ${
                  this.nodeId
                } accepted transaction ${transactionId} after ${
                  round + 1
                } rounds with confidence ${confidence}`
              );
            } else {
              console.log(
                `Node ${
                  this.nodeId
                } rejected transaction ${transactionId} after ${
                  round + 1
                } rounds with confidence ${confidence}`
              );
            }
          }
        } else {
          // Change preference and reset consecutive success counter
          preference = majorityPreference;
          consecutiveSuccesses = 0;
        }
      }

      if (!decisionMade) {
        console.log(
          `Node ${this.nodeId} could not finalize decision on transaction ${transactionId} after ${MAX_ROUNDS} rounds`
        );
      }
    });
  }
}
module.exports = Node;
