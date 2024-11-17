const assert = require("assert");
const sinon = require("sinon");
const Node = require("../app/node");
const Network = require("../app/network");
const Transaction = require("../app/transaction");
const {
  CONFIDENCE_THRESHOLD,
  MAX_ROUNDS,
  NUM_PROCESSES,
  NODES_PER_PROCESS,
} = require("../app/constants");
const { describe, it, beforeEach, afterEach } = require("mocha");

// Unit Test: Check if all nodes converge on a single decision for a transaction
describe("Node Consensus Convergence", function () {
  let network;
  let nodes;
  let transaction;
  let sandbox;

  beforeEach(function () {
    sandbox = sinon.createSandbox();
    network = new Network();
    nodes = [];

    const totalNodes = NUM_PROCESSES * NODES_PER_PROCESS;
    for (let i = 0; i < totalNodes; i++) {
      const node = new Node(i, network);
      nodes.push(node);
      network.addNode(node);
    }

    transaction = new Transaction("tx_test");
    nodes.forEach((node) => {
      node.receiveTransaction(transaction);
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it("should converge on a single decision for a transaction", function () {
    nodes.forEach((node) => {
      node.startConsensus();
    });

    const decisions = nodes.map((node) => {
      return node.confidences[transaction.txId] >= CONFIDENCE_THRESHOLD;
    });

    const firstDecision = decisions[0];
    const allAgree = decisions.every((d) => d === firstDecision);

    assert.ok(
      allAgree,
      "All nodes should converge to the same decision for the transaction"
    );
  });
});
