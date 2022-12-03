// deno-lint-ignore-file require-await
import Executor from "../executor.ts";

const executor = new Executor(import.meta.url);

const priorityStr = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const getPriority = (c: string) => priorityStr.indexOf(c) + 1;

await executor.part1(async ({ text, lines }) => {
  let sum = 0;

  for (const line of lines) {
    // split line in half by length
    // line has no spaces
    const half = line.length / 2;
    const firstHalf = line.slice(0, half);
    const secondHalf = line.slice(half);

    // find the item in both halves
    const item = firstHalf.split("").find((c) => secondHalf.includes(c));
    if (item === undefined) throw Error("no item found");

    // add to sum
    sum += getPriority(item);
  }

  return sum;
});

await executor.testPart1([
  [`vJrwpWtwJgWrhcsFMMfFFhFp`, 16],
  [`jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL`, 38],
]);

await executor.part2(async ({ text, lines }) => {
  let sum = 0;

  // take the lines in chunks of 3
  for (let i = 0; i < lines.length; i += 3) {
    const first = lines[i];
    const second = lines[i + 1];
    const third = lines[i + 2];

    // find the item in all three
    const item = first
      .split("")
      .find((c) => second.includes(c) && third.includes(c));
    if (item === undefined) throw Error("no item found");

    // add to sum
    sum += getPriority(item);
  }
  return sum;
});

await executor.testPart2([
  [
    "example 1",
    [
      `vJrwpWtwJgWrhcsFMMfFFhFp
jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
PmmdzqPrVvPwwTWBwg`,
      18,
    ],
  ],
]);
