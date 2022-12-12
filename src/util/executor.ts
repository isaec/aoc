import {
  blue,
  red,
  green,
  gray,
  dim,
  yellow,
  bold,
  magenta,
} from "https://deno.land/std@0.153.0/fmt/colors.ts";

type Input = Readonly<{
  text: string;
  lines: readonly string[];
}>;

type TestConsole = Readonly<{
  log: typeof console.log;
}>;

type TestCaseData = [string, string | number | undefined] | false;
type NonSkipTestData = Exclude<TestCaseData, false>;
type LabeledTestCase = [string, NonSkipTestData];
type ToggleTestCase = (run: boolean) => TestCaseData | LabeledTestCase;

const extractTestCase = (
  testCase: TestCaseData | LabeledTestCase | ToggleTestCase
): TestCaseData | LabeledTestCase =>
  typeof testCase === "function" ? testCase(true) : testCase;

const isLabeledTestCase = (
  testCase: TestCaseData | LabeledTestCase | ToggleTestCase
): testCase is LabeledTestCase => {
  return (
    Array.isArray(testCase) &&
    testCase.length === 2 &&
    Array.isArray(testCase[1])
  );
};

const extractLabeledTestCase = (
  testInput: TestCaseData | LabeledTestCase | ToggleTestCase,
  iteration: number
): LabeledTestCase | false => {
  const testCase = extractTestCase(testInput);
  if (testCase === false) return false;
  const [testLabel, [input, expected]] = (
    !isLabeledTestCase(testCase)
      ? [`example ${iteration + 1}`, testCase]
      : testCase
  ) as LabeledTestCase;

  if (
    (testLabel === "description" || !isLabeledTestCase(testInput)) &&
    input === "input" &&
    (expected === "expected" || expected === undefined)
  )
    return false;

  return [testLabel, [input, expected]];
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

const msFormatter = new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "millisecond",
  unitDisplay: "narrow",
});
const formatMs = (ms: number) => msFormatter.format(ms);

const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (n: number) => numberFormatter.format(n);

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

class LoopBreaker {
  readonly max: number;
  private ticks = 0;

  constructor(max: number = 500_000) {
    this.max = max;
  }

  tick() {
    if (this.ticks++ > this.max) {
      throw new Error(
        `Loop exceeded ${bold(magenta(formatNumber(this.max)))} ticks`
      );
    }
  }

  getTickFunction() {
    return this.tick.bind(this);
  }

  getTicks() {
    return this.ticks;
  }

  tripped() {
    return this.ticks > this.max;
  }
}

type PartFunction = (
  input: Input,
  console: TestConsole,
  loopTick: LoopBreaker["tick"]
) => Promise<void | undefined | number | string>;

export default class Executor {
  private readonly path: string;
  private shouldAbort = false;
  private result: { answer: string | number; label: string } | undefined;

  private readonly input;

  private functionMap = new Map<string, PartFunction>();

  constructor(path: string) {
    this.path = path;
    this.input = readInput(path);
  }

  private async applyClipboard() {
    if (this.result !== undefined)
      await setClipboard(this.result.answer.toString());
  }

  private async storePart(label: string, fn: PartFunction) {
    this.functionMap.set(label, fn);
  }

  private async runPart(label: string) {
    const fn = this.functionMap.get(label);

    if (fn === undefined) throw new Error(`No function for part ${label}`);

    if (this.shouldAbort) return;
    barLog(`${label} execution`, blue, true);
    const input = await this.input;
    const start = performance.now();
    const loopBreaker = new LoopBreaker();
    try {
      const answer = await fn(
        input,
        {
          // noop
          log: () => {},
        },
        loopBreaker.getTickFunction()
      );
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
    tests: Array<
      | LabeledTestCase
      | TestCaseData
      | ((run?: boolean) => LabeledTestCase | TestCaseData)
    >
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
    for (const [i, testInput] of tests.entries()) {
      const test = extractTestCase(testInput);
      if (test === false) continue;
      const labeledTestCase = extractLabeledTestCase(testInput, i);
      if (labeledTestCase === false) continue;
      const [testLabel, [input, expected]] = labeledTestCase;

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
        const loopBreaker = new LoopBreaker();
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
          },
          loopBreaker.getTickFunction()
        );
        switch (true) {
          case answer === expected:
            console.log(gray(`[${green("✔")}] ${testLabel}`));
            break;
          case answer == expected:
            console.log(
              gray(
                `[${green("?")}] ${testLabel} ${dim(
                  `${printAsType(answer)} == ${printAsType(expected)}`
                )}`
              )
            );
            break;
          case expected === undefined:
            console.log(gray(`[${magenta("=")}] ${testLabel}`));
            console.log(`${magenta("received:")} ${answer}\n`);
            break;
          default:
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
   * takes an input template literal to remove the first and last line if it's empty
   * makes a function that allows you to pass the expected result
   * if you don't pass the expected result, the test case will be run but not checked
   * @returns a function that takes the expected result, and returns {@link TestCaseData}
   */
  public c(
    strings: readonly string[],
    ...values: unknown[]
  ): (expected?: NonSkipTestData[1]) => (run?: boolean) => TestCaseData {
    const inputString = String.raw({ raw: strings }, ...values)
      .replace(/^\s*\n/, "")
      .replace(/\n\s*$/, "");
    return (expected) =>
      (run = true) =>
        run === true ? [inputString, expected] : false;
  }

  public async part1(fn: PartFunction) {
    await this.storePart("part 1", fn);
  }

  public async testPart1(tests: Parameters<typeof Executor.prototype.test>[1]) {
    await this.test("part 1", tests);
    await this.runPart("part 1");
  }

  public async part2(fn: PartFunction) {
    await this.storePart("part 2", fn);
  }

  public async testPart2(tests: Parameters<typeof Executor.prototype.test>[1]) {
    await this.test("part 2", tests);
    await this.runPart("part 2");
    await this.applyClipboard();
  }
}
