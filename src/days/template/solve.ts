// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

const ex = new Executor(import.meta.url);

const exampleInput = ex.c`

`;

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {});

await ex.testPart1([
  exampleInput()(true),

  ex.c`
input
`()(false),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {});

await ex.testPart2([
  exampleInput()(true),

  ex.c`
input
`()(false),
]);
