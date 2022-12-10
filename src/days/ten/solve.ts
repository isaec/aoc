// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

/* the example input
noop
addx 3
addx -5
*/

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: Find the signal strength during the 20th, 60th, 100th, 140th, 180th, and 220th cycles. What is the sum of these six signal strengths?

  let xRegValue = 1;
  let cycle = 0;

  let remainingInstructionSteps = 0;

  const doInstruction = (instruction: string) => {
    if (remainingInstructionSteps > 0) {
      // console.log("waiting cycle");
      remainingInstructionSteps--;
      cycle++;
      return;
    }
    if (instruction === undefined) throw new Error("instruction is undefined");
    if (instruction === "") throw new Error("instruction is empty");
    if (instruction === "noop") {
      remainingInstructionSteps--;
      // cycle++;
      return;
    }
    if (instruction.startsWith("addx")) {
      remainingInstructionSteps--;
      const value = parseInt(instruction.split(" ")[1]);
      // console.log("adding value", value);
      xRegValue += value;
      // cycle++;
      return;
    }
  };

  const readInstruction = (instruction: string) => {
    if (instruction === undefined) throw new Error("instruction is undefined");
    if (instruction === "") throw new Error("instruction is empty");

    if (instruction === "noop") {
      remainingInstructionSteps = 1;
      return;
    }
    if (instruction.startsWith("addx ")) {
      remainingInstructionSteps = 2;
      return;
    }
  };

  const instructions = text.split("\n");

  const cycles = new Set([20, 60, 100, 140, 180, 220]);
  const trippedCycles = new Set<number>();

  let signalCycleSum = 0;

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    // console.log("instruction", i, instruction);
    readInstruction(instruction);

    // console.log({
    //   xRegValue,
    //   cycle,
    //   remainingInstructionSteps,
    //   instruction,
    // });

    // console.log("starting cycle", { xRegValue, cycle, instruction });

    while (remainingInstructionSteps >= 0) {
      // console.log("cycling", {
      //   xRegValue,
      //   cycle,
      //   remainingInstructionSteps,
      //   instruction,
      // });
      tick();
      doInstruction(instruction);
      // console.log("inter x value", xRegValue, "cycle", cycle);
      if (cycles.has(cycle) && !trippedCycles.has(cycle)) {
        signalCycleSum += xRegValue * cycle;
        trippedCycles.add(cycle);
        // console.log(
        //   "tripped cycle",
        //   cycle,
        //   "xRegValue",
        //   xRegValue,
        //   "signal strength",
        //   xRegValue * cycle,

        //   "\n"
        // );
      }
    }
    // console.log({ xRegValue, cycle, instruction });
  }

  // console.log(trippedCycles);

  return signalCycleSum;
});

await ex.testPart1(
  [
    ex.c`
noop
addx 3
addx -5
`(),

    ex.c`
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
    `(13140),

    ex.c`
input
`(),
  ].slice(0, 2)
);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // goal: Render the image given by your program. What eight capital letters appear on your CRT?

  const instructions = lines
    .map((line) => line.split(" "))
    .map(([cmd, arg]): [string, number] => [cmd, Number(arg)]);

  const xRegValues = [1];

  for (const instruction of instructions) {
    xRegValues.push(xRegValues.at(-1)!);
    if (instruction[0] === "addx") {
      xRegValues.push(xRegValues.at(-1)! + instruction[1]);
    }
  }

  let display = "\n";

  for (const [i, xRegValue] of xRegValues.entries()) {
    if (xRegValue <= (i % 40) + 1 && xRegValue >= (i % 40) - 1) {
      display += "█";
    } else {
      display += " ";
    }
    if (i % 40 === 39) display += "\n";
  }

  return display;
});

await ex.testPart2(
  [
    ex.c`
addx 15
addx -11
addx 6
addx -3
addx 5
addx -1
addx -8
addx 13
addx 4
noop
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx 5
addx -1
addx -35
addx 1
addx 24
addx -19
addx 1
addx 16
addx -11
noop
noop
addx 21
addx -15
noop
noop
addx -3
addx 9
addx 1
addx -3
addx 8
addx 1
addx 5
noop
noop
noop
noop
noop
addx -36
noop
addx 1
addx 7
noop
noop
noop
addx 2
addx 6
noop
noop
noop
noop
noop
addx 1
noop
noop
addx 7
addx 1
noop
addx -13
addx 13
addx 7
noop
addx 1
addx -33
noop
noop
noop
addx 2
noop
noop
noop
addx 8
noop
addx -1
addx 2
addx 1
noop
addx 17
addx -9
addx 1
addx 1
addx -3
addx 11
noop
noop
addx 1
noop
addx 1
noop
noop
addx -13
addx -19
addx 1
addx 3
addx 26
addx -30
addx 12
addx -1
addx 3
addx 1
noop
noop
noop
addx -9
addx 18
addx 1
addx 2
noop
noop
addx 9
noop
noop
noop
addx -1
addx 2
addx -37
addx 1
addx 3
noop
addx 15
addx -21
addx 22
addx -6
addx 1
noop
addx 2
addx 1
noop
addx -10
noop
noop
addx 20
addx 1
addx 2
addx 2
addx -6
addx -11
noop
noop
noop
`(),
  ].slice(0, 1)
);
