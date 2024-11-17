const Node = require("../app/node");
const Network = require("../app/network");
const Transaction = require("../app/transaction");
const assert = require("assert");

describe("Node", () => {
  // it("should receive and broadcast a transaction: 20% invalid", () => {
  //   const network = new Network();
  //   const node = new Node(1, network);
  //   network.addNode(node);
  //   const tx = new Transaction("tx_1");

  //   node.receiveTransaction(tx);
  //   assert(node.transactions.has("tx_1"));
  // });

  it("should not re-broadcast a transaction already broadcasted", () => {
    const network = new Network();
    const node = new Node(1, network);

    network.addNode(node);

    const tx = new Transaction("tx_1");

    node.receiveTransaction(tx);
    node.broadcastTransaction(tx);
    assert.strictEqual(tx.broadcastCount, 1);
  });
});
