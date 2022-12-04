// deno-lint-ignore-file require-await
import Executor from "../executor.ts";

const ex = new Executor(import.meta.url);

await ex.part1(async ({ text, lines }) => {});

await ex.testPart1([
  [`input`, "expected"],
  [`input`, "expected"],
]);

await ex.part2(async ({ text, lines }) => {});

await ex.testPart2([
  [`input`, "expected"],
  [`input`, "expected"],
]);
