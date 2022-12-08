import { describe, expect, it, run } from "@test_deps";

import { Graph } from "./Graph.ts";

const expectContentEqual = <T>(a: Iterable<T>, b: Iterable<T>) => {
  expect(Array.from(a).sort()).toEqual(Array.from(b).sort());
};

describe("Graph", () => {
  it("should be able to add nodes", () => {
    const graph = new Graph<string>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    expectContentEqual(graph.getNodesArray(), ["a", "b", "c"]);
  });

  it("should be able to add edges", () => {
    const graph = new Graph<string>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addEdge("a", "b");
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
    const graph = new Graph<string>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addBiEdge("a", "b");
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
});

run();
