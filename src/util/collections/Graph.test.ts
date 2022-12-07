import { describe, expect, it, run } from "@test_deps";

import { Graph } from "./Graph.ts";

describe("Graph", () => {
  it("should add, remove, and remember edges", () => {
    const graph = new Graph<string>();
    graph.addEdge("a", "b");
    graph.addEdge("a", "c");
    graph.addEdge("b", "c");
    graph.addEdge("b", "d");
    expect(graph.getEdges("a")).toEqual(new Set(["b", "c"]));
    expect(graph.getEdges("b")).toEqual(new Set(["c", "d"]));
    expect(graph.getEdges("c")).toEqual(new Set());
    expect(graph.getEdges("d")).toEqual(new Set());
    graph.removeEdge("a", "b");
    graph.removeEdge("a", "c");
    graph.removeEdge("b", "c");
    graph.removeEdge("b", "d");
    expect(graph.getEdges("a")).toEqual(new Set());
    expect(graph.getEdges("b")).toEqual(new Set());
    expect(graph.getEdges("c")).toEqual(new Set());
    expect(graph.getEdges("d")).toEqual(new Set());
  });

  it("should return empty sets for unknown nodes", () => {
    const graph = new Graph<string>();
    expect(graph.getEdges("a")).toEqual(new Set());
    expect(graph.getEdges("b")).toEqual(new Set());
    expect(graph.getEdges("c")).toEqual(new Set());
    expect(graph.getEdges("d")).toEqual(new Set());
  });

  it("should return all nodes", () => {
    const graph = new Graph<string>();
    graph.addEdge("a", "b");
    graph.addEdge("a", "c");
    graph.addEdge("b", "c");
    graph.addEdge("b", "d");
    expect(graph.getNodes()).toEqual(["a", "b", "c", "d"]);
  });
});

run();
