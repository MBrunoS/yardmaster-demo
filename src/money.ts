/** Rounds an amount to cents, half away from zero. */
export function roundMoney(amount: number): number {
  const cents = Math.round((Math.abs(amount) + Number.EPSILON) * 100);
  return (Math.sign(amount) * cents) / 100;
}
