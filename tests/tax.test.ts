import { describe, expect, it } from "vitest";
import { taxFor } from "../src/tax";

describe("taxFor", () => {
  it("applies the rate and rounds to cents", () => {
    expect(taxFor(100, 0.05)).toBe(5);
    expect(taxFor(19.99, 0.13)).toBe(2.6);
  });

  it("rejects a negative rate", () => {
    expect(() => taxFor(100, -0.05)).toThrow(RangeError);
  });
});
