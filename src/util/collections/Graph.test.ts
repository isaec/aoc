import { describe, expect, it, run } from "@test_deps";

import { Graph } from "./Graph.ts";

const expectContentEqual = <T>(a: Iterable<T>, b: Iterable<T>) => {
  expect(Array.from(a).sort()).toEqual(Array.from(b).sort());
};

type Node = "a" | "b" | "c" | "d" | "e" | "f" | "g";

describe("Graph", () => {
  it("should be able to add nodes", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
  });

  it("should be able to add edges", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    expect(graph.hasEdge("a", "b")).toBe(false);
    graph.addEdge("a", "b");
    expect(graph.hasEdge("a", "b")).toBe(true);
    graph.addEdge("b", "c");
    graph.addEdge("c", "a");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
    expectContentEqual(graph.getEdgesArray("a"), ["b"]);
    expectContentEqual(graph.getEdgesArray("b"), ["c"]);
    expectContentEqual(graph.getEdgesArray("c"), ["a"]);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]);
  });

  it("should be able to add bi-directional edges", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addBiEdge("a", "b");
    expect(graph.hasBiEdge("a", "b")).toBe(true);
    graph.addBiEdge("b", "c");
    graph.addBiEdge("c", "a");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
    expectContentEqual(graph.getEdgesArray("a"), ["b", "c"]);
    expectContentEqual(graph.getEdgesArray("b"), ["a", "c"]);
    expectContentEqual(graph.getEdgesArray("c"), ["a", "b"]);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["a", "c"],
      ["b", "a"],
      ["b", "c"],
      ["c", "a"],
      ["c", "b"],
    ]);
  });

  it("should be able to remove nodes", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addEdge("a", "b");
    graph.addEdge("b", "c");
    graph.addEdge("c", "a");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]);
    graph.removeNode("b");
    expectContentEqual(graph.getNodesArray(), ["a", "c"]);
    expectContentEqual(graph.getAllEdgesArray(), [["c", "a"]]);
  });

  it("should be able to remove edges", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addEdge("a", "b");
    graph.addEdge("b", "c");
    graph.addEdge("c", "a");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]);
    graph.removeEdge("a", "b");
    expectContentEqual(graph.getAllEdgesArray(), [
      ["b", "c"],
      ["c", "a"],
    ]);
  });

  it("should be able to remove bi-directional edges", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addBiEdge("a", "b");
    graph.addBiEdge("b", "c");
    graph.addBiEdge("c", "a");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["a", "c"],
      ["b", "a"],
      ["b", "c"],
      ["c", "a"],
      ["c", "b"],
    ]);
    graph.removeBiEdge("a", "b");
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "c"],
      ["b", "c"],
      ["c", "a"],
      ["c", "b"],
    ]);
    graph.removeEdge("a", "c");
    expectContentEqual(graph.getAllEdgesArray(), [
      ["b", "c"],
      ["c", "a"],
      ["c", "b"],
    ]);
  });

  it("should be able to get the number of nodes", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    expect(graph.nodeCount).toBe(3);
    graph.removeNode("b");
    expect(graph.nodeCount).toBe(2);
  });

  it("should be able to get the number of edges and nodes", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    expect(graph.nodeCount).toBe(1);
    graph.addNode("b");
    graph.addNode("c");
    expect(graph.nodeCount).toBe(3);
    graph.addEdge("a", "b");
    graph.addEdge("b", "c");
    graph.addEdge("c", "a");
    expect(graph.edgeCount).toBe(3);
    graph.removeEdge("a", "b");
    expect(graph.edgeCount).toBe(2);
  });

  it("shouldn't be able to add duplicate edges", () => {
    const graph = new Graph<Node>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addEdge("a", "b");
    expect(graph.hasEdge("a", "b")).toBe(true);
    graph.addEdge("b", "c");
    graph.addEdge("c", "a");
    expect(graph.edgeCount).toBe(3);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]);
    graph.addEdge("a", "b");
    expect(graph.edgeCount).toBe(3);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]);
    graph.addEdge("b", "c");
    expect(graph.edgeCount).toBe(3);
    graph.addEdge("c", "a");
    expect(graph.edgeCount).toBe(3);

    graph.removeEdge("a", "b");
    expect(graph.edgeCount).toBe(2);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["b", "c"],
      ["c", "a"],
    ]);

    graph.addEdge("a", "b");
    expect(graph.edgeCount).toBe(3);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
      ["c", "a"],
    ]);

    graph.removeNode("a");
    expect(graph.nodeCount).toBe(2);
    expect(graph.edgeCount).toBe(1);
    expectContentEqual(graph.getAllEdgesArray(), [["b", "c"]]);
    expect(graph.hasEdge("a", "b")).toBe(false);

    graph.addEdge("a", "b");
    expect(graph.edgeCount).toBe(2);
    expect(graph.nodeCount).toBe(3);
    expect(graph.hasEdge("a", "b")).toBe(true);
    expectContentEqual(graph.getAllEdgesArray(), [
      ["a", "b"],
      ["b", "c"],
    ]);
  });

  it("should be able to pass basic counting stress test", () => {
    const graph = new Graph<number>();
    const nodeCount = 1000;
    for (let i = 0; i < nodeCount; i++) {
      graph.addNode(i);
    }
    expect(graph.nodeCount).toBe(nodeCount);
    for (let i = 0; i < nodeCount - 1; i++) {
      graph.addEdge(i, i + 1);
    }
    expect(graph.nodeCount).toBe(nodeCount);
    expect(graph.edgeCount).toBe(nodeCount - 1);
    for (let i = 0; i < nodeCount - 100; i++) {
      graph.removeNode(i);
    }
    expect(graph.nodeCount).toBe(100);
    expect(graph.edgeCount).toBe(99);

    // double remove some nodes!
    for (let i = 0; i < nodeCount; i++) {
      graph.removeNode(i);
    }
    expect(graph.nodeCount).toBe(0);
    expect(graph.edgeCount).toBe(0);
  });

  it("should support exotic node types", () => {
    const alpha = { a: 1, b: "a" };
    const beta = { a: 2, b: "b" };
    const gamma = { a: 3, b: "c" };
    type GreekNode = typeof alpha | typeof beta | typeof gamma;
    const graph = new Graph<GreekNode>();
    graph.addNode(alpha);
    graph.addNode(beta);
    graph.addNode(gamma);
    expect(graph.nodeCount).toBe(3);
    graph.addNode(alpha);
    expect(graph.nodeCount).toBe(3);
    graph.addEdge(alpha, beta);
    expect(graph.edgeCount).toBe(1);
    expect(graph.hasEdge(alpha, beta)).toBe(true);
    expect(graph.hasEdge(beta, alpha)).toBe(false);
    graph.addEdge(beta, gamma);
    graph.addEdge(gamma, alpha);
    expect(graph.edgeCount).toBe(3);
    expect(graph.hasEdge(alpha, beta)).toBe(true);
    expectContentEqual(graph.getAllEdgesArray(), [
      [alpha, beta],
      [beta, gamma],
      [gamma, alpha],
    ]);
    graph.removeEdge(alpha, beta);
    expect(graph.edgeCount).toBe(2);
    expect(graph.hasEdge(alpha, beta)).toBe(false);
    expectContentEqual(graph.getAllEdgesArray(), [
      [beta, gamma],
      [gamma, alpha],
    ]);
  });
});

run();
