// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";

/* the example input
30373
25512
65332
33549
35390
*/

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // goal: how many trees are visible from outside the grid?
  const grid = lines.map((line) => line.split(""));
  const width = grid[0].length;
  const height = grid.length;

  let visibleTrees = 0;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // for each tree, walk each cardinal direction until we hit a tree or the edge of the grid
      // if we hit a tree in each direction, increment visibleTrees
      // if we hit the edge of the grid in any direction, do nothing

      const treeHeight = grid[y][x] - 1;
      let coveredAxis = 0;

      // up
      for (let i = y - 1; i >= 0; i--) {
        if (grid[i][x] > treeHeight) {
          coveredAxis++;
          break;
        }
      }

      // down
      for (let i = y + 1; i < height; i++) {
        if (grid[i][x] > treeHeight) {
          coveredAxis++;
          break;
        }
      }

      // left
      for (let i = x - 1; i >= 0; i--) {
        if (grid[y][i] > treeHeight) {
          coveredAxis++;
          break;
        }
      }

      // right
      for (let i = x + 1; i < width; i++) {
        if (grid[y][i] > treeHeight) {
          coveredAxis++;
          break;
        }
      }

      if (coveredAxis !== 4) {
        visibleTrees++;
      } else {
        console.log(
          "hidden",
          x,
          y,
          "height",
          treeHeight,
          "covered",
          coveredAxis
        );
      }
    }
  }

  return visibleTrees;
});

await ex.testPart1([
  ex.c`
30373
25512
65332
33549
35390
`(21),

  ex.c`
input
`(),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // goal: To measure the viewing distance from a given tree, look up, down, left, and right from that tree; stop if you reach an edge or at the first tree that is the same height or taller than the tree under consideration. (If a tree is right on the edge, at least one of its viewing distances will be zero.)
  const grid = lines.map((line) => line.split(""));
  const width = grid[0].length;
  const height = grid.length;

  let maxScore = 0;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const treeHeight = grid[y][x];
      let score = 0;

      // up
      let upScore = 0;
      for (let i = y - 1; i >= 0; i--) {
        upScore++;

        if (grid[i][x] >= treeHeight) break;
      }

      // down
      let downScore = 0;
      for (let i = y + 1; i < height; i++) {
        downScore++;

        if (grid[i][x] >= treeHeight) {
          break;
        }
      }

      // left
      let leftScore = 0;

      for (let i = x - 1; i >= 0; i--) {
        leftScore++;

        if (grid[y][i] >= treeHeight) {
          break;
        }
      }

      // right
      let rightScore = 0;
      for (let i = x + 1; i < width; i++) {
        rightScore++;

        if (grid[y][i] >= treeHeight) {
          break;
        }
      }

      maxScore = Math.max(
        maxScore,
        upScore * downScore * leftScore * rightScore
      );
    }
  }

  return maxScore;
});

await ex.testPart2([
  ex.c`
30373
25512
65332
33549
35390
`(8),

  ex.c`
input
`(),
]);
