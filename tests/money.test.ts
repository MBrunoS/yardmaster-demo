import { describe, expect, it } from "vitest";
import { roundMoney } from "../src/money";

describe("roundMoney", () => {
  it("rounds to cents", () => {
    expect(roundMoney(10.004)).toBe(10);
    expect(roundMoney(10.006)).toBe(10.01);
  });

  it("rounds half cents away from zero", () => {
    expect(roundMoney(1.005)).toBe(1.01);
    expect(roundMoney(-1.005)).toBe(-1.01);
  });
});
