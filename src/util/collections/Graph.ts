import { SetView } from "./SetView.ts";

export class Graph<T> {
  private readonly edges: Map<T, Set<T>>;

  constructor() {
    this.edges = new Map();
  }

  private static ensureSet<T>(map: Map<T, Set<T>>, key: T): Set<T> {
    const set = map.get(key);
    if (set !== undefined) return set;

    const newSet = new Set<T>();
    map.set(key, newSet);

    return newSet;
  }

  private static getSetView<T>(map: Map<T, Set<T>>, key: T): ReadonlySet<T> {
    return new SetView(Graph.ensureSet(map, key));
  }

  addEdge(from: T, to: T): void {
    Graph.ensureSet(this.edges, from).add(to);
  }

  removeEdge(from: T, to: T): boolean {
    return Graph.ensureSet(this.edges, from).delete(to);
  }

  getEdges(from: T): ReadonlySet<T> {
    return Graph.getSetView(this.edges, from);
  }

  getNodes(): T[] {
    return Array.from(this.edges.keys());
  }
}
