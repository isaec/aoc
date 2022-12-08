import { mapIterable } from "../iterable.ts";
import { BiMap } from "./BiMap.ts";

/**
 * Branded type for node addresses, a number that uniquely identifies a node in a graph.
 */
type NodeAddress = number & { _nodeAddress: never };

/**
 * An unweighted undirected graph.
 */
export class Graph<T> {
  private readonly nodeAddressMap: BiMap<T, NodeAddress>;
  private readonly addressEdgesMap: Map<NodeAddress, Set<NodeAddress>>;
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

  /**
   * Add a node to the graph. If the node is already in the graph, nothing happens.
   * @param node the node to add
   */
  addNode(node: T): void {
    // prevent needless incrementing of the next node address
    if (this.nodeAddressMap.hasKey(node)) return;
    this.nodeAddressMap.add(node, this.getNextNodeAddress());
  }

  addEdge(node1: T, node2: T): void {
    const internalNode1 = this.getOrMakeNodeAddress(node1);
    const internalNode2 = this.getOrMakeNodeAddress(node2);
    this.getEdgeSet(internalNode1).add(internalNode2);
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

    return mapIterable(edges, this.getElementForAddress);
  }

  getEdgesArray(node: T) {
    return Array.from(this.getEdges(node));
  }
}
