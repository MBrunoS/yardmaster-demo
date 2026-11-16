const COUPON_PATTERN = /^[A-Z0-9]{6,12}$/;

/** A coupon code is 6 to 12 uppercase letters or digits. */
export function isValidCouponCode(code: string): boolean {
  return COUPON_PATTERN.test(code);
}
