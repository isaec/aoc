// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";
import {
  Grid2d,
  InfiniteGrid2d,
  Point2d,
  Point2dString,
} from "@util/collections/Grid2d.ts";

/* the example input

*/

const ex = new Executor(import.meta.url);

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // if (lines.length > 20) return;

  type Elem = "B" | "S" | "." | "#";
  const grid = new InfiniteGrid2d<Elem>(".");

  // const focusY = 10;
  const focusY = 2000000;
  const occupied = new Set<number>();

  for (const line of lines) {
    const [x1, y1] = line
      .split(":")[0]
      .slice(10)
      .split(", ")
      .map((e) => Number(e.slice(2)));

    const sensorPoint = new Point2d(x1, y1);
    grid.setPoint(sensorPoint, "S");

    const [x2, y2] = line
      .split(":")[1]
      .slice(" closest beacon is at ".length)
      .split(", ")
      .map((e) => Number(e.slice(2)));

    const beaconPoint = new Point2d(x2, y2);
    grid.setPoint(beaconPoint, "B");

    const distance = sensorPoint.manhattanDistanceTo(beaconPoint);

    const fakeSensorPoint = new Point2d(sensorPoint.x, focusY);

    if (sensorPoint.manhattanDistanceTo(fakeSensorPoint) <= distance) {
      const adjustedDistance =
        distance - sensorPoint.manhattanDistanceTo(fakeSensorPoint) + 1;

      console.log({
        sensorPoint,
        fakeSensorPoint,
        sensorToFake: sensorPoint.manhattanDistanceTo(fakeSensorPoint),
        distance,
        adjustedDistance,
      });

      for (let i = 0; i < adjustedDistance; i++) {
        const point1 = fakeSensorPoint.x + i;
        const point2 = fakeSensorPoint.x - i;

        if (!grid.has(point1, focusY)) {
          // grid.set(point1, focusY, "#");
          occupied.add(point1);
        }

        if (!grid.has(point2, focusY)) {
          // grid.set(point2, focusY, "#");
          occupied.add(point2);
        }
      }
    }
  }

  grid.print();

  return occupied.size;
});

// await ex.testPart1([
//   ex.c`
// Sensor at x=2, y=18: closest beacon is at x=-2, y=15
// Sensor at x=9, y=16: closest beacon is at x=10, y=16
// Sensor at x=13, y=2: closest beacon is at x=15, y=3
// Sensor at x=12, y=14: closest beacon is at x=10, y=16
// Sensor at x=10, y=20: closest beacon is at x=10, y=16
// Sensor at x=14, y=17: closest beacon is at x=10, y=16
// Sensor at x=8, y=7: closest beacon is at x=2, y=10
// Sensor at x=2, y=0: closest beacon is at x=2, y=10
// Sensor at x=0, y=11: closest beacon is at x=2, y=10
// Sensor at x=20, y=14: closest beacon is at x=25, y=17
// Sensor at x=17, y=20: closest beacon is at x=21, y=22
// Sensor at x=16, y=7: closest beacon is at x=15, y=3
// Sensor at x=14, y=3: closest beacon is at x=15, y=3
// Sensor at x=20, y=1: closest beacon is at x=15, y=3
// `(26)(true),

//   ex.c`
// input
// `()(false),
// ]);

// deno-lint-ignore no-unused-vars
await ex.part2(async ({ text, lines }, console, tick) => {
  // if (lines.length > 20) return;

  type Elem = "B" | "S" | "." | "#";
  const grid = new InfiniteGrid2d<Elem>(".");

  class Diamond {
    public center: Point2d;

    constructor(
      public readonly x: number,
      public readonly y: number,
      public readonly radius: number
    ) {
      this.center = new Point2d(x, y);
    }

    contains(point: Point2d) {
      return point.manhattanDistanceTo(this.center) <= this.radius;
    }
  }

  const diamonds: Diamond[] = [];

  for (const line of lines) {
    const [x1, y1] = line
      .split(":")[0]
      .slice(10)
      .split(", ")
      .map((e) => Number(e.slice(2)));

    const sensorPoint = new Point2d(x1, y1);
    grid.setPoint(sensorPoint, "S");

    const [x2, y2] = line
      .split(":")[1]
      .slice(" closest beacon is at ".length)
      .split(", ")
      .map((e) => Number(e.slice(2)));

    const beaconPoint = new Point2d(x2, y2);
    grid.setPoint(beaconPoint, "B");

    const distance = sensorPoint.manhattanDistanceTo(beaconPoint);

    const diamond = new Diamond(x1, y1, distance);
    diamonds.push(diamond);
  }

  const minX = 0;
  const maxX = 4000000;
  const minY = 0;
  const maxY = 4000000;

  for (let x = minX; x <= maxX; x++) {
    window.console.log(x);
    for (let y = minY; y <= maxY; y++) {
      let contained = false;
      for (const diamond of diamonds) {
        if (diamond.contains(new Point2d(x, y))) {
          contained = true;
          // increase y to skip the rest of the diamond
          const distanceToBorder = diamond.center.manhattanDistanceTo(
            new Point2d(x, y)
          );
          y += diamond.radius - distanceToBorder;
          break;
        }
      }
      if (!contained) {
        return x * 4_000_000 + y;
      }
    }
  }

  grid.print();
});

await ex.testPart2([
  ex.c`
Sensor at x=2, y=18: closest beacon is at x=-2, y=15
Sensor at x=9, y=16: closest beacon is at x=10, y=16
Sensor at x=13, y=2: closest beacon is at x=15, y=3
Sensor at x=12, y=14: closest beacon is at x=10, y=16
Sensor at x=10, y=20: closest beacon is at x=10, y=16
Sensor at x=14, y=17: closest beacon is at x=10, y=16
Sensor at x=8, y=7: closest beacon is at x=2, y=10
Sensor at x=2, y=0: closest beacon is at x=2, y=10
Sensor at x=0, y=11: closest beacon is at x=2, y=10
Sensor at x=20, y=14: closest beacon is at x=25, y=17
Sensor at x=17, y=20: closest beacon is at x=21, y=22
Sensor at x=16, y=7: closest beacon is at x=15, y=3
Sensor at x=14, y=3: closest beacon is at x=15, y=3
Sensor at x=20, y=1: closest beacon is at x=15, y=3
`(56000011)(true),

  ex.c`
input
`()(false),
]);
