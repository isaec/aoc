import { expect, describe, it, run } from "@test_deps";
import { mapIterable } from "./iterable.ts";

describe("iterable", () => {
  it("should be able to map an iterable", () => {
    const iterable = [1, 2, 3];
    const mapped = mapIterable(iterable, (item) => item * 2);
    expect([...mapped]).toEqual([2, 4, 6]);
  });

  it("should be able to map an iterable with an index", () => {
    const iterable = [1, 2, 3];
    const mapped = mapIterable(iterable, (item, index) => item * index);
    expect([...mapped]).toEqual([0, 2, 6]);
  });

  it("should wait to call the function", () => {
    const iterable = [1, 2, 3];
    let iterableCalledCount = 0;
    const mapped = mapIterable(iterable, (item) => {
      iterableCalledCount++;
      return item;
    });
    expect(iterableCalledCount).toEqual(0);
    expect([...mapped]).toEqual([1, 2, 3]);
    expect(iterableCalledCount).toEqual(3);
  });

  it("should be lazy", () => {
    const iterable = [1, 2, 3];
    let iterableCalledCount = 0;
    const mapped = mapIterable(iterable, (item) => {
      iterableCalledCount++;
      return item;
    });
    const iterator = mapped[Symbol.iterator]();
    expect(iterableCalledCount).toEqual(0);
    expect(iterator.next()).toEqual({ done: false, value: 1 });
    expect(iterableCalledCount).toEqual(1);

    expect(iterator.next()).toEqual({ done: false, value: 2 });
    expect(iterableCalledCount).toEqual(2);

    expect(iterator.next()).toEqual({ done: false, value: 3 });
    expect(iterableCalledCount).toEqual(3);

    expect(iterator.next()).toEqual({ done: true, value: undefined });
    expect(iterableCalledCount).toEqual(3);
  });
});

run();
