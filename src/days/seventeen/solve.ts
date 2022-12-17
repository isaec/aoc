// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";
import { InfiniteGrid2d, Point2d } from "@util/collections/Grid2d.ts";

const ex = new Executor(import.meta.url);

const exampleInput = ex.c`
>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>
`;

// The tall, vertical chamber is exactly seven units wide
// Each rock appears so that its left edge is two units
// away from the left wall and its bottom edge is
// three units above the highest rock in the room
// (or the floor, if there isn't one).

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  let pushIndex = 0;
  const pushes: Readonly<string[]> = text.split("");

  const getPush = () => {
    if (pushIndex >= pushes.length) pushIndex = 0;
    return pushes[pushIndex++];
  };

  const shiftRight = (cord: { x: number; y: number }) => {
    cord.x++;
  };

  const shiftLeft = (cord: { x: number; y: number }) => {
    cord.x--;
  };

  const shiftDown = (cord: { x: number; y: number }) => {
    cord.y++;
  };

  const grid = new InfiniteGrid2d(".");
  const width = 7;

  let highestRock = 0;

  let rockCords: Readonly<Point2d[]> = [];

  const hideRock = () => {
    for (const rockCord of rockCords) {
      grid.deletePoint(rockCord);
    }
  };

  const showRock = () => {
    for (const rockCord of rockCords) {
      grid.setPoint(rockCord, "@");
    }
  };

  const spawnRockA = () => {
    rockCords = [
      new Point2d(2, highestRock - 3),
      new Point2d(3, highestRock - 3),
      new Point2d(4, highestRock - 3),
      new Point2d(5, highestRock - 3),
    ];
    showRock();
  };

  const spawnRockB = () => {
    rockCords = [
      new Point2d(2, highestRock - 4),
      new Point2d(3, highestRock - 3),
      new Point2d(3, highestRock - 4),
      new Point2d(3, highestRock - 5),
      new Point2d(4, highestRock - 4),
    ];
    showRock();
  };

  const spawnArray = [spawnRockA, spawnRockB];
  let rockIndex = 0;

  const spawnRock = () => {
    if (rockIndex >= spawnArray.length) rockIndex = 0;
    spawnArray[rockIndex++]();
  };

  let i = 0;
  spawnRock();

  while (i++ < 10) {
    tick();
    const push = getPush();
    console.log(push);

    if (push === ">") {
      if (!(rockCords[rockCords.length - 1].x + 1 >= width)) {
        hideRock();
        rockCords = rockCords.map((cord) => cord.into(shiftRight));
        showRock();
      }
    } else if (push === "<") {
      if (!(rockCords[0].x - 1 < 0)) {
        hideRock();
        rockCords = rockCords.map((cord) => cord.into(shiftLeft));
        showRock();
      }
    }

    // check if moving down would hit a rock
    let hitRock = false;
    for (const rockCord of rockCords) {
      if (rockCord.y >= 0 || grid.getPoint(rockCord.into(shiftDown)) === "#") {
        hitRock = true;
        break;
      }
    }

    if (hitRock) {
      for (const rockCord of rockCords) {
        grid.setPoint(rockCord, "#");
      }
      let maxRock = 0;
      for (const rockCord of rockCords) {
        if (rockCord.y > maxRock) maxRock = rockCord.y;
      }
      highestRock = maxRock;
      spawnRock();
    }

    hideRock();
    rockCords = rockCords.map((cord) => cord.into(shiftDown));
    showRock();

    grid.print();
  }
});

await ex.testPart1([
  exampleInput()(true),

  ex.c`
input
`()(false),
]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {});

await ex.testPart2([
  exampleInput()(true),

  ex.c`
input
`()(false),
]);
