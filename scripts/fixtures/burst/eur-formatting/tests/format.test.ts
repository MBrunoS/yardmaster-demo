import { describe, expect, it } from "vitest";
import { formatEur } from "../src/format";

describe("formatEur", () => {
  it("uses a decimal comma and a trailing euro sign", () => {
    expect(formatEur(9.5)).toBe("9,50 €");
  });

  it("groups thousands with dots", () => {
    expect(formatEur(1234.5)).toBe("1.234,50 €");
    expect(formatEur(-1234567.891)).toBe("-1.234.567,89 €");
  });
});
