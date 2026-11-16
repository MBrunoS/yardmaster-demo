import { describe, expect, it } from "vitest";
import { shippingFor } from "../src/shipping";

describe("shippingFor", () => {
  it("charges the flat fee below the threshold", () => {
    expect(shippingFor(74.99)).toBe(7.5);
  });

  it("is free at or above the threshold", () => {
    expect(shippingFor(75)).toBe(0);
    expect(shippingFor(300)).toBe(0);
  });
});
