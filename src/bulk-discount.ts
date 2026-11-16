const TIERS = [
  { minQuantity: 100, percent: 15 },
  { minQuantity: 50, percent: 10 },
  { minQuantity: 10, percent: 5 },
] as const;

/** Discount percent earned by ordering a quantity of one item. */
export function bulkDiscountPercent(quantity: number): number {
  return TIERS.find((tier) => quantity >= tier.minQuantity)?.percent ?? 0;
}
