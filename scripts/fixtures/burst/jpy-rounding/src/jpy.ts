/** The yen has no minor unit, so amounts round to whole yen. */
export function roundYen(amount: number): number {
  return Math.round(amount);
}

/** Tax owed in yen on a yen amount. */
export function taxForYen(amount: number, rate: number): number {
  return roundYen(amount * rate);
}
