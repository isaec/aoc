import { mapIterable } from "../iterable.ts";
import { BiMap } from "./BiMap.ts";
import { RawPrioQueue } from "./PrioQueue.ts";

/**
 * Branded type for node addresses, a number that uniquely identifies a node in a graph.
 */
type NodeAddress = number & { _nodeAddress: never };

type Distance = number & { __distance: never };

/**
 * An unweighted directed graph, optimized for fast lookups and insertion. Nodes are mapped to a unique address in a {@link BiMap}, and edges are stored in a {@link Map} of node addresses to sets of node addresses.
 *
 * You can use any type as a node, but it should be unique as your node will be used as a key in a {@link Map}. Given this, modifying a node after it has been added to the graph may cause unexpected behavior.
 */
export class Graph<T> {
  private readonly nodeAddressMap: BiMap<T, NodeAddress>;
  private readonly addressEdgesMap: Map<NodeAddress, Set<NodeAddress>>;
  private internalEdgeCount = 0;
  private nextNodeAddress: NodeAddress = 0 as NodeAddress;

  constructor() {
    this.nodeAddressMap = new BiMap();
    this.addressEdgesMap = new Map();
  }

  /**
   * get the next available node address
   *
   * this is a private method because it is only used internally, and each call permanently increments the next node address
   *
   * @returns the next available node address
   */
  private getNextNodeAddress(): NodeAddress {
    return this.nextNodeAddress++ as NodeAddress;
  }

  /**
   * Get the set of edges for a given node. If the node has no edges, a new set is created and returned.
   * @param node the node to get the edge set for
   * @returns the set of nodes that are connected to the given node
   */
  private getEdgeSet(node: NodeAddress): Set<NodeAddress> {
    const set = this.addressEdgesMap.get(node);
    if (set !== undefined) return set;

    const newSet = new Set<NodeAddress>();
    this.addressEdgesMap.set(node, newSet);
    return newSet;
  }

  /**
   * Get the address of a given node. If the node is not in the graph, it is added and its address is returned.
   * @param node the node to get the address for
   * @returns the address of the given node
   */
  private getOrMakeNodeAddress(node: T): NodeAddress {
    const address = this.nodeAddressMap.get(node);
    if (address !== undefined) return address;
    const newAddress = this.getNextNodeAddress();
    this.nodeAddressMap.add(node, newAddress);
    return newAddress;
  }

  private getElementForAddress(address: NodeAddress): T {
    const element = this.nodeAddressMap.getKey(address);
    if (element === undefined) throw new Error("Invalid node address");
    return element;
  }

  private boundGetElementForAddress = this.getElementForAddress.bind(this);

  /**
   * passthrough for removing an edge from the edge set, and decrementing the edge count if the edge was removed
   * @param removed whether the edge was removed
   * @returns whether the edge was removed
   */
  private decrementEdgeCount(removed: boolean): boolean {
    if (removed) this.internalEdgeCount--;
    return removed;
  }

  get nodeCount() {
    return this.nodeAddressMap.size;
  }

  get edgeCount() {
    return this.internalEdgeCount;
  }

  /**
   * Add a node to the graph. If the node is already in the graph, nothing happens.
   * @runtime O(1)
   * @param node the node to add
   */
  addNode(node: T): void {
    // prevent needless incrementing of the next node address
    if (this.nodeAddressMap.hasKey(node)) return;
    this.nodeAddressMap.add(node, this.getNextNodeAddress());
  }

  /**
   * Add edges from a node to another node. If the edge already exists, nothing happens. If the nodes are not in the graph, they are added.
   * @runtime O(1)
   * @param fromNode the node the edge is coming from
   * @param toNode the node the edge is going to
   * @returns whether the edge was added
   */
  addEdge(fromNode: T, toNode: T): boolean {
    const fromNodeAddress = this.getOrMakeNodeAddress(fromNode);
    const toNodeAddress = this.getOrMakeNodeAddress(toNode);
    const edgeSet = this.getEdgeSet(fromNodeAddress);
    if (edgeSet.has(toNodeAddress)) return false;
    edgeSet.add(toNodeAddress);
    this.internalEdgeCount++;
    return true;
  }

  /**
   * Add edges from a node to multiple nodes. If the nodes are not in the graph, they are added. If any of the edges already exist, they are ignored.
   * @runtime O(n)
   * @param fromNode the node the edges are coming from
   * @param toNodes the nodes the edges are going to
   */
  addEdges(fromNode: T, toNodes: Iterable<T>): void {
    const fromNodeAddress = this.getOrMakeNodeAddress(fromNode);
    const edgeSet = this.getEdgeSet(fromNodeAddress);
    for (const toNode of toNodes) {
      const toNodeAddress = this.getOrMakeNodeAddress(toNode);
      if (edgeSet.has(toNodeAddress)) continue;
      edgeSet.add(toNodeAddress);
      this.internalEdgeCount++;
    }
  }

