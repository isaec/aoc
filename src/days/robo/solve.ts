// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  console.log("e");
  return 1;
});

await ex.testPart1([
  ex.c`
input
`()(false),
]);
