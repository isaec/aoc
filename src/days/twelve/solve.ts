// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";
import { Graph } from "@util/collections/Graph.ts";

// the elevation of each square of the grid is given by a single lowercase letter,
// where a is the lowest elevation, b is the next-lowest, and so on
// up to the highest elevation, z.

// current position is S, elevation is a
// target is E, elevation z

// the elevation of the destination square can be at most one higher than the elevation of your current square

const letters = "abcdefghijklmnopqrstuvwxyz";
const getElevation = (letter: string) =>
  letter === "S"
    ? letters.indexOf("a")
    : letter === "E"
    ? letters.indexOf("z")
    : letters.indexOf(letter);

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: What is the fewest steps required to move from your current position to the location that should get the best signal?
  const grid = lines.map((line) => line.split(""));

  const [startX, startY] = grid
    .flatMap((row, y) => row.map((col, x) => [x, y, col]))
    .find(([x, y, col]) => col === "S")!;
  const [endX, endY] = grid
    .flatMap((row, y) => row.map((col, x) => [x, y, col]))
    .find(([x, y, col]) => col === "E")!;

  const graph = new Graph<string>();

  grid.forEach((row, y) => {
    row.forEach((col, x) => {
      graph.addNode(col);
      // iterate over all neighbors
      // if the elevation is <= 1, add an edge

      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          if (xOffset === 0 && yOffset === 0) continue;
          if (
            x + xOffset < 0 ||
            y + yOffset < 0 ||
            x + xOffset >= row.length ||
            y + yOffset >= grid.length
          )
            continue;

          const neighbor = grid[y + yOffset][x + xOffset];

          if (Math.abs(getElevation(col) - getElevation(neighbor)) <= 1) {
            graph.addEdge(col, neighbor);
          } else if (getElevation(col) >= getElevation(neighbor)) {
            graph.addEdge(col, neighbor);
          }
        }
      }
    });
  });

  // find the shortest path from S to E
  const path = graph.shortestPath("S", "E");
  console.log(path);
});

await ex.testPart1([
  ex.c`
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
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
