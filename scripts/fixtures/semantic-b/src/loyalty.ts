import { applyDiscount } from "./discount";

export type LoyaltyTier = "silver" | "gold";

const TIER_PERCENT: Record<LoyaltyTier, number> = { silver: 5, gold: 10 };

/** Applies the loyalty discount for a customer's tier. */
export function applyLoyaltyDiscount(subtotal: number, tier: LoyaltyTier): number {
  return applyDiscount(subtotal, TIER_PERCENT[tier]);
}
