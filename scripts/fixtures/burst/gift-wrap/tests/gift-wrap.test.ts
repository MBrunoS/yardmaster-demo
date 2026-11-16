import { describe, expect, it } from "vitest";
import { giftWrapFee } from "../src/gift-wrap";

describe("giftWrapFee", () => {
  it("charges per unit", () => {
    expect(
      giftWrapFee([
        { sku: "mug", unitPrice: 12.5, quantity: 2 },
        { sku: "tea", unitPrice: 7.25, quantity: 1 },
      ]),
    ).toBe(7.5);
  });

  it("is zero for an empty order", () => {
    expect(giftWrapFee([])).toBe(0);
  });
});
