export const collectIterable = async <T>(
  iterable: Iterable<T> | AsyncIterable<T>
): Promise<T[]> => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};
