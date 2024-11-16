const Network = require("../app/network");
const Node = require("../app/node");
const assert = require("assert");

describe("Network", () => {
  it("should add nodes to the network", () => {
    const network = new Network();
    const node = new Node(1, network);
    network.addNode(node);
    assert.strictEqual(network.getNodes().length, 1);
  });

  it("should sample nodes correctly", () => {
    const network = new Network();
    for (let i = 0; i < 10; i++) {
      network.addNode(new Node(i, network));
    }

    const sampledNodes = network.sampleNodes(5);
    assert.strictEqual(sampledNodes.length, 5);
  });
});
