const iterationOrigin = {
  topLeft: "topLeft",
  topRight: "topRight",
  bottomLeft: "bottomLeft",
  bottomRight: "bottomRight",
} as const;
type IterationOrigin = typeof iterationOrigin[keyof typeof iterationOrigin];

const iterationDirection = {
  horizontal: "horizontal",
  vertical: "vertical",
} as const;
type IterationDirection =
  typeof iterationDirection[keyof typeof iterationDirection];

type PointObj = {
  x: number;
  y: number;
};

type Point2dString = string & { __point2dString: never };

export class Point2d {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(point: Point2d): Point2d {
    return new Point2d(this.x + point.x, this.y + point.y);
  }

  subtract(point: Point2d): Point2d {
    return new Point2d(this.x - point.x, this.y - point.y);
  }

  multiply(point: Point2d): Point2d {
    return new Point2d(this.x * point.x, this.y * point.y);
  }

  divide(point: Point2d): Point2d {
    return new Point2d(this.x / point.x, this.y / point.y);
  }

  into(fn: (pointObj: PointObj) => Point2d | PointObj | void): Point2d {
    const pointObj = { x: this.x, y: this.y };

    const result = fn(pointObj);
    if (result instanceof Point2d) return result;

    if (typeof result === "object") return new Point2d(result.x, result.y);

    return new Point2d(pointObj.x, pointObj.y);
  }

  equals(point: Point2d): boolean {
    return this.x === point?.x && this.y === point?.y;
  }

  static point2dString(x: number, y: number): Point2dString {
    return `(${x}, ${y})` as Point2dString;
  }

  toString(): Point2dString {
    return Point2d.point2dString(this.x, this.y);
  }

  // bad implementation...
  static fromString(str: string): Point2d {
    if (str.charAt(0) !== "(" || str.charAt(str.length - 1) !== ")")
      throw new Error(`Invalid point: ${str}`);
    const [x, y] = str.slice(1, -1).split(", ").map(Number);
    if (Number.isNaN(x) || Number.isNaN(y))
      throw new Error(`Invalid point: ${str}, parsed as (${x}, ${y})`);
    return new Point2d(x, y);
  }
}

export class Grid2d<T> {
  readonly dimensions:
    | "unbounded"
    | Readonly<{
        width: number;
        height: number;
      }>;
  readonly defaultValue: T;
  private grid: Map<Point2dString, T>;

  constructor(
    width: number,
    height: number,
    defaultValue: T,
    unbounded = false
  ) {
    if (unbounded) {
      this.dimensions = "unbounded";
    } else {
      this.dimensions = { width, height };
    }
    this.defaultValue = defaultValue;
    this.grid = new Map();
  }

  static unbounded<T>(defaultValue: T): Grid2d<T> {
    const grid = new Grid2d(0, 0, defaultValue, true);
    return grid;
  }

  get width(): number {
    if (this.dimensions === "unbounded") throw new Error("unbounded grid");
    return this.dimensions.width;
  }

  get height(): number {
    if (this.dimensions === "unbounded") throw new Error("unbounded grid");
    return this.dimensions.height;
  }

  get size(): number {
    return this.grid.size;
  }

  private checkBounds(x: number, y: number) {
    if (this.dimensions === "unbounded") return;
    if (x < 0 || x >= this.dimensions.width) throw new Error("x out of bounds");
    if (y < 0 || y >= this.dimensions.height)
      throw new Error("y out of bounds");
  }

  get(x: number, y: number): T {
    this.checkBounds(x, y);
    const value = this.grid.get(Point2d.point2dString(x, y));
    return value ?? this.defaultValue;
  }

  set(x: number, y: number, value: T) {
    this.checkBounds(x, y);
    this.grid.set(Point2d.point2dString(x, y), value);
  }

  getPoint(point: Point2d): T {
    return this.get(point.x, point.y);
  }

  setPoint(point: Point2d, value: T) {
    this.set(point.x, point.y, value);
  }

  getWithFallback(x: number, y: number, fallback: T): T {
    this.checkBounds(x, y);
    const value = this.grid.get(Point2d.point2dString(x, y));
    return value ?? fallback;
  }

  getPointWithFallback(point: Point2d, fallback: T): T {
    return this.getWithFallback(point.x, point.y, fallback);
  }

  static readonly iterationOrigin = iterationOrigin;
  static readonly iterationDirection = iterationDirection;

  static generateIterationPoints(
    origin: IterationOrigin,
    direction: IterationDirection,
    width: number,
    height: number
  ): Point2d[] {
    const points: Point2d[] = [];

    switch (origin) {
      case iterationOrigin.topLeft:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = 0; x < width; x++) {
              for (let y = 0; y < height; y++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
      case iterationOrigin.topRight:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = 0; y < height; y++) {
              for (let x = width - 1; x >= 0; x--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = width - 1; x >= 0; x--) {
              for (let y = 0; y < height; y++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
      case iterationOrigin.bottomLeft:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = height - 1; y >= 0; y--) {
              for (let x = 0; x < width; x++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = 0; x < width; x++) {
              for (let y = height - 1; y >= 0; y--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
      case iterationOrigin.bottomRight:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = height - 1; y >= 0; y--) {
              for (let x = width - 1; x >= 0; x--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = width - 1; x >= 0; x--) {
              for (let y = height - 1; y >= 0; y--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
    }

    return points;
  }
}
