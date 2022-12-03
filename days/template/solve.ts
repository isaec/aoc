// deno-lint-ignore-file require-await
import Executor from "../executor.ts";

const executor = new Executor(import.meta.url);

await executor.part1(async ({ text, lines }) => {});

await executor.testPart1([
  ["description", [`input`, "expected"]],
  ["description", [`input`, "expected"]],
]);

await executor.part2(async ({ text, lines }) => {});

await executor.testPart2([
  ["description", [`input`, "expected"]],
  ["description", [`input`, "expected"]],
]);
