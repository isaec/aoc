export const collectIterable = async <T>(
  iterable: Iterable<T> | AsyncIterable<T>
): Promise<T[]> => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};

export const mapIterable = <T, U>(
  iterable: Iterable<T>,
  mapFn: (item: T, index: number) => U
): Iterable<U> => ({
  [Symbol.iterator]: () => {
    let index = 0;
    const iterator = iterable[Symbol.iterator]();
    return {
      next: () => {
        const next = iterator.next();
        if (next.done) return next;
        return { done: false, value: mapFn(next.value, index++) };
      },
    };
  },
});
