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
});

run();
