import { describe, expect, it, run } from "@test_deps";
import { Point } from "./Grid2d.ts";

describe("Point", () => {
  it("should construct", () => {
    const point = new Point(1, 2);
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
  });

  it("should add", () => {
    const point = new Point(1, 2);
    const result = point.add(new Point(3, 4));
    expect(result.x).toBe(4);
    expect(result.y).toBe(6);
  });

  it("should subtract", () => {
    const point = new Point(1, 2);
    const result = point.subtract(new Point(3, 4));
    expect(result.x).toBe(-2);
    expect(result.y).toBe(-2);
  });

  it("should multiply", () => {
    const point = new Point(1, 2);
    const result = point.multiply(new Point(3, 4));
    expect(result.x).toBe(3);
    expect(result.y).toBe(8);
  });

  it("should divide", () => {
    const point = new Point(1, 2);
    const result = point.divide(new Point(3, 4));
    expect(result.x).toBe(1 / 3);
    expect(result.y).toBe(0.5);
  });

  describe("into", () => {
    it("should return a new Point", () => {
      const point = new Point(1, 2);
      const result = point.into((pointObj) => {
        pointObj.x = 3;
        pointObj.y = 4;
      });
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result).not.toBe(point);
    });

    it("should return a Point from an object", () => {
      const point = new Point(1, 2);
      const result = point.into(() => ({ x: 3, y: 4 }));
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result).not.toBe(point);
    });

    it("should return the same Point instance from being passed a Point", () => {
      const point = new Point(1, 2);
      const point2 = new Point(3, 4);
      const result = point.into(() => point2);
      expect(result.x).toBe(3);
      expect(result.y).toBe(4);
      expect(result).not.toBe(point);
      expect(result).toBe(point2);
    });

    it("should never return the original Point", () => {
      const point = new Point(1, 2);
      const result = point.into(() => {});
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result).not.toBe(point);
    });

    it("should create a new point even if no return value is given", () => {
      const point = new Point(1, 2);
      const result = point.into(() => undefined);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result).not.toBe(point);
    });

    it("should create a new point even if an invalid return value is given", () => {
      const point = new Point(1, 2);
      // @ts-expect-error - invalid return value intentionally
      const result = point.into(() => 3);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result).not.toBe(point);
    });
  });

  describe("equality", () => {
    it("should equal equivalent points", () => {
      const point = new Point(1, 2);
      expect(point.equals(new Point(1, 2))).toBe(true);
      expect(point.equals(new Point(3, 4))).toBe(false);
    });

    it("should equal when the same instance", () => {
      const point = new Point(1, 2);
      expect(point.equals(point)).toBe(true);
    });

    it("should not equal when the other point is an illegal value", () => {
      const point = new Point(1, 2);
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
      const point = new Point(1, 2);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ x: 1 })).toBe(false);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ y: 2 })).toBe(false);
    });

    it("should equal when the other object has the right values", () => {
      const point = new Point(1, 2);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ x: 1, y: 2 })).toBe(true);
      // @ts-expect-error - illegal comparison value intentionally
      expect(point.equals({ x: 3, y: 4 })).toBe(false);
    });

    it("should not equal when the point is illegally modified", () => {
      const point = new Point(1, 2);
      const point2 = new Point(1, 2);
      // @ts-expect-error - illegal modification intentionally
      point2.x = 3;

      expect(point.equals(point2)).toBe(false);
    });
  });

  it("should be able to be converted to a string", () => {
    const point = new Point(1, 2);
    expect(point.toString()).toBe("(1, 2)");
  });

  it("should be able to be constructed from a string", () => {
    const point = Point.fromString("(1, 2)");
    const point2 = new Point(1, 2);
    expect(point.x).toBe(1);
    expect(point.y).toBe(2);
    expect(point.equals(point2)).toBe(true);
  });

  it("should throw an error when constructed from an invalid string", () => {
    expect(() => Point.fromString("1, 2")).toThrow();
    expect(() => Point.fromString("(1, 2")).toThrow();
    expect(() => Point.fromString("1, 2)")).toThrow();
    expect(() => Point.fromString("(1, 2)")).not.toThrow();
  });
});

run();