  /**
   * Add an edge in both directions. If the nodes are not in the graph, they are added, and existing edges are skipped.
   * @runtime O(1)
   * @param node1 one node in the edge pair
   * @param node2 another node in the edge pair
   */
  addBiEdge(node1: T, node2: T): void {
    this.addEdge(node1, node2);
    this.addEdge(node2, node1);
  }

  /**
   * Gets all the nodes in the graph. Order is not guaranteed.
   * @runtime O(1)
   * @returns an iterable of all the nodes in the graph
   */
  getNodes() {
    return this.nodeAddressMap.keys();
  }

  /**
   * @returns an array of all the nodes in the graph, by calling ``Array.from`` {@link getNodes}
   */
  getNodesArray() {
    return Array.from(this.nodeAddressMap.keys());
  }

  /**
   * Gets the edges coming from a given node.
   * @runtime O(1)
   * @param node the node to get the edges for
   * @returns the nodes that the given node is connected to by an edge
   */
  getEdges(node: T) {
    const internalNode = this.nodeAddressMap.get(node);
    if (internalNode === undefined) return [];

    const edges = this.addressEdgesMap.get(internalNode);
    // this is marginally better than creating an empty set for a node that may never have edges
    if (edges === undefined) return [];

    return mapIterable(edges, this.boundGetElementForAddress);
  }

  /**
   * @returns an array of all the edges in the graph, by calling ``Array.from`` {@link getAllEdges}
   */
  getEdgesArray(node: T) {
    return Array.from(this.getEdges(node));
  }

  /**
   * Gets all the edges in the graph. Order is not guaranteed.
   * @runtime O(|E|)
   * @returns an iterable of all the edges in the graph
   */
  *getAllEdges(): Generator<[T, T], void, unknown> {
    for (const [node, edges] of this.addressEdgesMap) {
      const nodeValue = this.getElementForAddress(node);
      for (const edge of edges) {
        yield [nodeValue, this.getElementForAddress(edge)];
      }
    }
  }

  /**
   * @returns an array of all the edges in the graph, by calling ``Array.from`` {@link getAllEdges}
   */
  getAllEdgesArray() {
    return Array.from(this.getAllEdges());
  }

  /**
   * Checks if a node is in the graph.
   * @runtime O(1)
   * @param node the node to check
   * @returns whether the node is in the graph
   */
  hasNode(node: T) {
    return this.nodeAddressMap.hasKey(node);
  }

  /**
   * Checks if an edge is in the graph.
   * @runtime O(1)
   * @param fromNode the node the edge is coming from
   * @param toNode the node the edge is going to
   * @returns whether the edge exists
   */
  hasEdge(fromNode: T, toNode: T) {
    const fromNodeAddress = this.nodeAddressMap.get(fromNode);
    if (fromNodeAddress === undefined) return false;

    const toNodeAddress = this.nodeAddressMap.get(toNode);
    if (toNodeAddress === undefined) return false;

    const edges = this.addressEdgesMap.get(fromNodeAddress);
    if (edges === undefined) return false;

    return edges.has(toNodeAddress);
  }

  /**
   * Checks if an edge is in the graph in both directions.
   * @runtime O(1)
   * @param node1 one node in the edge pair
   * @param node2 another node in the edge pair
   * @returns whether the edge exists
   */
  hasBiEdge(node1: T, node2: T) {
    const node1Address = this.nodeAddressMap.get(node1);
    if (node1Address === undefined) return false;

    const node2Address = this.nodeAddressMap.get(node2);
    if (node2Address === undefined) return false;

    const edges1 = this.addressEdgesMap.get(node1Address);
    if (edges1 === undefined) return false;

    const edges2 = this.addressEdgesMap.get(node2Address);
    if (edges2 === undefined) return false;

    return edges1.has(node2Address) && edges2.has(node1Address);
  }

  /**
   * Removes a node from the graph.
   * @runtime O(|E|)
   * @param node the node to remove
   * @returns whether the node was removed
   */
  removeNode(node: T): boolean {
    const nodeAddress = this.nodeAddressMap.get(node);
    if (nodeAddress === undefined) return false;

    // remove all edges to the node
    for (const edges of this.addressEdgesMap.values()) {
      this.decrementEdgeCount(edges.delete(nodeAddress));
    }

    // remove all edges from the node
    const edges = this.addressEdgesMap.get(nodeAddress);
    if (edges !== undefined) {
      this.internalEdgeCount -= edges.size;
      this.addressEdgesMap.delete(nodeAddress);
    }

    // remove the node itself
    this.nodeAddressMap.delete(node);

    return true;
  }

  /**
   * Removes an edge from the graph.
   * @runtime O(1)
   * @param fromNode the node the edge is coming from
   * @param toNode the node the edge is going to
   * @returns whether the edge was removed
   */
  removeEdge(fromNode: T, toNode: T): boolean {
    const fromNodeAddress = this.nodeAddressMap.get(fromNode);
    if (fromNodeAddress === undefined) return false;

    const toNodeAddress = this.nodeAddressMap.get(toNode);
    if (toNodeAddress === undefined) return false;

    const edges = this.addressEdgesMap.get(fromNodeAddress);
    if (edges === undefined) return false;

    return this.decrementEdgeCount(edges.delete(toNodeAddress));
  }

