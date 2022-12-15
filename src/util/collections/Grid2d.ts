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

  equivalentTo(x: number, y: number): boolean {
    return this.x === x && this.y === y;
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

class BaseGrid2d<T> {
  readonly defaultValue: T;
  private grid: Map<Point2dString, T>;

  protected _minX: number;
  protected _maxX: number;
  protected _minY: number;
  protected _maxY: number;

  protected checkBounds = (_x: number, _y: number): void | string => {};

  protected setObserver = (_x: number, _y: number) => {};

  constructor(
    defaultValue: T,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) {
    this.defaultValue = defaultValue;
    this.grid = new Map();
    this._minX = minX;
    this._maxX = maxX;
    this._minY = minY;
    this._maxY = maxY;
  }

  get minX(): number {
    return this._minX;
  }

  get maxX(): number {
    return this._maxX;
  }

  get minY(): number {
    return this._minY;
  }

  get maxY(): number {
    return this._maxY;
  }

  get size(): number {
    return this.grid.size;
  }

  private checkBoundsOrThrow(x: number, y: number): void {
    const error = this.checkBounds(x, y);
    if (error) throw new Error(error);
  }

  get(x: number, y: number): T {
    this.checkBoundsOrThrow(x, y);
    const value = this.grid.get(Point2d.point2dString(x, y));
    return value ?? this.defaultValue;
  }

  set(x: number, y: number, value: T) {
    this.checkBoundsOrThrow(x, y);
    this.grid.set(Point2d.point2dString(x, y), value);
    this.setObserver(x, y);
  }

  getPoint(point: Point2d): T {
    return this.get(point.x, point.y);
  }

  private getUncheckedPoint(point: Point2d): T {
    const value = this.grid.get(point.toString());
    return value ?? this.defaultValue;
  }

  setPoint(point: Point2d, value: T) {
    this.set(point.x, point.y, value);
  }

  getWithFallback(x: number, y: number, fallback: T): T {
    this.checkBoundsOrThrow(x, y);
    const value = this.grid.get(Point2d.point2dString(x, y));
    return value ?? fallback;
  }

  getPointWithFallback(point: Point2d, fallback: T): T {
    return this.getWithFallback(point.x, point.y, fallback);
  }

  has(x: number, y: number): boolean {
    this.checkBoundsOrThrow(x, y);
    return this.grid.has(Point2d.point2dString(x, y));
  }

  hasPoint(point: Point2d): boolean {
    return this.has(point.x, point.y);
  }

  delete(x: number, y: number) {
    this.checkBoundsOrThrow(x, y);
    this.grid.delete(Point2d.point2dString(x, y));
  }

  deletePoint(point: Point2d) {
    this.delete(point.x, point.y);
  }

  clear() {
    this.grid.clear();
  }

  iterate(
    origin: IterationOrigin = iterationOrigin.topLeft,
    direction: IterationDirection = iterationDirection.horizontal
  ): [T, Point2d][] {
    const points = Grid2d.generateIterationPoints(
      origin,
      direction,
      this.minX,
      this.maxX,
      this.minY,
      this.maxY
    );
    return points.map((point) => [this.getUncheckedPoint(point), point]);
  }

  static readonly iterationOrigin = iterationOrigin;
  static readonly iterationDirection = iterationDirection;

  static generateIterationPoints(
    origin: IterationOrigin,
    direction: IterationDirection,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ): Point2d[] {
    const points: Point2d[] = [];

    switch (origin) {
      case iterationOrigin.topLeft:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = minY; y <= maxY; y++) {
              for (let x = minX; x <= maxX; x++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = minX; x <= maxX; x++) {
              for (let y = minY; y <= maxY; y++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
      case iterationOrigin.topRight:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = minY; y <= maxY; y++) {
              for (let x = maxX; x >= minX; x--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = maxX; x >= minX; x--) {
              for (let y = minY; y <= maxY; y++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
      case iterationOrigin.bottomLeft:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = maxY; y >= minY; y--) {
              for (let x = minX; x <= maxX; x++) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = minX; x <= maxX; x++) {
              for (let y = maxY; y >= minY; y--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
        }
        break;
      case iterationOrigin.bottomRight:
        switch (direction) {
          case iterationDirection.horizontal:
            for (let y = maxY; y >= minY; y--) {
              for (let x = maxX; x >= minX; x--) {
                points.push(new Point2d(x, y));
              }
            }
            break;
          case iterationDirection.vertical:
            for (let x = maxX; x >= minX; x--) {
              for (let y = maxY; y >= minY; y--) {
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

export class Grid2d<T> extends BaseGrid2d<T> {
  constructor(
    defaultValue: T,
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ) {
    super(defaultValue, minX, maxX, minY, maxY);
  }

  protected checkBounds = (x: number, y: number): void | string => {
    if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
      return `Point (${x}, ${y}) is out of bounds`;
    }
  };
}

export class InfiniteGrid2d<T> extends BaseGrid2d<T> {
  constructor(defaultValue: T) {
    super(defaultValue, 0, 0, 0, 0);
  }

  protected setObserver = (x: number, y: number) => {
    if (this._minX > x) {
      this._minX = x;
    }
    if (this._maxX < x) {
      this._maxX = x;
    }
    if (this._minY > y) {
      this._minY = y;
    }
    if (this._maxY < y) {
      this._maxY = y;
    }
  };
}
