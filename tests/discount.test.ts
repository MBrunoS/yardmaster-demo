import { describe, expect, it } from "vitest";
import { applyDiscount } from "../src/discount";

describe("applyDiscount", () => {
  it("takes a percentage off the subtotal", () => {
    expect(applyDiscount(200, 10)).toBe(180);
    expect(applyDiscount(19.99, 15)).toBe(16.99);
  });

  it("leaves the subtotal unchanged at zero percent", () => {
    expect(applyDiscount(42.5, 0)).toBe(42.5);
  });

  it("rejects a percent outside 0 to 100", () => {
    expect(() => applyDiscount(100, -1)).toThrow(RangeError);
    expect(() => applyDiscount(100, 101)).toThrow(RangeError);
  });
});
