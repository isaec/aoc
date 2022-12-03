// deno-lint-ignore-file require-await
import Executor from "../executor.ts";

const ex = new Executor(import.meta.url);

await ex.part1(async ({ text, lines }) => {});

await ex.testPart1([
  ["description", [`input`, "expected"]],
  ["description", [`input`, "expected"]],
]);

await ex.part2(async ({ text, lines }) => {});

await ex.testPart2([
  ["description", [`input`, "expected"]],
  ["description", [`input`, "expected"]],
]);
