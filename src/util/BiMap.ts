/**
 * Concrete implementation of ReadonlySet that wraps around a Set.
 *
 * For a small performance penalty, this extends ReadonlySet assurance to runtime.
 */
export class SetView<T> implements ReadonlySet<T> {
  private readonly set: Set<T>;

  constructor(set: Set<T>) {
    this.set = set;
  }

  get size(): number {
    return this.set.size;
  }

  has(value: T): boolean {
    return this.set.has(value);
  }

  entries(): IterableIterator<[T, T]> {
    return this.set.entries();
  }

  keys(): IterableIterator<T> {
    return this.set.keys();
  }

  values(): IterableIterator<T> {
    return this.set.values();
  }

  forEach(...args: Parameters<Set<T>["forEach"]>) {
    this.set.forEach(...args);
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.set[Symbol.iterator]();
  }
}

export default class BiMap<K, V> {
  private readonly kvMap: Map<K, Set<V>>;
  private readonly vkMap: Map<V, Set<K>>;

  constructor() {
    this.kvMap = new Map();
    this.vkMap = new Map();
  }

  private static ensureSet<K, V>(map: Map<K, Set<V>>, key: K): Set<V> {
    const set = map.get(key);
    if (set !== undefined) return set;

    const newSet = new Set<V>();
    map.set(key, newSet);

    return newSet;
  }

  private static getSetView<K, V>(map: Map<K, Set<V>>, key: K): ReadonlySet<V> {
    return new SetView(BiMap.ensureSet(map, key));
  }

  add(key: K, value: V) {
    BiMap.ensureSet(this.kvMap, key).add(value);
    BiMap.ensureSet(this.vkMap, value).add(key);
  }

  remove(key: K, value: V): boolean {
    return (
      BiMap.ensureSet(this.kvMap, key).delete(value) &&
      BiMap.ensureSet(this.vkMap, value).delete(key)
    );
  }

  hasKey(key: K): boolean {
    return this.kvMap.has(key);
  }

  hasValue(value: V): boolean {
    return this.vkMap.has(value);
  }

  getKeys(value: V): ReadonlySet<K> {
    return BiMap.getSetView(this.vkMap, value);
  }

  getValues(key: K): ReadonlySet<V> {
    return BiMap.getSetView(this.kvMap, key);
  }
}
