import { describe, expect, it } from "vitest";
import { priceOrder, subtotalOf } from "../src/order";

const items = [
  { sku: "mug", unitPrice: 12.5, quantity: 2 },
  { sku: "tea", unitPrice: 7.25, quantity: 4 },
];

describe("subtotalOf", () => {
  it("sums unit price times quantity", () => {
    expect(subtotalOf(items)).toBe(54);
    expect(subtotalOf([])).toBe(0);
  });
});

describe("priceOrder", () => {
  it("taxes the full subtotal when there is no discount", () => {
    expect(priceOrder({ items, taxRate: 0.05 })).toEqual({
      subtotal: 54,
      discount: 0,
      tax: 2.7,
      total: 56.7,
    });
  });

  it("applies the discount before tax", () => {
    expect(priceOrder({ items, discountPercent: 10, taxRate: 0.05 })).toEqual({
      subtotal: 54,
      discount: 5.4,
      tax: 2.43,
      total: 51.03,
    });
  });
});
