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

export class Point {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(point: Point): Point {
    return new Point(this.x + point.x, this.y + point.y);
  }

  subtract(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y);
  }

  multiply(point: Point): Point {
    return new Point(this.x * point.x, this.y * point.y);
  }

  divide(point: Point): Point {
    return new Point(this.x / point.x, this.y / point.y);
  }

  into(fn: (pointObj: PointObj) => Point | PointObj | void): Point {
    const pointObj = { x: this.x, y: this.y };

    const result = fn(pointObj);
    if (result instanceof Point) return result;

    if (typeof result === "object") return new Point(result.x, result.y);

    return new Point(pointObj.x, pointObj.y);
  }

  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  toString(): string {
    return `(${this.x}, ${this.y})`;
  }

  static fromString(str: string): Point {
    const [x, y] = str.split(",").map(Number);
    return new Point(x, y);
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
