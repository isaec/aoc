// deno-lint-ignore-file require-await
import {} from "@util/set.ts";
import {} from "@util/collect.ts";
import Executor from "@util/executor.ts";

/* the example input

*/

const ex = new Executor(import.meta.url);

await ex.part1(async ({ text, lines }, console, tick) => {});

await ex.testPart1([
  ex.c`
input
`(),

  ex.c`
input
`(),
]);

await ex.part2(async ({ text, lines }, console, tick) => {});

await ex.testPart2([
  ex.c`
input
`(),

  ex.c`
input
`(),
]);