  /**
   * Removes an edge from the graph in both directions, by calling {@link removeEdge} twice.
   * @runtime O(1)
   * @param node1 a node in the edge pair
   * @param node2 another node in the edge pair
   * @returns whether the edge was removed
   */
  removeBiEdge(node1: T, node2: T): boolean {
    return this.removeEdge(node1, node2) && this.removeEdge(node2, node1);
  }

  *depthFirst(startNode: T) {
    if (!this.hasNode(startNode)) throw new Error("Node not in graph");
    const visited = new Set<T>();
    const stack = [startNode];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (visited.has(node)) continue;
      visited.add(node);
      yield node;
      for (const edge of this.getEdges(node)) {
        stack.push(edge);
      }
    }
  }

  *breadthFirst(startNode: T) {
    if (!this.hasNode(startNode)) throw new Error("Node not in graph");
    const visited = new Set<T>();
    const queue = [startNode];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node)) continue;
      visited.add(node);
      yield node;
      for (const edge of this.getEdges(node)) {
        queue.push(edge);
      }
    }
  }

  /**
   * Finds the shortest path between two nodes. Works with cycles. Uses Dijkstra's algorithm.
   * @param startNode the node to start path finding from
   * @param endNode the node to find a path to
   * @throws if either node is not in the graph
   * @returns an array of nodes representing the shortest path from startNode to endNode, or null if no path exists
   */
  shortestPath(startNode: T, endNode: T) {
    if (startNode === endNode) return [startNode];

    const startNodeAddress = this.nodeAddressMap.get(startNode);
    if (startNodeAddress === undefined)
      throw new Error("Start node not in graph");
    const endNodeAddress = this.nodeAddressMap.get(endNode);
    if (endNodeAddress === undefined) throw new Error("End node not in graph");

    type Distance = number & { __priority: never };

    const dist = new Map<NodeAddress, Distance>();
    const prev = new Map<NodeAddress, NodeAddress | undefined>();

    const queue = new RawPrioQueue<NodeAddress, Distance>(
      this.nodeAddressMap.size
    );

    for (const node of this.nodeAddressMap.values()) {
      dist.set(node, Infinity as Distance);
      prev.set(node, undefined);
      queue.push(node, Infinity as Distance);
    }

    dist.set(startNodeAddress, 0 as Distance);
    queue.push(endNodeAddress, 0 as Distance);

    while (queue.size > 0) {
      const u = queue.pop()! as NodeAddress;

      for (const v of this.addressEdgesMap.get(u) ?? []) {
        const alt = (dist.get(u)! + 1) as Distance;
        if (alt < dist.get(v)!) {
          dist.set(v, alt);
          prev.set(v, u);
          queue.push(v, alt);
        }
      }
    }

    const path = [];
    let node: NodeAddress | undefined = endNodeAddress;
    while (node !== undefined) {
      path.push(this.nodeAddressMap.getKey(node));
      node = prev.get(node);
    }

    // detect if there is no path
    if (path.length === 1 && path[0] === endNode) return null;

    return path.reverse();
  }

  shortestPaths(startNodes: T[], endNode: T): Map<T, T[] | null> {
    if (startNodes.length === 0) throw new Error("No start nodes provided");

    const endNodeAddress = this.nodeAddressMap.get(endNode);
    if (endNodeAddress === undefined) throw new Error("End node not in graph");

    const dist = new Map<NodeAddress, Distance>();
    const prev = new Map<NodeAddress, NodeAddress | undefined>();

    const queue = new RawPrioQueue<NodeAddress, Distance>(
      this.nodeAddressMap.size
    );

    for (const node of this.nodeAddressMap.values()) {
      dist.set(node, Infinity as Distance);
      prev.set(node, undefined);
      queue.push(node, Infinity as Distance);
    }

    for (const startNode of startNodes) {
      const startNodeAddress = this.nodeAddressMap.get(startNode);
      if (startNodeAddress === undefined)
        throw new Error("Start node not in graph");
      dist.set(startNodeAddress, 0 as Distance);
      queue.push(startNodeAddress, 0 as Distance);
    }

    while (queue.size > 0) {
      const u = queue.pop()! as NodeAddress;

      for (const v of this.addressEdgesMap.get(u) ?? []) {
        const alt = (dist.get(u)! + 1) as Distance;
        if (alt < dist.get(v)!) {
          dist.set(v, alt);
          prev.set(v, u);
          queue.push(v, alt);
        }
      }
    }

    const paths = new Map<T, T[] | null>();

    for (const startNode of startNodes) {
      const startNodeAddress = this.nodeAddressMap.get(startNode);
      if (startNodeAddress === undefined)
        throw new Error("Start node not in graph");

      const path = [];
      let node: NodeAddress | undefined = endNodeAddress;
      while (node !== undefined) {
        path.push(this.nodeAddressMap.getKey(node));
        node = prev.get(node);
      }

      paths.set(
        startNode,
        path.length === 1 && path[0] === endNode
          ? null
          : (path.reverse() as T[])
      );
    }

    return paths;
  }
}
