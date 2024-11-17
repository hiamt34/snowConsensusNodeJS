const { BROADCAST_COUNT } = require("./constants");

class Network {
  constructor() {
    this.nodes = [];
  }

  addNode(node) {
    this.nodes.push(node);
  }

  getNodes() {
    return this.nodes;
  }

  sampleNodes(k) {
    const shuffled = [...this.nodes].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, k);
  }

  broadcastTransaction(transaction, senderId) {
    const targetNodes = this.sampleNodes(BROADCAST_COUNT);
    this.nodes.forEach((node) => {
      if (node.nodeId !== senderId) {
        node.receiveTransaction(transaction);
      }
    });
  }
}
module.exports = Network;
