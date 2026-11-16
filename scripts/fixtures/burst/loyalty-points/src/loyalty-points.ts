/** One point per whole currency unit spent; nothing for a refund. */
export function pointsFor(total: number): number {
  return Math.max(0, Math.floor(total));
}
