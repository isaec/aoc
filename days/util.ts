export const collectIterable = async <T>(
  iterable: Iterable<T> | AsyncIterable<T>
): Promise<T[]> => {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
};

/**
 * automatically find the input.txt file at the same level as the current deno file
 */
export const readInput = async (
  rel: string
): Promise<{
  text: string;
  lines: string[];
}> => {
  const url = new URL("./input.txt", rel);
  const file = await Deno.readTextFile(url);
  return {
    text: file,
    lines: file.split("\n"),
  };
};
