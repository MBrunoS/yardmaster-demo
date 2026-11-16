import type { Shot } from "../components/footage";
import { Flow, flowFrames } from "./Flow";

const d = "dashboard" as const;

const SHOTS: Shot[] = [
  { frame: "01", hold: 80, source: d, caption: "Two pull requests, green on their own, join the queue: A, then B." },
  { frame: "02", hold: 40, source: d, caption: "A renames a function. Yardmaster builds its candidate on main." },
  { frame: "03", hold: 40, source: d },
  { frame: "04", hold: 45, source: d, caption: "The candidate passes validation, and A merges." },
  { frame: "05", hold: 45, source: d, caption: "B still calls the old name. Its candidate is built on the new main." },
  { frame: "06", hold: 40, source: d },
  { frame: "07", hold: 40, source: d },
  { frame: "08", hold: 40, source: d },
  { frame: "09", hold: 80, source: d, caption: "Validation fails. B is not merged." },
  { frame: "10", hold: 110, source: "github", caption: "On GitHub, B's Yardmaster check says why and links to the failing run." },
];

export const SEMANTIC_CONFLICT_FRAMES = flowFrames(SHOTS);

export function SemanticConflict() {
  return (
    <Flow
      flow="semantic-conflict"
      statement={["Two pull requests can each be right", "and still break main together."]}
      shots={SHOTS}
      close="Every pull request is tested on what is already merged."
    />
  );
}
