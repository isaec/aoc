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

  toString(): string {
    return `(${this.x}, ${this.y})`;
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
  private width: number;
  private height: number;
  private grid: T[];

  constructor(width: number, height: number, defaultValue: T) {
    this.width = width;
    this.height = height;
    this.grid = new Array(width * height).fill(defaultValue);
  }

  private checkBounds(x: number, y: number) {
    if (x < 0 || x >= this.width) throw new Error("x out of bounds");
    if (y < 0 || y >= this.height) throw new Error("y out of bounds");
  }

  private getIndex(x: number, y: number): number {
    this.checkBounds(x, y);
    return x + y * this.width;
  }

  get(x: number, y: number): T {
    return this.grid[this.getIndex(x, y)];
  }

  set(x: number, y: number, value: T) {
    this.grid[this.getIndex(x, y)] = value;
  }
}
