import {
  blue,
  red,
  green,
  gray,
  dim,
  yellow,
  bold,
} from "https://deno.land/std@0.153.0/fmt/colors.ts";

type Input = Readonly<{
  text: string;
  lines: readonly string[];
}>;

type Ctx = Readonly<{
  log: typeof console.log;
}>;

type TestCaseData = [string, string | number | undefined];
type LabeledTestCase = [string, TestCaseData];

const isLabeledTestCase = (
  testCase: TestCaseData | LabeledTestCase
): testCase is LabeledTestCase => {
  return testCase.length === 2 && Array.isArray(testCase[1]);
};

const readInput = async (rel: string): Promise<Input> => {
  const url = new URL("./input.txt", rel);
  const file = await Deno.readTextFile(url);
  return {
    text: file,
    lines: file.split("\n"),
  };
};

const barLog = (
  str: string,
  color: (arg0: string) => string,
  newline?: boolean
) =>
  console.log(
    color(
      `${newline ? "\n" : ""}==== ${str} ${"=".repeat(
        Deno.consoleSize().columns - (str.length + 6)
      )}`
    )
  );

const formatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
});
const formatMs = (ms: number) => formatter.format(ms);

const setClipboard = async (str: string) => {
  const p = Deno.run({
    cmd: ["xclip", "-selection", "clipboard"],
    stdin: "piped",
  });
  await p.stdin.write(new TextEncoder().encode(str));
  p.stdin.close();
  await p.status();

  console.log(`\nCopied to clipboard: ${str}\n`);
};

const printAsType = (v: string | number | undefined | void) => {
  if (v === undefined) return "undefined";
  if (typeof v === "string") return `"${v}"`;
  return yellow(v.toString());
};

export default class Executor {
  private readonly path: string;
  private shouldAbort = false;
  private result: { answer: string | number; label: string } | undefined;

  private readonly input;

  private functionMap = new Map<
    string,
    Parameters<typeof Executor.prototype.part>[1]
  >();

  constructor(path: string) {
    this.path = path;
    this.input = readInput(path);
  }

  private async applyClipboard() {
    if (this.result !== undefined)
      await setClipboard(this.result.answer.toString());
  }

  private async part(
    label: string,
    fn: (input: Input, ctx: Ctx) => Promise<void | undefined | number | string>
  ) {
    this.functionMap.set(label, fn);
    if (this.shouldAbort) return;
    barLog(`${label} execution`, blue, true);
    const input = await this.input;
    const start = performance.now();
    try {
      const answer = await fn(input, {
        // noop
        log: () => {},
      });
      if (answer !== undefined) {
        this.result = { answer, label };
        console.log(bold("answer:"), answer);
        barLog(
          `${label} execution took ${formatMs(performance.now() - start)}`,
          green
        );
      } else {
        this.shouldAbort = true;
        barLog("no value returned, aborting further execution", blue);
      }
    } catch (e) {
      barLog(
        `${label} failed, execution took ${formatMs(
          performance.now() - start
        )}, aborting further execution`,
        red,
        true
      );
      console.error(e);
      this.shouldAbort = true;
    }
  }

  private async test(
    /** existing label */
    label: string,
    /** test data with results */
    tests: Array<[string, TestCaseData] | TestCaseData>
  ) {
    const fn = this.functionMap.get(label);
    if (!fn) throw new Error(`no function found for label ${label}`);
    let didDrawLine = false;
    const tryDrawLine = () => {
      if (!didDrawLine) {
        barLog(`${label} tests`, blue, true);
        didDrawLine = true;
      }
    };

    let failed = 0;
    for (const [i, test] of tests.entries()) {
      const [testLabel, [input, expected]]: LabeledTestCase =
        !isLabeledTestCase(test) ? [`example ${i + 1}`, test] : test;

      if (
        (testLabel === "description" || !isLabeledTestCase(test)) &&
        input === "input" &&
        expected === "expected"
      )
        continue;

      const expandedInput =
        input === "input.txt" ? (await this.input).text : input;
      tryDrawLine();
      try {
        let putHeader = false;
        const tryPutHeader = () => {
          if (!putHeader) {
            console.log(dim(`\n  ┌─${"─".repeat(testLabel.length)}`));
            putHeader = true;
          }
        };
        const answer = await fn(
          {
            text: expandedInput,
            lines: expandedInput.split("\n"),
          },
          {
            // not noop because we are in a test
            log: (...args) => {
              tryPutHeader();
              console.log(dim("  │"), ...args);
            },
          }
        );
        if (answer === expected) {
          console.log(gray(`[${green("✔")}] ${testLabel}`));
        } else if (answer == expected) {
          console.log(
            gray(
              `[${green("?")}] ${testLabel} ${dim(
                `${printAsType(answer)} == ${printAsType(expected)}`
              )}`
            )
          );
        } else {
          console.log(gray(`[${red("✗")}] ${red(testLabel)}`));
          console.log(`${dim(green("expected:"))} ${expected}`);
          console.log(`${red("received:")} ${answer}\n`);
          failed++;
        }
      } catch (e) {
        console.log(gray(`[${red("✗")}] ${red(testLabel)}`));
        console.error(e, "\n");
        failed++;
      }
    }
    if (didDrawLine)
      barLog(
        `${label} tests complete, ${
          failed === 0 ? "all passed" : `${failed}/${tests.length} failed`
        }`,
        failed === 0 ? green : red
      );
    // don't use this value if the test fails
    if (failed > 0 && this.result?.label === label) this.result = undefined;
  }

  /**
   * use this for a test case
   * input template literal to remove the first and last line if it's empty
   * @returns a function that takes the expected result, and returns {@link TestCaseData}
   */
  public c(
    strings: readonly string[],
    ...values: unknown[]
  ): (expected: TestCaseData[1]) => TestCaseData {
    const inputString = String.raw({ raw: strings }, ...values)
      .replace(/^\s*\n/, "")
      .replace(/\n\s*$/, "");
    return (expected: TestCaseData[1]) => [inputString, expected];
  }

  public async part1(fn: Parameters<typeof Executor.prototype.part>[1]) {
    await this.part("part 1", fn);
  }

  public async testPart1(tests: Parameters<typeof Executor.prototype.test>[1]) {
    await this.test("part 1", tests);
  }

  public async part2(fn: Parameters<typeof Executor.prototype.part>[1]) {
    await this.part("part 2", fn);
    await this.applyClipboard();
  }

  public async testPart2(tests: Parameters<typeof Executor.prototype.test>[1]) {
    await this.test("part 2", tests);
  }
}
