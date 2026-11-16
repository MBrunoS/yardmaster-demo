import { describe, expect, it } from "vitest";
import { totalWeightKg } from "../src/weight";

describe("totalWeightKg", () => {
  it("sums weight times quantity in kilograms", () => {
    expect(
      totalWeightKg([
        { weightGrams: 350, quantity: 2 },
        { weightGrams: 125, quantity: 4 },
      ]),
    ).toBe(1.2);
  });

  it("is zero with no parcels", () => {
    expect(totalWeightKg([])).toBe(0);
  });
});
