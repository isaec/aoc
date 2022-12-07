import { SetView } from "./SetView.ts";

/**
 * A bi-directional map.
 */
export class BiMap<K, V> {
  private readonly kvMap: Map<K, V>;
  private readonly vkMap: Map<V, K>;

  constructor() {
    this.kvMap = new Map();
    this.vkMap = new Map();
  }

  add(key: K, value: V): void {
    this.kvMap.set(key, value);
    this.vkMap.set(value, key);
  }

  get(key: K): V | undefined {
    return this.kvMap.get(key);
  }

  getKey(value: V): K | undefined {
    return this.vkMap.get(value);
  }

  hasKey(key: K): boolean {
    return this.kvMap.has(key);
  }

  hasValue(value: V): boolean {
    return this.vkMap.has(value);
  }

  keys(): IterableIterator<K> {
    return this.kvMap.keys();
  }

  values(): IterableIterator<V> {
    return this.vkMap.keys();
  }

  entries(): IterableIterator<[K, V]> {
    return this.kvMap.entries();
  }

  get size(): number {
    return this.kvMap.size;
  }

  delete(key: K): boolean {
    const value = this.kvMap.get(key);
    if (value === undefined) {
      return false;
    }
    this.kvMap.delete(key);
    this.vkMap.delete(value);
    return true;
  }

  clear(): void {
    this.kvMap.clear();
    this.vkMap.clear();
  }

  get [Symbol.toStringTag](): string {
    return "BiMap";
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }
}
