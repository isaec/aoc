// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";
import { Grid2d, Point2d } from "../../util/collections/Grid2d.ts";
import { Graph } from "../../util/collections/Graph.ts";

const ex = new Executor(import.meta.url);

enum FieldValues {
  Empty = " ",
  Element = "⛶",
  Path = "◌",
  Point = "◉",
}

type Rectangle = {
  from: Point2d;
  to: Point2d;
};

const rectangle = (from: Point2d, to: Point2d): Rectangle => ({
  from,
  to,
});

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // skip actual input
  if (lines[0].charAt(0) !== "(") return;

  lines.forEach((line) => {
    console.log(line);
  });

  const field = new Grid2d<FieldValues>(FieldValues.Empty, 0, 20, 0, 20);
  // set the outer border
  field.iterate().forEach(([, point]) => {
    if (
      point.x === 0 ||
      point.x === field.maxX ||
      point.y === 0 ||
      point.y === field.maxY
    ) {
      field.setPoint(point, FieldValues.Element);
    }
  });
  // get the start and end points
  const sourcePoints = lines[0].split(" to ");
  const from = Point2d.fromString(sourcePoints[0]);
  const to = Point2d.fromString(sourcePoints[1]);

  // get all rectangle points
  const rectanglePoints = lines.slice(1).map((line) => {
    const [from, to] = line.split(" from ")[1].split(" to ");
    const rect = rectangle(Point2d.fromString(from), Point2d.fromString(to));
    for (let x = rect.from.x; x <= rect.to.x; x++) {
      for (let y = rect.from.y; y <= rect.to.y; y++) {
        field.set(x, y, FieldValues.Element);
      }
    }
  });

  // show the start and end points
  field.setPoint(from, FieldValues.Point);
  field.setPoint(to, FieldValues.Point);

  // build a graph
  const graph = new Graph<ReturnType<Point2d["toString"]>>();
  field.iterate().forEach(([value, point]) => {
    graph.addNode(point.toString());
    if (value === FieldValues.Element) return;
    const neighbors = [
      new Point2d(point.x - 1, point.y),
      new Point2d(point.x + 1, point.y),
      new Point2d(point.x, point.y - 1),
      new Point2d(point.x, point.y + 1),
      new Point2d(point.x - 1, point.y - 1),
      new Point2d(point.x + 1, point.y + 1),
      new Point2d(point.x - 1, point.y + 1),
      new Point2d(point.x + 1, point.y - 1),
    ];

    neighbors.forEach((neighbor) => {
      if (field.getPoint(neighbor) === FieldValues.Element) return;
      graph.addEdge(point.toString(), neighbor.toString());
    });
  });

  // find the shortest path
  const path = graph.shortestPath(from.toString(), to.toString());

  if (!path) return;

  // draw the path
  path.forEach((point) => {
    if (point === from.toString() || point === to.toString()) return;
    field.setPoint(Point2d.fromString(point), FieldValues.Path);
  });

  // find the spline control points
  // every coordinate that ends a straight or diagonal line segment is a control point
  const controlPoints = path.filter((point, index) => {
    if (index === 0 || index === path.length - 1) return false;
    const prev = Point2d.fromString(path[index - 1]);
    const next = Point2d.fromString(path[index + 1]);
    const current = Point2d.fromString(point);
    // if the previous and next point are on the same line horizontal or vertical
    if (prev.x === current.x && current.x === next.x) return false;
    if (prev.y === current.y && current.y === next.y) return false;

    // if the previous and next point are on the same diagonal
    if (
      prev.x - current.x === prev.y - current.y &&
      current.x - next.x === current.y - next.y
    )
      return false;
    if (
      prev.x - current.x === current.y - prev.y &&
      current.x - next.x === next.y - current.y
    )
      return false;

    return true;
  });

  // draw the control points
  controlPoints.forEach((point) => {
    field.setPoint(Point2d.fromString(point), FieldValues.Point);
  });

  field.print();
});

await ex.testPart1([
  ex.c`
(3, 3) to (11, 18)
element rect from (6, 9) to (9, 12)
element rect from (6, 9) to (12, 9)
element rect from (6, 9) to (6, 17)
element rect from (5, 5) to (6, 6)
element rect from (10, 14) to (11, 15)
`()(true),
]);
