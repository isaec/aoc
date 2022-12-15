import { describe, expect, it, run } from "@test_deps";
import { Grid2d, InfiniteGrid2d, Point2d } from "@util/collections/Grid2d.ts";

describe("Grid2d", () => {
  const makeGrid = () => {
    const grid = new Grid2d("x", 0, 2, 0, 3);

    grid.set(0, 0, "a");
    grid.set(1, 0, "b");
    grid.set(2, 0, "c");
    grid.set(0, 1, "d");
    grid.set(1, 1, "e");

    return grid;
  };
  it("should construct", () => {
    const grid = makeGrid();
    expect(grid.minX).toBe(0);
    expect(grid.minY).toBe(0);
    expect(grid.maxX).toBe(2);
    expect(grid.maxY).toBe(3);
  });

  it("should get", () => {
    const grid = makeGrid();
    expect(grid.get(0, 0)).toBe("a");
    expect(grid.get(1, 0)).toBe("b");
    expect(grid.get(2, 0)).toBe("c");
    expect(grid.get(0, 1)).toBe("d");
    expect(grid.get(1, 1)).toBe("e");
    expect(grid.get(2, 1)).toBe("x");
    expect(grid.get(0, 2)).toBe("x");
    expect(grid.get(1, 2)).toBe("x");
  });

  it("should set", () => {
    const grid = makeGrid();
    grid.set(0, 2, "f");
    grid.set(1, 2, "g");
    grid.set(2, 2, "h");
    grid.set(0, 3, "i");
    grid.set(1, 3, "j");
    grid.set(2, 3, "k");
    expect(grid.get(0, 2)).toBe("f");
    expect(grid.get(1, 2)).toBe("g");
    expect(grid.get(2, 2)).toBe("h");
    expect(grid.get(0, 3)).toBe("i");
    expect(grid.get(1, 3)).toBe("j");
    expect(grid.get(2, 3)).toBe("k");
  });

  it("should throw on out of bounds", () => {
    const grid = makeGrid();
    expect(() => grid.get(-1, 0)).toThrow();
    expect(() => grid.get(0, -1)).toThrow();
    expect(() => grid.get(3, 0)).toThrow();
    expect(() => grid.get(0, 4)).toThrow();
  });

  it("should throw on out of bounds set", () => {
    const grid = makeGrid();
    expect(() => grid.set(-1, 0, "a")).toThrow();
    expect(() => grid.set(0, -1, "a")).toThrow();
    expect(() => grid.set(3, 0, "a")).toThrow();
    expect(() => grid.set(0, 4, "a")).toThrow();
  });

  describe("generateIterationPoints", () => {
    it("should iterate in order for top-left-horizontal", () => {
      const points = Grid2d.generateIterationPoints(
        Grid2d.iterationOrigin.topLeft,
        Grid2d.iterationDirection.horizontal,
        0,
        4,
        0,
        1
      );
      expect(points).toEqual([
        new Point2d(0, 0),
        new Point2d(1, 0),
        new Point2d(2, 0),
        new Point2d(3, 0),
        new Point2d(4, 0),
        new Point2d(0, 1),
        new Point2d(1, 1),
        new Point2d(2, 1),
        new Point2d(3, 1),
        new Point2d(4, 1),
      ]);
    });

    it("should iterate in order for top-left-vertical", () => {
      const points = Grid2d.generateIterationPoints(
        Grid2d.iterationOrigin.topLeft,
        Grid2d.iterationDirection.vertical,
        0,
        4,
        0,
        1
      );
      expect(points).toEqual([
        new Point2d(0, 0),
        new Point2d(0, 1),
        new Point2d(1, 0),
        new Point2d(1, 1),
        new Point2d(2, 0),
        new Point2d(2, 1),
        new Point2d(3, 0),
        new Point2d(3, 1),
        new Point2d(4, 0),
        new Point2d(4, 1),
      ]);
    });

    it("should iterate in order for top-right-horizontal", () => {
      const points = Grid2d.generateIterationPoints(
        Grid2d.iterationOrigin.topRight,
        Grid2d.iterationDirection.horizontal,
        0,
        4,
        0,
        1
      );
      expect(points).toEqual([
        new Point2d(4, 0),
        new Point2d(3, 0),
        new Point2d(2, 0),
        new Point2d(1, 0),
        new Point2d(0, 0),
        new Point2d(4, 1),
        new Point2d(3, 1),
        new Point2d(2, 1),
        new Point2d(1, 1),
        new Point2d(0, 1),
      ]);
    });

    it("should iterate in order for top-right-vertical", () => {
      const points = Grid2d.generateIterationPoints(
        Grid2d.iterationOrigin.topRight,
        Grid2d.iterationDirection.vertical,
        0,
        4,
        0,
        1
      );
      expect(points).toEqual([
        new Point2d(4, 0),
        new Point2d(4, 1),
        new Point2d(3, 0),
        new Point2d(3, 1),
        new Point2d(2, 0),
        new Point2d(2, 1),
        new Point2d(1, 0),
        new Point2d(1, 1),
        new Point2d(0, 0),
        new Point2d(0, 1),
      ]);
    });

    it("should iterate in order for bottom-left-horizontal", () => {
      const points = Grid2d.generateIterationPoints(
        Grid2d.iterationOrigin.bottomLeft,
        Grid2d.iterationDirection.horizontal,
        0,
        4,
        0,
        1
      );
      expect(points).toEqual([
        new Point2d(0, 1),
        new Point2d(1, 1),
        new Point2d(2, 1),
        new Point2d(3, 1),
        new Point2d(4, 1),
        new Point2d(0, 0),
        new Point2d(1, 0),
        new Point2d(2, 0),
        new Point2d(3, 0),
        new Point2d(4, 0),
      ]);
    });

    it("should iterate in order for bottom-left-vertical", () => {
      const points = Grid2d.generateIterationPoints(
        Grid2d.iterationOrigin.bottomLeft,
        Grid2d.iterationDirection.vertical,
        0,
        4,
        0,
        1
      );
      expect(points).toEqual([
        new Point2d(0, 1),
        new Point2d(0, 0),
        new Point2d(1, 1),
        new Point2d(1, 0),
        new Point2d(2, 1),
        new Point2d(2, 0),
        new Point2d(3, 1),
        new Point2d(3, 0),
        new Point2d(4, 1),
        new Point2d(4, 0),
      ]);
    });
  });

  describe("iterate", () => {
    it("should iterate in default order", () => {
      const grid = makeGrid();
      const items: string[] = [];
      grid.iterate().forEach(([item]) => items.push(item));

      expect(items).toEqual([
        "a",
        "b",
        "c",
        "d",
        "e",
        "x",
        "x",
        "x",
        "x",
        "x",
        "x",
        "x",
      ]);
    });

    it("should iterate in order for top-left-vertical", () => {
      const grid = makeGrid();
      const items: string[] = [];
      grid
        .iterate(
          Grid2d.iterationOrigin.topLeft,
          Grid2d.iterationDirection.vertical
        )
        .forEach(([item]) => items.push(item));

      expect(items).toEqual([
        "a",
        "d",
        "x",
        "x",
        "b",
        "e",
        "x",
        "x",
        "c",
        "x",
        "x",
        "x",
      ]);
    });
  });
});

