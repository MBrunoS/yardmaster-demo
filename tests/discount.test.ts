import { describe, expect, it } from "vitest";
import { applyPercentDiscount } from "../src/discount";

describe("applyPercentDiscount", () => {
  it("takes a percentage off the subtotal", () => {
    expect(applyPercentDiscount(200, 10)).toBe(180);
    expect(applyPercentDiscount(19.99, 15)).toBe(16.99);
  });

  it("leaves the subtotal unchanged at zero percent", () => {
    expect(applyPercentDiscount(42.5, 0)).toBe(42.5);
  });

  it("rejects a percent outside 0 to 100", () => {
    expect(() => applyPercentDiscount(100, -1)).toThrow(RangeError);
    expect(() => applyPercentDiscount(100, 101)).toThrow(RangeError);
  });
});
