import { useCurrentFrame } from "remotion";
import { Caption, Check, MainTrack, PrCard, Stage, type Step } from "../components/ui";
import { appear, color, mono } from "../theme";
import { Flow, flowFrames } from "./Flow";

const ENQUEUE = 70;
const PUSH = 170;
const REPLACED = 215;
const SECOND = 250;
const MERGED = 384;

const BASE = "b744c08";
const PUSHED = "9d2e7aa";
const CANDIDATE = "c41be07";

const TERMINAL_FRAMES = 125;
const STAGE_FRAMES = 510;
export const BASE_MOVES_FRAMES = flowFrames(TERMINAL_FRAMES, STAGE_FRAMES);

function Attempt(props: {
  at: number;
  number: number;
  base: string;
  candidate: string;
  steps: readonly Step[];
  dimAt?: number;
}) {
  const frame = useCurrentFrame();
  if (frame < props.at) return null;
  const shown = appear(frame, props.at);
  const dim = props.dimAt === undefined ? 0 : appear(frame, props.dimAt, 20);
  return (
    <div
      style={{
        opacity: shown * (1 - 0.5 * dim),
        translate: `0 ${(1 - shown) * 20}px`,
        background: color.panel,
        border: `2px solid ${color.line}`,
        borderRadius: 18,
        padding: "22px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 700 }}>Attempt {props.number}</div>
      <div style={{ fontFamily: mono, fontSize: 24, color: color.muted }}>
        candidate <span style={{ color: color.text }}>{props.candidate}</span> = main{" "}
        <span style={{ color: color.text }}>{props.base}</span> + pull request
      </div>
      <Check name="Validation" steps={props.steps} />
    </div>
  );
}

function BaseMovesStage() {
  return (
    <Stage scenario="Base moves during validation">
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
            mergedAt: MERGED,
            number: 13,
            title: "Add receipt line formatting",
            yardmaster: [
              { at: ENQUEUE, label: "Preparing", tone: "progress" },
              { at: ENQUEUE + 24, label: "Validating", tone: "progress" },
              { at: REPLACED, label: "Preparing", tone: "progress" },
              { at: SECOND + 14, label: "Validating", tone: "progress" },
              { at: MERGED - 14, label: "Merge pending", tone: "progress" },
              { at: MERGED, label: "Merged", tone: "success" },
            ],
          }}
        />
        <Attempt
          at={ENQUEUE + 10}
          number={1}
          base={BASE}
          candidate="a1f3d92"
          dimAt={REPLACED}
          steps={[
            { at: ENQUEUE + 24, label: "running", tone: "progress" },
            { at: REPLACED, label: "Replaced: main moved", tone: "replaced" },
          ]}
        />
        <Attempt
          at={SECOND}
          number={2}
          base={PUSHED}
          candidate={CANDIDATE}
          steps={[
            { at: SECOND + 14, label: "running", tone: "progress" },
            { at: MERGED - 14, label: "passed", tone: "success" },
          ]}
        />
      </div>
      <MainTrack
        style={{ top: 130, left: 1320 }}
        commits={[
          { at: 0, label: "baseline", sha: BASE },
          { at: PUSH, label: "Direct push: release notes", sha: PUSHED, tone: "progress" },
          { at: MERGED, label: "Add receipt line formatting", sha: CANDIDATE },
        ]}
      />
      <Caption
        lines={[
          { at: 4, text: "One pull request, green and ready." },
          { at: ENQUEUE + 24, text: "Yardmaster validates a candidate built on today's main." },
          { at: PUSH, text: "Meanwhile, someone pushes to main." },
          { at: REPLACED, text: "That candidate no longer matches main. It is discarded." },
          { at: SECOND + 14, text: "A new candidate is built on the new main and validated." },
          { at: MERGED, text: "main moves to exactly the commit that was validated." },
        ]}
      />
    </Stage>
  );
}

export function BaseMoves() {
  return (
    <Flow
      statement={["A test result is only valid", "for the base it ran on."]}
      terminal={[
        { text: "scripts/scenario-base-moves.sh", type: "command", delay: 0 },
        { text: "Opened #13  Add receipt line formatting", type: "log", delay: 10 },
        { text: "CI green: #13", type: "success", delay: 12 },
        { text: "Waiting for Yardmaster to report Validating...", type: "log", delay: 8 },
      ]}
      terminalFrames={TERMINAL_FRAMES}
      stage={<BaseMovesStage />}
      stageFrames={STAGE_FRAMES}
      close="Yardmaster never merges onto a base it did not validate."
    />
  );
}
