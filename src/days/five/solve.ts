// deno-lint-ignore-file require-await
import {} from "@util/set.ts";
import {} from "@util/collect.ts";
import Executor from "@util/executor.ts";

const ex = new Executor(import.meta.url);

/**
input.txt

    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
 */

const splitter = / (?:   )|(?= \[) /gm;

// After the rearrangement procedure completes, what crate ends up on top of each stack?
await ex.part1(async ({ text, lines }, ctx) => {
  // make all 9 stacks
  const stackCollection: readonly string[][] = [
    [], // 1
    [], // 2
    [], // 3
    [], // 4
    [], // 5
    [], // 6
    [], // 7
    [], // 8
    [], // 9
  ];
  // go through each line and add the crate to the bottom of the stack
  for (const line of lines) {
    // end of crates
    if (line.charAt(1) === "1") break;
    line.split(splitter).forEach((crate, index) => {
      // ctx.log({ crate, index });
      if (crate.charAt(0) !== "[") return;
      const name = crate.charAt(1);
      // put the crate on the bottom of the stack, position 0
      stackCollection[index].unshift(name);
    });
  }
  // ctx.log(stackCollection);

  // do the rearrangement procedure
  for (const line of lines) {
    // ignore lines that are not rearrangement instructions
    if (line.charAt(0) !== "m") continue;
    ctx.log(line);
    // do the rearrangement
    const [_, amount, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/)!;
    const amountInt = parseInt(amount);
    const fromInt = parseInt(from);
    const toInt = parseInt(to);

    for (let i = 0; i < amountInt; i++) {
      const crate = stackCollection[fromInt - 1].pop()!;
      stackCollection[toInt - 1].push(crate);
    }
  }

  // return the top crate of each stack
  return stackCollection.map((stack) => stack[stack.length - 1]).join("");
});

await ex.testPart1([
  ex.c`

    [D]    
[N] [C]     [Y]
[Z] [M] [P] [A] [B]
 1   2   3   4   5

move 1 from 2 to 1
`("DCPYB"),
]);

await ex.part2(async ({ text, lines }, ctx) => {
  // make all 9 stacks
  const stackCollection: readonly string[][] = [
    [], // 1
    [], // 2
    [], // 3
    [], // 4
    [], // 5
    [], // 6
    [], // 7
    [], // 8
    [], // 9
  ];
  // go through each line and add the crate to the bottom of the stack
  for (const line of lines) {
    // end of crates
    if (line.charAt(1) === "1") break;
    line.split(splitter).forEach((crate, index) => {
      // ctx.log({ crate, index });
      if (crate.charAt(0) !== "[") return;
      const name = crate.charAt(1);
      // put the crate on the bottom of the stack, position 0
      stackCollection[index].unshift(name);
    });
  }
  // ctx.log(stackCollection);

  // do the rearrangement procedure
  for (const line of lines) {
    // ignore lines that are not rearrangement instructions
    if (line.charAt(0) !== "m") continue;
    // ctx.log(line);
    // do the rearrangement
    const [_, amount, from, to] = line.match(/move (\d+) from (\d+) to (\d+)/)!;
    const amountInt = parseInt(amount);
    const fromInt = parseInt(from);
    const toInt = parseInt(to);

    const removedCrates = [];
    for (let i = 0; i < amountInt; i++) {
      const crate = stackCollection[fromInt - 1].pop()!;
      removedCrates.unshift(crate);
    }

    ctx.log({
      line,
      removedCrates,
    });

    // put the removed crates onto the top of the new stack
    for (let i = 0; i < amountInt; i++) {
      stackCollection[toInt - 1].push(removedCrates.shift()!);
    }
  }

  // return the top crate of each stack
  return stackCollection.map((stack) => stack[stack.length - 1]).join("");
});

await ex.testPart2([
  ex.c`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2
`("MCD"),

  ex.c`
    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
`("CD"),

  ex.c`
    [D]    
[N] [C]    
[Z] [M]
[X] [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 4 from 1 to 2
`("ZNP"),
]);
