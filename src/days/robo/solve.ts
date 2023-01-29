// deno-lint-ignore-file require-await
import Executor from "@util/executor.ts";
import { Grid2d, Point2d } from "../../util/collections/Grid2d.ts";
import { Graph } from "../../util/collections/Graph.ts";

const ex = new Executor(import.meta.url);

enum FieldValues {
  Empty = " ",
  Element = "▩",
  Path = "◌",
  Point = "◉",
}

// deno-lint-ignore no-unused-vars
await ex.part1(async ({ text, lines }, console, tick) => {
  // skip actual input
  if (lines[0].charAt(0) !== "(") return;

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
  // put the start and end points
  const sourcePoints = text.split(" to ");
  const from = new Point2d(
    Number(sourcePoints[0].split(", ")[0].slice(1)),
    Number(sourcePoints[0].split(", ")[1].slice(0, -1))
  );
  const to = new Point2d(
    Number(sourcePoints[1].split(", ")[0].slice(1)),
    Number(sourcePoints[1].split(", ")[1].slice(0, -1))
  );

  field.setPoint(from, FieldValues.Point);
  field.setPoint(to, FieldValues.Point);

  // build a graph
  const graph = new Graph<Point2d>();
  field.iterate().forEach(([value, point]) => {
    graph.addNode(point);
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
      graph.addEdge(point, neighbor);
    });
  });

  // find the shortest path
  const path = graph.shortestPath(from, to);

  if (!path) return;

  // draw the path
  path.forEach((point) => {
    field.setPoint(point, FieldValues.Path);
  });

  field.print();
});

await ex.testPart1([
  ex.c`
(3, 3) to (10, 10)
`()(true),
]);
