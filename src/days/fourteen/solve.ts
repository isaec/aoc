// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

/* the example input
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
*/

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: Using your scan, simulate the falling sand. How many units of sand come to rest before sand starts flowing into the abyss below?

  // build the wall grid
  const wallGrid: boolean[][] = [];

  const gridPrinter = (grid: boolean[][]) => {
    for (let y = 0; y < 10; y++) {
      let line = "";
      for (let x = 490; x < 510; x++) {
        line += grid[x] && grid[x][y] ? "#" : ".";
      }
      console.log(line);
    }
  };

  const writeWall = (x: number, y: number) => {
    if (!wallGrid[x]) wallGrid[x] = [];
    wallGrid[x][y] = true;
  };

  writeWall(500, 0);
  writeWall(501, 0);
  writeWall(499, 0);
  writeWall(500, 1);
  writeWall(501, 1);
  writeWall(499, 1);
  writeWall(500, 5);

  gridPrinter(wallGrid);

  return;

  for (const line of lines) {
    const points = line.split(" -> ").map((p) => p.split(",").map(Number)) as [
      [number, number]
    ];

    let lastPoint = points[0];

    for (const [x, y] of points) {
      for (let i = lastPoint[0]; i <= x; i++) {
        for (let j = lastPoint[1]; j <= y; j++) {
          writeWall(i, j);
        }
      }
      lastPoint = [x, y];
    }
  }

  gridPrinter(wallGrid);
});

await ex.testPart1([
  ex.c`
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`()(true),

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
