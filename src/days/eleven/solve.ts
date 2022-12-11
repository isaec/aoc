// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

/* the example input
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
*/

const ex = new Executor(import.meta.url);

type Monkey = {
  id: number;
  items: number[];
  operation: (old: number) => number;
  test: (worryLevel: number) => boolean;
  ifTrueTarget: number;
  ifFalseTarget: number;
};

const operationParser = (operation: string): ((old: number) => number) => {
  const [_left, right] = operation.split(" = ");
  const [_, mathOp, value] = right.split(" ");

  const numValue =
    value === "old" ? (old: number) => old : (_old: number) => Number(value);
  switch (mathOp) {
    case "*":
      return (old: number) => old * numValue(old);
    case "+":
      return (old: number) => old + numValue(old);
    case "-":
      return (old: number) => old - numValue(old);
    case "/":
      return (old: number) => old / numValue(old);
    default:
      throw new Error(`Unknown math operation: ${mathOp}`);
  }
};

const testParser = (test: string): ((worryLevel: number) => boolean) => {
  // always divisible by, so we can just check if the number is divisible by the number
  const words = test.split(" ");
  const numValue = Number(words[2]);
  // console.log({ test, numValue });
  return (worryLevel: number) => worryLevel % numValue === 0;
};

const monkeyParser = (input: string): Monkey => {
  const lines = input.split("\n");
  const id = Number(lines[0].split(" ")[1].slice(0, -1));
  const items = lines[1].split(": ")[1].split(", ").map(Number) ?? [];
  const operation = lines[2].split(": ")[1];
  const test = lines[3].split(": ")[1];
  const ifTrueTarget = Number(lines[4].split(": ")[1].split(" ")[3]);
  const ifFalseTarget = Number(lines[5].split(": ")[1].split(" ")[3]);

  return {
    id,
    items,
    operation: operationParser(operation),
    test: testParser(test),
    ifTrueTarget,
    ifFalseTarget,
  };
};

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  /**
  Chasing all of the monkeys at once is impossible; you're going to have
  to focus on the two most active monkeys if you want any hope of getting
  your stuff back. Count the total number of times each monkey inspects
  items over 20 rounds:

  Monkey 0 inspected items 101 times.
  Monkey 1 inspected items 95 times.
  Monkey 2 inspected items 7 times.
  Monkey 3 inspected items 105 times.
  In this example, the two most active monkeys inspected items 101 and 105 times.
  The level of monkey business in this situation can be found by multiplying these together: 10605.

  Figure out which monkeys to chase by counting how many items they inspect over 20 rounds.
  What is the level of monkey business after 20 rounds of stuff-slinging simian shenanigans?
  */

  const monkeyStrings = text.split("\n\n");
  const monkeys = monkeyStrings.map(monkeyParser);

  const totalRounds = 20;

  const monkeyInspections = monkeys.map(() => 0);

  for (let r = 1; r <= totalRounds; r++) {
    for (const monkey of monkeys) {
      // monkey inspect all of its items, one at a time
      while (monkey.items.length > 0) {
        tick();
        console.log(`Monkey ${monkey.id} inspecting item ${monkey.items[0]}`);
        monkeyInspections[monkey.id] += 1;

        const itemWorryLevel = monkey.items.shift();
        if (itemWorryLevel === undefined) throw new Error("No item to inspect");

        const newItem = monkey.operation(itemWorryLevel);

        console.log(`Item ${itemWorryLevel} becomes ${newItem}`);

        if (monkey.test(newItem)) {
          console.log(
            `Item ${newItem} is true, throwing to monkey ${monkey.ifTrueTarget}`
          );
          monkeys[monkey.ifTrueTarget].items.push(newItem);
        } else {
          console.log(
            `Item ${newItem} is false, throwing to monkey ${monkey.ifFalseTarget}`
          );
          monkeys[monkey.ifFalseTarget].items.push(newItem);
        }
      }
      console.log(`Monkey ${monkey.id} has no more items to inspect\n`);
    }
    console.log(`Round ${r} complete`);
  }
  console.log(monkeyInspections);
});

await ex.testPart1([
  ex.c`
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`(),

  ex.c`
input
`(),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // goal:
});

await ex.testPart2([
  ex.c`
input
`(),

  ex.c`
input
`(),
]);