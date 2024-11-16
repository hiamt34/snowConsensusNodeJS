const { K, CONFIDENCE_THRESHOLD, MAX_BROADCASTS } = require("./constants");
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
      setImmediate(() => this.broadcastTransaction(transaction));
    }
  }

  broadcastTransaction(transaction) {
    if (!this.broadcastedTransactions.has(transaction.txId)) {
      this.broadcastedTransactions.add(transaction.txId);
      transaction.broadcastCount++;
      console.log(
        `Node ${this.nodeId} broadcasting transaction ${transaction.broadcastCount}: ${transaction.txId}`
      );
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
      const confidence = this.queryValidators(new Transaction(transactionId));
      if (confidence >= CONFIDENCE_THRESHOLD) {
        console.log(
          `Node ${this.nodeId} accepted transaction ${transactionId} with confidence ${confidence}`
        );
        this.confidences[transactionId] = confidence;
      } else {
        console.log(
          `Node ${this.nodeId} rejected transaction ${transactionId} with confidence ${confidence}`
        );
      }
    });
  }
}
module.exports = Node;
