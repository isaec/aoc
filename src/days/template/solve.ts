// deno-lint-ignore-file require-await
import Executor from "../executor.ts";

const ex = new Executor(import.meta.url);

await ex.part1(async ({ text, lines }, ctx) => {});

await ex.testPart1([
  ex.c`
input
`("expected"),

  ex.c`
input
`("expected"),
]);

await ex.part2(async ({ text, lines }, ctx) => {});

await ex.testPart2([
  ex.c`
input
`("expected"),

  ex.c`
input
`("expected"),
]);
