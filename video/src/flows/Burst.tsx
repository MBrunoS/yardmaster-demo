import type { Shot } from "../components/footage";
import { Flow, flowFrames } from "./Flow";

const d = "dashboard" as const;
const g = "github" as const;

const SHOTS: Shot[] = [
  { frame: "01", hold: 45, source: d, caption: "Six pull requests arrive at once. All six are selected, in order." },
  { frame: "02", hold: 50, source: d },
  { frame: "03", hold: 40, source: d, caption: "The first becomes active. The other five wait in line." },
  { frame: "04", hold: 36, source: d },
  { frame: "05", hold: 36, source: d, caption: "One exact candidate is validated at a time." },
  { frame: "06", hold: 36, source: d },
  { frame: "07", hold: 36, source: d },
  { frame: "08", hold: 36, source: d },
  { frame: "09", hold: 36, source: d, caption: "Each merge moves main, and the next candidate is built on it." },
  { frame: "10", hold: 36, source: d },
  { frame: "11", hold: 36, source: d },
  { frame: "12", hold: 60, source: d, caption: "GitHub never started the fourth validation run, so that item was cancelled and re-queued." },
  { frame: "13", hold: 36, source: d },
  { frame: "14", hold: 36, source: d, caption: "The queue keeps moving." },
  { frame: "15", hold: 36, source: d },
  { frame: "16", hold: 36, source: d },
  { frame: "17", hold: 36, source: d },
  { frame: "18", hold: 36, source: d },
  { frame: "19", hold: 50, source: d, caption: "The queue is empty. All six are merged." },
  { frame: "20", hold: 70, source: d, caption: "History records every outcome and the commit that shipped." },
  { frame: "21", hold: 80, source: g, caption: "On GitHub: one merge per pull request, each with a green check." },
  { frame: "22", hold: 60, source: g },
];

export const BURST_FRAMES = flowFrames(SHOTS);

export function Burst() {
  return (
    <Flow
      flow="burst"
      statement={["Agents open pull requests", "faster than a team can merge them."]}
      shots={SHOTS}
      close="One queue. One validated commit at a time. main stays green."
    />
  );
}
