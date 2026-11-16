import { describe, expect, it } from "vitest";
import { receiptLine } from "../src/receipt";

describe("receiptLine", () => {
  it("shows quantity, sku and the line total with two decimals", () => {
    expect(receiptLine({ sku: "mug", unitPrice: 12.5, quantity: 2 })).toBe("2 x mug  25.00");
  });
});
