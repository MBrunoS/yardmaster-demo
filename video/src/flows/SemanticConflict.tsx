import { useCurrentFrame } from "remotion";
import { Caption, DiffLine, MainTrack, PrCard, Stage } from "../components/ui";
import { appear, color, mono } from "../theme";
import { Flow, flowFrames } from "./Flow";

const ENQUEUE = 150;
const A_MERGED = 225;
const B_VALIDATING = 246;
const B_FAILED = 330;

const TERMINAL_FRAMES = 120;
const STAGE_FRAMES = 500;
export const SEMANTIC_CONFLICT_FRAMES = flowFrames(TERMINAL_FRAMES, STAGE_FRAMES);

function Note({ at, tone, children }: { at: number; tone: string; children: string }) {
  const frame = useCurrentFrame();
  const shown = appear(frame, at);
  if (frame < at) return null;
  return (
    <div style={{ fontFamily: mono, fontSize: 24, color: tone, opacity: shown }}>{children}</div>
  );
}

function SemanticStage() {
  return (
    <Stage scenario="Semantic conflict">
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 96,
          width: 1120,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <PrCard
          pr={{
            appearAt: 10,
            mergedAt: A_MERGED,
            number: 11,
            title: "A · Rename applyDiscount to applyPercentDiscount",
            yardmaster: [
              { at: ENQUEUE, label: "Preparing", tone: "progress" },
              { at: ENQUEUE + 12, label: "Validating", tone: "progress" },
              { at: A_MERGED - 10, label: "Merge pending", tone: "progress" },
              { at: A_MERGED, label: "Merged", tone: "success" },
            ],
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <DiffLine kind="-">export function applyDiscount(subtotal, percent)</DiffLine>
                <DiffLine kind="+">export function applyPercentDiscount(subtotal, percent)</DiffLine>
              </div>
            ),
          }}
        />
        <PrCard
          pr={{
            appearAt: 40,
            number: 12,
            title: "B · Add loyalty tier discounts",
            yardmaster: [
              { at: ENQUEUE + 4, label: "Queued (1 ahead)", tone: "muted" },
              { at: A_MERGED + 7, label: "Preparing", tone: "progress" },
              { at: B_VALIDATING, label: "Validating", tone: "progress" },
              { at: B_FAILED, label: "Validation failed", tone: "failure" },
            ],
            children: (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <DiffLine kind="+">{'import { applyDiscount } from "./discount";'}</DiffLine>
                <Note at={B_VALIDATING} tone={color.muted}>
                  candidate = main (with A) + B
                </Note>
                <Note at={B_FAILED} tone={color.red}>
                  TypeError: applyDiscount is not a function
                </Note>
              </div>
            ),
          }}
        />
      </div>
      <MainTrack
        style={{ top: 130, left: 1320 }}
        commits={[
          { at: 0, label: "baseline", sha: "b744c08" },
          { at: A_MERGED, label: "A · Rename applyDiscount", sha: "7c1e9a3" },
        ]}
      />
      <Caption
        lines={[
          { at: 4, text: "Two pull requests. Different files. No Git conflict." },
          { at: 84, text: "Both pass CI on their own." },
          { at: ENQUEUE, text: "A is tested on top of main, passes, and merges." },
          { at: B_VALIDATING, text: "B is tested on top of the new main, which includes A." },
          { at: B_FAILED + 6, text: "It fails. B is not merged, and main never goes red." },
        ]}
      />
    </Stage>
  );
}

export function SemanticConflict() {
  return (
    <Flow
      statement={["Two pull requests can each be right", "and still break main together."]}
      terminal={[
        { text: "scripts/scenario-semantic-conflict.sh", type: "command", delay: 0 },
        { text: "Opened #11  Rename applyDiscount to applyPercentDiscount", type: "log", delay: 10 },
        { text: "Opened #12  Add loyalty tier discounts", type: "log", delay: 4 },
        { text: "CI green: #11", type: "success", delay: 14 },
        { text: "CI green: #12", type: "success", delay: 4 },
      ]}
      terminalFrames={TERMINAL_FRAMES}
      stage={<SemanticStage />}
      stageFrames={STAGE_FRAMES}
      close="Every pull request is tested on what is already merged."
    />
  );
}
