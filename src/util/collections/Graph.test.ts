import { describe, expect, it, run } from "@test_deps";

import { Graph } from "./Graph.ts";

describe("Graph", () => {
  it("should be able to add nodes", () => {
    const graph = new Graph<string>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    expect(graph.getNodesArray()).toEqual(["a", "b", "c"]);
  });

  it("should be able to add edges", () => {
    const graph = new Graph<string>();
    graph.addNode("a");
    graph.addNode("b");
    graph.addNode("c");
    graph.addEdge("a", "b");
    graph.addEdge("b", "c");
    graph.addEdge("c", "a");
    expect(graph.getNodesArray()).toEqual(["a", "b", "c"]);
  });
});

run();
