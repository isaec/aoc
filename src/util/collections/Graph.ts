import { mapIterable } from "../iterable.ts";
import { BiMap } from "./BiMap.ts";

/**
 * Branded type for node addresses, a number that uniquely identifies a node in a graph.
 */
type NodeAddress = number & { _nodeAddress: never };

/**
 * An unweighted directed graph, optimized for fast lookups and insertion.
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

  addEdge(fromNode: T, toNode: T): void {
    const fromNodeAddress = this.getOrMakeNodeAddress(fromNode);
    const toNodeAddress = this.getOrMakeNodeAddress(toNode);
    const edgeSet = this.getEdgeSet(fromNodeAddress);
    if (edgeSet.has(toNodeAddress)) return;
    edgeSet.add(toNodeAddress);
    this.internalEdgeCount++;
  }

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

  addBiEdge(node1: T, node2: T): void {
    this.addEdge(node1, node2);
    this.addEdge(node2, node1);
  }

  getNodes() {
    return this.nodeAddressMap.keys();
  }

  getNodesArray() {
    return Array.from(this.nodeAddressMap.keys());
  }

  getEdges(node: T) {
    const internalNode = this.nodeAddressMap.get(node);
    if (internalNode === undefined) return [];

    const edges = this.addressEdgesMap.get(internalNode);
    // this is marginally better than creating an empty set for a node that may never have edges
    if (edges === undefined) return [];

    return mapIterable(edges, this.boundGetElementForAddress);
  }

  getEdgesArray(node: T) {
    return Array.from(this.getEdges(node));
  }

  *getAllEdges(): Generator<[T, T]> {
    for (const [node, edges] of this.addressEdgesMap) {
      const nodeValue = this.getElementForAddress(node);
      for (const edge of edges) {
        yield [nodeValue, this.getElementForAddress(edge)];
      }
    }
  }

  getAllEdgesArray() {
    return Array.from(this.getAllEdges());
  }

  hasNode(node: T) {
    return this.nodeAddressMap.hasKey(node);
  }

  hasEdge(fromNode: T, toNode: T) {
    const fromNodeAddress = this.nodeAddressMap.get(fromNode);
    if (fromNodeAddress === undefined) return false;

    const toNodeAddress = this.nodeAddressMap.get(toNode);
    if (toNodeAddress === undefined) return false;

    const edges = this.addressEdgesMap.get(fromNodeAddress);
    if (edges === undefined) return false;

    return edges.has(toNodeAddress);
  }

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

  removeNode(node: T): boolean {
    const nodeAddress = this.nodeAddressMap.get(node);
    if (nodeAddress === undefined) return false;

    this.nodeAddressMap.delete(node);
    this.addressEdgesMap.delete(nodeAddress);

    for (const edges of this.addressEdgesMap.values()) {
      this.decrementEdgeCount(edges.delete(nodeAddress));
    }

    return true;
  }

  removeEdge(fromNode: T, toNode: T): boolean {
    const fromNodeAddress = this.nodeAddressMap.get(fromNode);
    if (fromNodeAddress === undefined) return false;

    const toNodeAddress = this.nodeAddressMap.get(toNode);
    if (toNodeAddress === undefined) return false;

    const edges = this.addressEdgesMap.get(fromNodeAddress);
    if (edges === undefined) return false;

    return this.decrementEdgeCount(edges.delete(toNodeAddress));
  }

  removeBiEdge(node1: T, node2: T): boolean {
    return this.removeEdge(node1, node2) && this.removeEdge(node2, node1);
  }
}
