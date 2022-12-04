export const range = (start: number, end: number, step = 1): number[] => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

export const setFromRange = (start: number, end: number, step = 1) =>
  new Set(range(start, end, step));

export const setsEqual = <T>(a: Set<T>, b: Set<T>): boolean => {
  if (a.size !== b.size) {
    return false;
  }
  for (const item of a) {
    if (!b.has(item)) {
      return false;
    }
  }
  return true;
};

export const setUnion = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  // naive
  const result = new Set(a);
  for (const item of b) {
    result.add(item);
  }
  return result;
};

export const setIntersection = <T>(a: Set<T>, b: Set<T>): Set<T> => {
  // naive
  const result = new Set<T>();
  for (const item of a) {
    if (b.has(item)) {
      result.add(item);
    }
  }
  return result;
};

export const setOverlap = <T>(a: Set<T>, b: Set<T>): boolean => {
  for (const item of a) {
    if (b.has(item)) {
      return true;
    }
  }
  return false;
};

export const isSuperset = <T>(a: Set<T>, b: Set<T>): boolean => {
  for (const item of b) {
    if (!a.has(item)) {
      return false;
    }
  }
  return true;
};
