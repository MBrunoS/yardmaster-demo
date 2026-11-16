import { roundMoney } from "./money";

/** Formats an amount the German way, for example "1.234,50 €". */
export function formatEur(amount: number): string {
  const [whole = "0", cents = "00"] = roundMoney(Math.abs(amount)).toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+$)/g, ".");
  return `${amount < 0 ? "-" : ""}${grouped},${cents} €`;
}
