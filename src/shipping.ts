export const FREE_SHIPPING_THRESHOLD = 75;
export const FLAT_SHIPPING_FEE = 7.5;

/** Shipping is free once the subtotal reaches the threshold. */
export function shippingFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}
