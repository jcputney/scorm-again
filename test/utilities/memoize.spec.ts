import { describe, expect, it, vi } from "vitest";
import { memoize } from "../../src/utilities";

describe("memoize", () => {
  it("caches repeated calls without options", () => {
    const fn = vi.fn((value: string) => value.toUpperCase());
    const memoized = memoize(fn);

    expect(memoized("value")).toBe("VALUE");
    expect(memoized("value")).toBe("VALUE");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("evicts the oldest entry when maxEntries is reached", () => {
    const fn = vi.fn((value: string) => value);
    const memoized = memoize(fn, undefined, { maxEntries: 2 });

    memoized("A");
    memoized("B");
    memoized("C");
    expect(fn).toHaveBeenCalledTimes(3);

    memoized("A");
    expect(fn).toHaveBeenCalledTimes(4);

    memoized("C");
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("bypasses oversized keys while caching small keys", () => {
    const fn = vi.fn((value: string) => value);
    const memoized = memoize(fn, undefined, { maxKeyLength: 10 });

    memoized("this key is too long");
    memoized("this key is too long");
    expect(fn).toHaveBeenCalledTimes(2);

    memoized("A");
    memoized("A");
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("does not cache thrown errors", () => {
    const fn = vi.fn(() => {
      throw new Error("failure");
    });
    const memoized = memoize(fn);

    expect(() => memoized()).toThrow("failure");
    expect(() => memoized()).toThrow("failure");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("uses a custom key function with options", () => {
    const fn = vi.fn((value: { id: string; label: string }) => value.label);
    const memoized = memoize(fn, (value) => value.id, {
      maxEntries: 2,
      maxKeyLength: 5,
    });

    expect(memoized({ id: "A", label: "first" })).toBe("first");
    expect(memoized({ id: "A", label: "second" })).toBe("first");
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
