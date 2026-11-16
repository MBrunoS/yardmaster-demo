import { roundMoney } from "./money";
import type { LineItem } from "./order";

export const GIFT_WRAP_FEE_PER_UNIT = 2.5;

/** Gift wrap is charged per unit across the whole order. */
export function giftWrapFee(items: readonly LineItem[]): number {
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  return roundMoney(units * GIFT_WRAP_FEE_PER_UNIT);
}
