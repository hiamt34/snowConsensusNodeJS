const Network = require("./network");
const Node = require("./node");
const Transaction = require("./transaction");
const { v4: uuidv4 } = require("uuid");

function nodeProcess(startId, endId) {
  const network = new Network();
  const nodes = [];
  for (let nodeId = startId; nodeId < endId; nodeId++) {
    const node = new Node(nodeId, network);
    nodes.push(node);
    network.addNode(node);
  }

  nodes.forEach((node) => {
    const tx = new Transaction(`tx_${uuidv4()}`);
    node.receiveTransaction(tx);
  });

  setTimeout(() => {
    nodes.forEach((node) => {
      node.startConsensus();
    });
  }, 1000);
}
module.exports = nodeProcess;
