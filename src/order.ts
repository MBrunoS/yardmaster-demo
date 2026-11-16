import { applyPercentDiscount } from "./discount";
import { roundMoney } from "./money";
import { taxFor } from "./tax";

export interface LineItem {
  readonly sku: string;
  readonly unitPrice: number;
  readonly quantity: number;
}

export interface Order {
  readonly items: readonly LineItem[];
  readonly discountPercent?: number;
  readonly taxRate: number;
}

export interface PricedOrder {
  readonly subtotal: number;
  readonly discount: number;
  readonly tax: number;
  readonly total: number;
}

export function subtotalOf(items: readonly LineItem[]): number {
  return roundMoney(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));
}

/** Prices an order: subtotal, then discount, then tax on the discounted amount. */
export function priceOrder(order: Order): PricedOrder {
  const subtotal = subtotalOf(order.items);
  const discounted = applyPercentDiscount(subtotal, order.discountPercent ?? 0);
  const tax = taxFor(discounted, order.taxRate);
  return {
    subtotal,
    discount: roundMoney(subtotal - discounted),
    tax,
    total: roundMoney(discounted + tax),
  };
}
