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

  const sandGrid: boolean[][] = [];

  const inertSandGrid: boolean[][] = [];

  const setGrid = (grid: boolean[][], x: number, y: number) => {
    if (!grid[x]) grid[x] = [];
    grid[x][y] = true;
  };

  const makeSand = (x: number, y: number) => {
    if (!sandGrid[x]) sandGrid[x] = [];
    sandGrid[x][y] = true;
  };

  const moveSand = (fromX: number, fromY: number, toX: number, toY: number) => {
    if (!sandGrid[toX]) sandGrid[toX] = [];
    sandGrid[toX][toY] = true;
    sandGrid[fromX][fromY] = false;
  };

  const writeWall = (x: number, y: number) => {
    if (!wallGrid[x]) wallGrid[x] = [];
    wallGrid[x][y] = true;
  };

  const gridHas = (grid: boolean[][], x: number, y: number) =>
    grid[x] && grid[x][y];

  let calls = 0;
  const gridPrinter = () => {
    console.log("\n", calls++);
    for (let y = 0; y < 10; y++) {
      let line = `${y} `;
      for (let x = 490; x < 510; x++) {
        // console.log(x, y);
        if (sandGrid[x] && sandGrid[x][y]) line += "o";
        else if (inertSandGrid[x] && inertSandGrid[x][y]) line += "O";
        else if (x === 500 && y === 0) line += "+";
        else if (wallGrid[x] && wallGrid[x][y]) line += "#";
        else line += ".";
      }
      console.log(line);
    }
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

  gridPrinter();

  // simulate the falling sand
  let restingSandCount = 0;

  let done = false;

  while (!done) {
    let sandPos: [number, number] = [500, 0];
    makeSand(...sandPos);

    while (true) {
      tick();

      const [x, y] = sandPos;
      if (gridHas(wallGrid, x, y + 1)) {
        // sand is resting
        setGrid(inertSandGrid, x, y);
        sandGrid[x][y] = false;
        restingSandCount++;
        break;
      }

      if (gridHas(inertSandGrid, x, y + 1)) {
        // sand must shift
        if (
          !gridHas(wallGrid, x - 1, y + 1) &&
          !gridHas(inertSandGrid, x - 1, y + 1)
        ) {
          moveSand(x, y, x - 1, y + 1);
          sandPos = [x - 1, y + 1];
          // gridPrinter();
          continue;
        } else if (
          !gridHas(wallGrid, x + 1, y + 1) &&
          !gridHas(inertSandGrid, x + 1, y + 1)
        ) {
          moveSand(x, y, x + 1, y + 1);
          sandPos = [x + 1, y + 1];
          // gridPrinter();
          continue;
        } else {
          // sand is resting
          setGrid(inertSandGrid, x, y);
          sandGrid[x][y] = false;
          restingSandCount++;
          break;
        }
      }

      moveSand(x, y, x, y + 1);
      sandPos = [x, y + 1];
      if (y > 100) {
        done = true;
        break;
      }
    }
    gridPrinter();
  }

  gridPrinter();

  return inertSandGrid.reduce((acc, row) => {
    if (!row) return acc;
    return acc + row.reduce((acc, col) => acc + (col ? 1 : 0), 0);
  }, 0);
});

await ex.testPart1([
  ex.c`
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`(24)(true),

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
