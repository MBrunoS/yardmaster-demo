import { describe, expect, it } from "vitest";
import { bulkDiscountPercent } from "../src/bulk-discount";

describe("bulkDiscountPercent", () => {
  it("gives no discount below 10 units", () => {
    expect(bulkDiscountPercent(9)).toBe(0);
  });

  it("steps up at 10, 50 and 100 units", () => {
    expect(bulkDiscountPercent(10)).toBe(5);
    expect(bulkDiscountPercent(50)).toBe(10);
    expect(bulkDiscountPercent(250)).toBe(15);
  });
});
