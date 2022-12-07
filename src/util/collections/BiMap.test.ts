import { describe, expect, it, run } from "@test_deps";

import { BiMap } from "./BiMap.ts";

describe("BiMap", () => {
  it("should add a key-value pair", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    expect(map.get("a")).toBe(1);
    expect(map.getKey(1)).toBe("a");
  });

  it("should delete a key-value pair", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    expect(map.delete("a")).toBe(true);
    expect(map.get("a")).toBe(undefined);
    expect(map.getKey(1)).toBe(undefined);
  });

  it("should return the size", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    map.add("b", 2);
    map.delete("a");
    expect(map.size).toBe(1);
  });

  it("should clear the map", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    map.add("b", 2);
    map.clear();
    expect(map.size).toBe(0);
  });

  it("should return the keys", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    map.add("b", 2);
    expect(Array.from(map.keys())).toEqual(["a", "b"]);
  });

  it("should return the values", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    map.add("b", 2);
    expect(Array.from(map.values())).toEqual([1, 2]);
  });

  it("should return the entries", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    map.add("b", 2);
    expect(Array.from(map.entries())).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
  });

  it("should allow allow reverse lookup", () => {
    const map = new BiMap<string, number>();
    map.add("a", 1);
    expect(map.get("a")).toBe(1);
    expect(map.getKey(1)).toBe("a");
  });
});

run();
