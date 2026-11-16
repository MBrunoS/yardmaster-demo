import { describe, expect, it } from "vitest";
import { pointsFor } from "../src/loyalty-points";

describe("pointsFor", () => {
  it("earns one point per whole unit", () => {
    expect(pointsFor(56.7)).toBe(56);
  });

  it("earns nothing on a refund", () => {
    expect(pointsFor(-20)).toBe(0);
  });
});
