import { describe, expect, it, run } from "@test_deps";

import { BiMap } from "./BiMap.ts";
import { SetView } from "./SetView.ts";

const makeSetView = <T>(values: T[] = []): SetView<T> =>
  new SetView(new Set(values));

describe("BiMap", () => {
  it("should add, remove, and remember values", () => {
    const group = new BiMap<string, number>();
    group.add("a", 1);
    group.add("a", 2);
    group.add("b", 2);
    group.add("b", 3);
    expect(group.getKeys(1)).toEqual(makeSetView(["a"]));
    expect(group.getKeys(2)).toEqual(makeSetView(["a", "b"]));
    expect(group.getKeys(3)).toEqual(makeSetView(["b"]));
    expect(group.getValues("a")).toEqual(makeSetView([1, 2]));
    expect(group.getValues("b")).toEqual(makeSetView([2, 3]));
    group.remove("a", 1);
    group.remove("a", 2);
    group.remove("b", 2);
    group.remove("b", 3);
    expect(group.getKeys(1)).toEqual(makeSetView());
    expect(group.getKeys(2)).toEqual(makeSetView());
    expect(group.getKeys(3)).toEqual(makeSetView());
    expect(group.getValues("a")).toEqual(makeSetView());
    expect(group.getValues("b")).toEqual(makeSetView());
  });

  it("should return empty sets for unknown keys and values", () => {
    const group = new BiMap<string, number>();
    expect(group.getKeys(1)).toEqual(makeSetView());
    expect(group.getKeys(2)).toEqual(makeSetView());
    expect(group.getKeys(3)).toEqual(makeSetView());
    expect(group.getValues("a")).toEqual(makeSetView());
    expect(group.getValues("b")).toEqual(makeSetView());
  });

  it("should not allow modifying the returned sets", () => {
    const group = new BiMap<string, number>();
    group.add("a", 1);
    group.add("a", 2);
    group.add("b", 2);
    group.add("b", 3);
    expect(() => {
      // @ts-ignore: intentionally testing for runtime errors
      group.getKeys(1).add("c");
    }).toThrow();
    expect(() => {
      // @ts-ignore: intentionally testing for runtime errors
      group.getKeys(2).delete("a");
    }).toThrow();
    expect(() => {
      // @ts-ignore: intentionally testing for runtime errors
      group.getValues("a").add(3);
    }).toThrow();
    expect(() => {
      // @ts-ignore: intentionally testing for runtime errors
      group.getValues("b").delete(2);
    }).toThrow();
  });
});

run();
