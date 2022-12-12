import { describe, expect, it, run } from "@test_deps";

import { Graph } from "./Graph.ts";

const expectContentEqual = <T>(a: Iterable<T>, b: Iterable<T>) => {
  expect(Array.from(a).sort()).toEqual(Array.from(b).sort());
};

type Node = "a" | "b" | "c" | "d" | "e" | "f" | "g";
type SplitNodes =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e1"
  | "e2"
  | "f1"
  | "f2"
  | "g1"
  | "g2";

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

  describe("depth-first traversal", () => {
    it("should be able to iterate depth-first singly linked set of nodes", () => {
      const graph = new Graph<Node>();
      graph.addNode("a");
      graph.addNode("b");
      graph.addNode("c");
      graph.addNode("d");
      graph.addNode("e");
      graph.addNode("f");
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      graph.addEdge("c", "d");
      graph.addEdge("d", "e");
      graph.addEdge("e", "f");
      expect(graph.nodeCount).toBe(6);
      expect(graph.edgeCount).toBe(5);
      const visited: Node[] = [];
      for (const node of graph.depthFirst("a")) {
        visited.push(node);
      }
      expect(visited).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    it("should be able to iterate depth-first singly linked set of nodes with a cycle", () => {
      const graph = new Graph<Node>();
      graph.addNode("a");
      graph.addNode("b");
      graph.addNode("c");
      graph.addNode("d");
      graph.addNode("e");
      graph.addNode("f");
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      graph.addEdge("c", "d");
      graph.addEdge("d", "e");
      graph.addEdge("e", "f");
      graph.addEdge("f", "a");
      expect(graph.nodeCount).toBe(6);
      expect(graph.edgeCount).toBe(6);
      const visited: Node[] = [];
      for (const node of graph.depthFirst("a")) {
        visited.push(node);
      }
      expect(visited).toEqual(["a", "b", "c", "d", "e", "f"]);
    });

    it("should be able to iterate depth-first singly linked set of nodes with a branch", () => {
      const graph = new Graph<SplitNodes>();
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      graph.addEdge("c", "d");
      graph.addEdges("d", ["e1", "e2"]);
      graph.addEdge("e1", "f1");
      graph.addEdge("e2", "f2");
      graph.addEdge("f1", "g1");
      graph.addEdge("f2", "g2");

      expect(graph.nodeCount).toBe(10);
      expect(graph.edgeCount).toBe(9);

      const visited: SplitNodes[] = [];
      for (const node of graph.depthFirst("a")) {
        visited.push(node);
      }
      expect(visited.slice(0, 4)).toEqual(["a", "b", "c", "d"]);

      if (visited[4] === "e1") {
        expect(visited.slice(4)).toEqual(["e1", "f1", "g1", "e2", "f2", "g2"]);
      } else {
        expect(visited.slice(4)).toEqual(["e2", "f2", "g2", "e1", "f1", "g1"]);
      }
    });

    it("should be able to iterate depth-first singly linked set of nodes with a branch regardless of insertion order ", () => {
      const edgesToInsert: readonly [SplitNodes, SplitNodes][] = [
        ["a", "b"],
        ["b", "c"],
        ["c", "d"],
        ["d", "e1"],
        ["d", "e2"],
        ["e1", "f1"],
        ["f1", "g1"],
        ["e2", "f2"],
        ["f2", "g2"],
      ];
      for (let i = 0; i < 100; i++) {
        const graph = new Graph<SplitNodes>();

        // Insert edges in random order
        const edges = [...edgesToInsert];
        while (edges.length > 0) {
          const index = Math.floor(Math.random() * edges.length);
          const [from, to] = edges.splice(index, 1)[0];
          graph.addEdge(from, to);
        }

        expect(graph.nodeCount).toBe(10);
        expect(graph.edgeCount).toBe(9);

        const visited: SplitNodes[] = [];
        for (const node of graph.depthFirst("a")) {
          visited.push(node);
        }
        expect(visited.slice(0, 4)).toEqual(["a", "b", "c", "d"]);
        if (visited[4] === "e1") {
          expect(visited.slice(4)).toEqual([
            "e1",
            "f1",
            "g1",
            "e2",
            "f2",
            "g2",
          ]);
        } else {
          expect(visited.slice(4)).toEqual([
            "e2",
            "f2",
            "g2",
            "e1",
            "f1",
            "g1",
          ]);
        }
      }
    });

    it("should be able to iterate depth-first cyclic graph", () => {
      const graph = new Graph<number>();
      for (let i = 0; i < 100; i++) {
        graph.addNode(i);
      }
      for (let i = 0; i < 100; i++) {
        graph.addEdge(i, (i + 1) % 100);
      }
      expect(graph.nodeCount).toBe(100);
      expect(graph.edgeCount).toBe(100);
      const visited: number[] = [];
      for (const node of graph.depthFirst(0)) {
        visited.push(node);
      }
      expect(visited).toEqual(Array.from({ length: 100 }, (_, i) => i));
    });

    it("should be able to iterate depth-first dense cyclic graph", () => {
      const graph = new Graph<Node>();
      graph.addBiEdge("a", "b");
      graph.addBiEdge("b", "c");
      graph.addBiEdge("c", "d");
      graph.addEdge("d", "a");
      graph.addEdge("d", "e");
      graph.addEdge("e", "f");
      graph.addBiEdge("f", "g");
      graph.addEdge("g", "a");

      expect(graph.nodeCount).toBe(7);
      expect(graph.edgeCount).toBe(12);

      const visited: Node[] = [];
      for (const node of graph.depthFirst("a")) {
        visited.push(node);
      }

      // fragile test, but it's the best we can do
      expect(visited).toEqual(["a", "b", "c", "d", "e", "f", "g"]);
    });

    it("should be able to iterate depth-first disconnected bi-directed graph", () => {
      const graph = new Graph<Node>();
      graph.addBiEdge("a", "b");
      graph.addBiEdge("b", "c");
      graph.addBiEdge("c", "d");
      graph.addBiEdge("e", "f");
      graph.addBiEdge("f", "g");
      graph.addBiEdge("g", "e");

      expect(graph.nodeCount).toBe(7);
      expect(graph.edgeCount).toBe(12);

      const visited: Node[] = [];
      for (const node of graph.depthFirst("a")) {
        visited.push(node);
      }

      expect(visited).toEqual(["a", "b", "c", "d"]);

      const visited2: Node[] = [];
      for (const node of graph.depthFirst("e")) {
        visited2.push(node);
      }

      // fragile test, but it's the best we can do
      expect(visited2).toEqual(["e", "g", "f"]);
    });

    it("should throw when iterating with a non-existent node", () => {
      const graph = new Graph<number>();
      expect(() => {
        for (const _ of graph.depthFirst(0)) {
          // do nothing
        }
      }).toThrow();
    });
  });

  describe("breadth-first traversal", () => {
    it("should be able to iterate breadth-first singly linked set of nodes", () => {
      const graph = new Graph<number>();
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(4, 5);
      graph.addEdge(5, 6);
      graph.addEdge(6, 7);

      expect(graph.nodeCount).toBe(8);
      expect(graph.edgeCount).toBe(7);

      const visited: number[] = [];
      for (const node of graph.breadthFirst(0)) {
        visited.push(node);
      }
      expect(visited).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it("should be able to iterate breadth-first singly linked set of nodes with a cycle", () => {
      const graph = new Graph<number>();
      graph.addEdge(0, 1);
      graph.addEdge(1, 2);
      graph.addEdge(2, 3);
      graph.addEdge(3, 4);
      graph.addEdge(4, 5);
      graph.addEdge(5, 6);
      graph.addEdge(6, 7);
      graph.addEdge(7, 0);

      expect(graph.nodeCount).toBe(8);
      expect(graph.edgeCount).toBe(8);

      const visited: number[] = [];
      for (const node of graph.breadthFirst(0)) {
        visited.push(node);
      }
      expect(visited).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it("should be able to iterate breadth-first singly linked set of nodes with a branch", () => {
      const graph = new Graph<SplitNodes>();
      graph.addEdge("a", "b");
      graph.addEdge("b", "c");
      graph.addEdge("c", "d");
      graph.addEdges("d", ["e1", "e2"]);
      graph.addEdge("e1", "f1");
      graph.addEdge("f1", "g1");
      graph.addEdge("e2", "f2");
      graph.addEdge("f2", "g2");

      expect(graph.nodeCount).toBe(10);
      expect(graph.edgeCount).toBe(9);

      const visited: SplitNodes[] = [];
      for (const node of graph.breadthFirst("a")) {
        visited.push(node);
      }

      // fragile test, but it's the best we can do
      expect(visited).toEqual([
        "a",
        "b",
        "c",
        "d",
        "e1",
        "e2",
        "f1",
        "f2",
        "g1",
        "g2",
      ]);
    });

    it("should throw when iterating with a non-existent node", () => {
      const graph = new Graph<number>();
      expect(() => {
        for (const _ of graph.breadthFirst(0)) {
          // do nothing
        }
      }).toThrow();
    });
  });
});

run();