describe("InfiniteGrid2d", () => {
  const makeGrid = () => {
    const grid = new InfiniteGrid2d("x");

    grid.set(0, 0, "a");
    grid.set(1, 0, "b");
    grid.set(2, 0, "c");
    grid.set(0, 1, "d");
    grid.set(1, 1, "e");

    return grid;
  };

  it("should construct", () => {
    const grid = new InfiniteGrid2d("x");
    expect(grid.defaultValue).toBe("x");
  });

  it("should grow its dimensions", () => {
    const grid = makeGrid();
    expect(grid.minX).toBe(0);
    expect(grid.maxX).toBe(2);
    expect(grid.minY).toBe(0);
    expect(grid.maxY).toBe(1);

    grid.set(100_000_000, 32, "f");

    expect(grid.minX).toBe(0);
    expect(grid.maxX).toBe(100_000_000);
    expect(grid.minY).toBe(0);
    expect(grid.maxY).toBe(32);

    grid.set(-100_000, -64, "g");

    expect(grid.minX).toBe(-100_000);
    expect(grid.maxX).toBe(100_000_000);
    expect(grid.minY).toBe(-64);
    expect(grid.maxY).toBe(32);

    grid.delete(100_000_000, 32);

    // cant ever shrink without a full scan
    expect(grid.minX).toBe(-100_000);
    expect(grid.maxX).toBe(100_000_000);
    expect(grid.minY).toBe(-64);
    expect(grid.maxY).toBe(32);
  });
});

