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
    console.log();
    for (let y = 0; y < 10; y++) {
      let line = `${y} `;
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

  for (const line of lines) {
    console.log("\n", line);
    const points = line.split(" -> ").map((p) => p.split(",").map(Number)) as [
      [number, number]
    ];

    let lastPoint = points[0];

    writeWall(...lastPoint);

    for (const point of points.slice(1)) {
      const [x1, y1] = lastPoint;
      const [x2, y2] = point;

      if (x1 === x2) {
        if (y1 < y2)
          for (let y = y1; y <= y2; y++) {
            writeWall(x1, y);
          }
        else
          for (let y = y1; y >= y2; y--) {
            writeWall(x1, y);
          }
      } else if (y1 === y2) {
        if (x1 < x2)
          for (let x = x1; x <= x2; x++) {
            writeWall(x, y1);
          }
        else
          for (let x = x1; x >= x2; x--) {
            writeWall(x, y1);
          }
      } else {
        throw new Error("Invalid point");
      }

      lastPoint = point;
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
