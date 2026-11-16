import { describe, expect, it } from "vitest";
import { applyLoyaltyDiscount } from "../src/loyalty";

describe("applyLoyaltyDiscount", () => {
  it("takes 5% off for silver members", () => {
    expect(applyLoyaltyDiscount(200, "silver")).toBe(190);
  });

  it("takes 10% off for gold members", () => {
    expect(applyLoyaltyDiscount(200, "gold")).toBe(180);
  });
});
