import {
  blue,
  red,
  green,
  gray,
  dim,
} from "https://deno.land/std@0.153.0/fmt/colors.ts";
import { readInput } from "./util.ts";

type Input = {
  text: string;
  lines: string[];
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

export default class Executor {
  private readonly path: string;
  private shouldAbort = false;
  private result: string | number | undefined;

  private functionMap = new Map<
    string,
    Parameters<typeof Executor.prototype.part>[1]
  >();

  constructor(path: string) {
    this.path = path;
  }

  private async applyClipboard() {
    if (this.result) await setClipboard(this.result.toString());
  }

  private async part(
    label: string,
    fn: (input: Input) => Promise<void | undefined | number | string>
  ) {
    this.functionMap.set(label, fn);
    if (this.shouldAbort) return;
    barLog(`${label} execution`, blue, true);
    const input = await readInput(this.path);
    const start = performance.now();
    try {
      const answer = await fn(input);
      if (answer !== undefined) {
        this.result = answer;
        console.log("answer", answer);
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
    tests: [string, [string, string | number | undefined]][]
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
    for (const [testLabel, [input, expected]] of tests) {
      if (
        testLabel === "description" &&
        input === "input" &&
        expected === "expected"
      )
        continue;
      tryDrawLine();
      const answer = await fn({ text: input, lines: input.split("\n") });
      if (answer === expected) {
        console.log(gray(`[${green("✔")}] ${testLabel}`));
      } else {
        console.log(gray(`[${red("✗")}] ${red(testLabel)}`));
        console.log(`${dim(green("expected:"))} ${expected}`);
        console.log(`${red("received:")} ${answer}\n`);
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
