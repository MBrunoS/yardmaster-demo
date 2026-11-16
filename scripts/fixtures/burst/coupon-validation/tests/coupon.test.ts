import { describe, expect, it } from "vitest";
import { isValidCouponCode } from "../src/coupon";

describe("isValidCouponCode", () => {
  it("accepts uppercase letters and digits", () => {
    expect(isValidCouponCode("SPRING25")).toBe(true);
  });

  it("rejects lowercase, symbols and wrong lengths", () => {
    expect(isValidCouponCode("spring25")).toBe(false);
    expect(isValidCouponCode("SPRING-25")).toBe(false);
    expect(isValidCouponCode("ABC")).toBe(false);
  });
});
