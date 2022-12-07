import { SetView } from "./SetView.ts";

export class BiMap<K, V> {
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
