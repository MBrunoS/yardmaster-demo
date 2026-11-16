import type { LineItem } from "./order";
import { roundMoney } from "./money";

/** One receipt line, for example "2 x mug  25.00". */
export function receiptLine(item: LineItem): string {
  const total = roundMoney(item.unitPrice * item.quantity).toFixed(2);
  return `${item.quantity} x ${item.sku}  ${total}`;
}
