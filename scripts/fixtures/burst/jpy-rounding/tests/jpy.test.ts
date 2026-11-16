import { describe, expect, it } from "vitest";
import { roundYen, taxForYen } from "../src/jpy";

describe("JPY rounding", () => {
  it("rounds to whole yen", () => {
    expect(roundYen(1234.5)).toBe(1235);
    expect(roundYen(1234.4)).toBe(1234);
  });

  it("rounds consumption tax to whole yen", () => {
    expect(taxForYen(1980, 0.1)).toBe(198);
    expect(taxForYen(1985, 0.08)).toBe(159);
  });
});
