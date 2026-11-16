import type { Shot } from "../components/footage";
import { Flow, flowFrames } from "./Flow";

const d = "dashboard" as const;
const g = "github" as const;

const SHOTS: Shot[] = [
  { frame: "01", hold: 40, source: d, caption: "One pull request joins the queue." },
  { frame: "02", hold: 40, source: d },
  { frame: "03", hold: 40, source: d, caption: "Attempt 1: a candidate is built on today's main." },
  { frame: "04", hold: 40, source: d },
  { frame: "05", hold: 45, source: d, caption: "While it validates, someone pushes a commit straight to main." },
  { frame: "06", hold: 40, source: d },
  { frame: "07", hold: 40, source: d },
  { frame: "08", hold: 80, source: d, caption: "The candidate no longer matches main. Attempt 2 starts on the new base." },
  { frame: "09", hold: 40, source: d },
  { frame: "10", hold: 40, source: d, caption: "The new candidate is validated from scratch." },
  { frame: "11", hold: 40, source: d },
  { frame: "12", hold: 40, source: d },
  { frame: "13", hold: 70, source: d, caption: "It passes, and main moves to exactly that commit." },
  { frame: "14", hold: 85, source: g, caption: "On GitHub: two validation runs for the same pull request, one per attempt." },
  { frame: "15", hold: 85, source: g, caption: "main holds both the direct push and the pull request." },
];

export const BASE_MOVES_FRAMES = flowFrames(SHOTS);

export function BaseMoves() {
  return (
    <Flow
      flow="base-moves"
      statement={["A test result is only valid", "for the base it ran on."]}
      shots={SHOTS}
      close="Yardmaster never merges onto a base it did not validate."
    />
  );
}