describe("Point2d", () => {
  it("should construct", () => {
    const point = new Point2d(1, 2);
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
  });

  it("should add", () => {
    const point = new Point2d(1, 2);
    const result = point.add(new Point2d(3, 4));
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it("should subtract", () => {
    const point = new Point2d(1, 2);
    const result = point.subtract(new Point2d(3, 4));
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-2);
  });

  it("should multiply", () => {
    const point = new Point2d(1, 2);
    const result = point.multiply(new Point2d(3, 4));
    expect(result.x).toBe(3);
    expect(result.y).toBe(8);
  });

  it("should divide", () => {
    const point = new Point2d(1, 2);
    const result = point.divide(new Point2d(3, 4));
    expect(result.x).toBe(1 / 3);
    expect(result.y).toBe(0.5);
  });

  describe("into", () => {
    it("should return a new Point", () => {
      const point = new Point2d(1, 2);
      const result = point.into((pointObj) => {
        pointObj.x = 3;
        pointObj.y = 4;
      });
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result).not.toBe(point);
    });

    it("should return a Point from an object", () => {
      const point = new Point2d(1, 2);
      const result = point.into(() => ({ x: 3, y: 4 }));
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result).not.toBe(point);
    });

    it("should return the same Point instance from being passed a Point", () => {
      const point = new Point2d(1, 2);
      const point2 = new Point2d(3, 4);
      const result = point.into(() => point2);
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result).not.toBe(point);
      expect(result).toBe(point2);
    });

    it("should never return the original Point", () => {
      const point = new Point2d(1, 2);
      const result = point.into(() => {});
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result).not.toBe(point);
    });

    it("should create a new point even if no return value is given", () => {
      const point = new Point2d(1, 2);
      const result = point.into(() => undefined);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result).not.toBe(point);
    });

    it("should create a new point even if an invalid return value is given", () => {
      const point = new Point2d(1, 2);
      // @ts-expect-error - invalid return value intentionally
      const result = point.into(() => 3);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result).not.toBe(point);
    });
  });

  describe("equality", () => {
    it("should equal equivalent points", () => {
      const point = new Point2d(1, 2);
      expect(point.equals(new Point2d(1, 2))).toBe(true);
      expect(point.equals(new Point2d(3, 4))).toBe(false);
    });

    it("should equal when the same instance", () => {
      const point = new Point2d(1, 2);
      expect(point.equals(point)).toBe(true);
    });

    it("should not equal when the other point is an illegal value", () => {
      const point = new Point2d(1, 2);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals(null)).toBe(false);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals(undefined)).toBe(false);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals(3)).toBe(false);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals("3")).toBe(false);
    });

    it("should not equal when the other object is missing a value", () => {
      const point = new Point2d(1, 2);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ x: 1 })).toBe(false);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ y: 2 })).toBe(false);
    });

    it("should equal when the other object has the right values", () => {
      const point = new Point2d(1, 2);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ x: 1, y: 2 })).toBe(true);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ x: 3, y: 4 })).toBe(false);
    });

    it("should not equal when the point is illegally modified", () => {
      const point = new Point2d(1, 2);
      const point2 = new Point2d(1, 2);
      // @ts-expect-error - illegal modification intentionally
      point2.x = 3;

      expect(point.equals(point2)).toBe(false);
    });
  });

  it("should be able to be converted to a string", () => {
    const point = new Point2d(1, 2);
    expect(point.toString()).toBe("(1, 2)");
  });

  it("should be able to be constructed from a string", () => {
    const point = Point2d.fromString("(1, 2)");
    const point2 = new Point2d(1, 2);
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
    expect(point.equals(point2)).toBe(true);
  });

  it("should throw an error when constructed from an invalid string", () => {
    expect(() => Point2d.fromString("1, 2")).toThrow();
    expect(() => Point2d.fromString("(1, 2")).toThrow();
    expect(() => Point2d.fromString("1, 2)")).toThrow();
    expect(() => Point2d.fromString("(1, 2)")).not.toThrow();
  });
});

run();
