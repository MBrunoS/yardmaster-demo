import { roundMoney } from "./money";

/** Tax owed on an amount. `rate` is a fraction, for example 0.05 for 5%. */
export function taxFor(amount: number, rate: number): number {
  if (rate < 0) throw new RangeError(`Tax rate cannot be negative, got ${rate}`);
  return roundMoney(amount * rate);
}
