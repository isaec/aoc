// deno-lint-ignore-file require-await
import Executor from "../executor.ts";

const ex = new Executor(import.meta.url);

// format: a-b,c-d ranges
// find the number of lines where one range fully encloses the other
await ex.part1(async ({ text, lines }, ctx) => {
  let count = 0;
  for (const line of lines) {
    ctx.log(line);
    const [a, b, c, d] = line.split(/-|,/).map(Number);
    if (a <= c && b >= d) count++;
    else if (c <= a && d >= b) count++;
  }
  return count;
});

await ex.testPart1([
  ex.c`
2-4,1-5
`(1),

  ex.c`
2-4,6-8
2-3,4-5
5-7,7-9
2-8,3-7
6-6,4-6
2-6,4-8
`(2),

  ex.c`
2-4,6-8
2-6,3-5
`(1),
]);

// find count of range overlap
await ex.part2(async ({ text, lines }) => {
  let countOfOverlaps = 0;
  for (const line of lines) {
    const [a, b, c, d] = line.split(/-|,/).map(Number);
    // generate sets for each range
    const setA = new Set();
    const setB = new Set();
    for (let i = a; i <= b; i++) setA.add(i);
    for (let i = c; i <= d; i++) setB.add(i);
    // determine if any values overlap, if so add one to count
    for (const val of setA) {
      if (setB.has(val)) {
        countOfOverlaps++;
        break;
      }
    }
  }
  return countOfOverlaps;
});

await ex.testPart2([
  [`1-3,3-5`, 1],
  [
    `5-7,7-9
  2-8,3-7
  6-6,4-6
  2-6,4-8`,
    4,
  ],
]);
