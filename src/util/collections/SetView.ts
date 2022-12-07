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

export