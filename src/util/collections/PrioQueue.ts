// typescript ripoff of https://github.com/mourner/flatqueue with TypedArray

export class RawPrioQueue<I extends number, V extends number> {
  private ids: Uint16Array;
  private values: Uint32Array;
  private length: number;

  readonly maxSize: number;

  constructor(size = 10_000) {
    this.maxSize = size;
    this.ids = new Uint16Array(size);
    this.values = new Uint32Array(size);
    this.length = 0;
  }

  get size() {
    return this.length;
  }

  clear() {
    this.length = 0;
  }

  push(id: I, value: V) {
    let pos = this.length++;

    while (pos > 0) {
      const parent = (pos - 1) >> 1;
      const parentValue = this.values[parent];
      if (value >= parentValue) break;
      this.ids[pos] = this.ids[parent];
      this.values[pos] = parentValue;
      pos = parent;
    }

    this.ids[pos] = id;
    this.values[pos] = value;
  }

  pop(): I | undefined {
    if (this.length === 0) return undefined;

    const top = this.ids[0];
    this.length--;

    if (this.length > 0) {
      const id = (this.ids[0] = this.ids[this.length]);
      const value = (this.values[0] = this.values[this.length]);
      const halfLength = this.length >> 1;
      let pos = 0;

      while (pos < halfLength) {
        let left = (pos << 1) + 1;
        const right = left + 1;
        let bestIndex = this.ids[left];
        let bestValue = this.values[left];
        const rightValue = this.values[right];

        if (right < this.length && rightValue < bestValue) {
          left = right;
          bestIndex = this.ids[right];
          bestValue = rightValue;
        }
        if (bestValue >= value) break;

        this.ids[pos] = bestIndex;
        this.values[pos] = bestValue;
        pos = left;
      }

      this.ids[pos] = id;
      this.values[pos] = value;
    }

    return top as I;
  }

  peek(): I | undefined {
    if (this.length === 0) return undefined;
    return this.ids[0] as I;
  }

  peekValue(): V | undefined {
    if (this.length === 0) return undefined;
    return this.values[0] as V;
  }
}
