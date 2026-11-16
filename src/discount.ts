import { roundMoney } from "./money";

/** Takes a percentage off a subtotal. `percent` is between 0 and 100. */
export function applyPercentDiscount(subtotal: number, percent: number): number {
  if (percent < 0 || percent > 100) {
    throw new RangeError(`Discount percent must be between 0 and 100, got ${percent}`);
  }
  return roundMoney(subtotal * (1 - percent / 100));
}
