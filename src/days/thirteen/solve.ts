// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

/* the example input

*/

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: Determine which pairs of packets are already in the right order. What is the sum of the indices of those pairs?

  // pairs of 2 with one line in between

  type Packet = Array<number | Packet>;

  type Pair = {
    left: Packet;
    right: Packet;
  };

  const pairs: Pair[] = [];

  for (let i = 0; i < lines.length; i += 3) {
    // console.log(lines[i], lines[i + 1]);
    pairs.push({
      left: JSON.parse(lines[i]),
      right: JSON.parse(lines[i + 1]),
    });
  }

  const orderedPairs: Pair[] = [];

  const asArray = (value: number | Packet): Packet => {
    if (typeof value === "number") {
      return [value];
    } else {
      return value;
    }
  };

  type OrderResult = "ordered" | "unordered" | "equal";

  const isOrdered = (pair: Pair, recursive = false): OrderResult => {
    for (let i = 0; i < pair.left.length; i++) {
      if (pair.right[i] === undefined) {
        console.log("\tright ran out of items first");
        return "unordered";
      }
      if (
        typeof pair.left[i] === "number" &&
        typeof pair.right[i] === "number"
      ) {
        if (pair.left[i] > pair.right[i]) {
          console.log(
            "\tleft is greater than right",
            pair.left[i],
            pair.right[i]
          );
          return "unordered";
        } else if (pair.left[i] == pair.right[i]) continue;
        else if (pair.left[i] < pair.right[i]) {
          return "ordered";
        } else {
          throw new Error("unreachable"); // ?
        }
      } else {
        console.log("\tsub-pair", pair.left[i], pair.right[i]);
        const order = isOrdered(
          {
            left: asArray(pair.left[i]),
            right: asArray(pair.right[i]),
          },
          true
        );
        if (order === "ordered") {
          return "ordered";
        }
        if (order === "unordered") {
          console.log("\tsub-pair is unordered");
          return "unordered";
        }
        console.log("\tsub-pair is equal");
      }
    }
    if (!recursive) {
      console.log("\tordered at base level");
      return "ordered";
    }

    if (pair.left.length === pair.right.length) {
      console.log("\tnested equality is equal");
      return "equal";
    }

    console.log("\tnested equality is ordered (left ran out of items first)");
    return "ordered";
  };

  let indicesSum = 0;

  // determine which pairs are already in the right order
  for (const [i, pair] of pairs.entries()) {
    /*
    If both values are integers, the lower integer should come first. If the left integer is lower than the right integer, the inputs are in the right order. If the left integer is higher than the right integer, the inputs are not in the right order. Otherwise, the inputs are the same integer; continue checking the next part of the input.
    If both values are lists, compare the first value of each list, then the second value, and so on. If the left list runs out of items first, the inputs are in the right order. If the right list runs out of items first, the inputs are not in the right order. If the lists are the same length and no comparison makes a decision about the order, continue checking the next part of the input.
    If exactly one value is an integer, convert the integer to a list which contains that integer as its only value, then retry the comparison. For example, if comparing [0,0,0] and 2, convert the right value to [2] (a list containing 2); the result is then found by instead comparing [0,0,0] and [2].
    */
    console.log("pair", i + 1);

    if (isOrdered(pair) === "ordered") {
      orderedPairs.push(pair);
      indicesSum += i + 1;
      console.log("\tordered pair");
    }
  }

  console.log(orderedPairs);

  return indicesSum;
});

await ex.testPart1([
  ex.c`
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`(13)(true),

  ex.c`
input
`()(false),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // goal:
});

await ex.testPart2([
  ex.c`
input
`()(false),

  ex.c`
input
`()(false),
]);
