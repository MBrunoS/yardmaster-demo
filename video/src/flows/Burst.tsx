import { Caption, MainTrack, PrCard, type PullRequest, Stage, type Step } from "../components/ui";
import { Flow, flowFrames } from "./Flow";

const TITLES = [
  "Add tax rounding for JPY",
  "Add bulk discount tiers",
  "Add free shipping threshold",
  "Add coupon code validation",
  "Add EUR price formatting",
  "Add gift wrap surcharge",
];
const SHAS = ["4f2a9c1", "81d07be", "c93e5a4", "2b6f1d8", "e07a3c5", "5a9d4f2"];

const ENQUEUE = 110;
const FIRST = 130;
const PER_ITEM = 52;
const startOf = (index: number) => FIRST + index * PER_ITEM;
const mergedAt = (index: number) => startOf(index) + 46;

function steps(index: number): Step[] {
  const queued: Step[] = [];
  // The count drops each time a pull request ahead of this one merges.
  for (let ahead = index; ahead >= 1; ahead--) {
    queued.push({
      at: ahead === index ? ENQUEUE + index * 3 : mergedAt(index - ahead - 1),
      label: `Queued (${ahead} ahead)`,
      tone: "muted",
    });
  }
  const start = startOf(index);
  return [
    ...queued,
    { at: start, label: "Preparing", tone: "progress" },
    { at: start + 10, label: "Validating", tone: "progress" },
    { at: start + 38, label: "Merge pending", tone: "progress" },
    { at: start + 46, label: "Merged", tone: "success" },
  ];
}

const PULL_REQUESTS: PullRequest[] = TITLES.map((title, index) => ({
  appearAt: 10 + index * 8,
  mergedAt: mergedAt(index),
  number: 5 + index,
  title,
  yardmaster: steps(index),
}));

const TERMINAL_FRAMES = 135;
const STAGE_FRAMES = 500;
export const BURST_FRAMES = flowFrames(TERMINAL_FRAMES, STAGE_FRAMES);

function BurstStage() {
  return (
    <Stage scenario="Burst">
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 96,
          width: 1120,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {PULL_REQUESTS.map((pr) => (
          <PrCard key={pr.number} pr={pr} compact />
        ))}
      </div>
      <MainTrack
        style={{ top: 130, left: 1320 }}
        commits={[
          { at: 0, label: "baseline", sha: "b744c08" },
          ...TITLES.map((title, index) => ({ at: mergedAt(index), label: title, sha: SHAS[index]! })),
        ]}
      />
      <Caption
        lines={[
          { at: 4, text: "Six pull requests from agents arrive at once." },
          { at: 62, text: "Each one is green on its own." },
          { at: ENQUEUE, text: "Yardmaster queues them in order." },
          { at: FIRST + 24, text: "One exact candidate is validated at a time." },
          { at: startOf(4), text: "What reaches main is the commit that was validated." },
        ]}
      />
    </Stage>
  );
}

export function Burst() {
  return (
    <Flow
      statement={["Agents open pull requests", "faster than a team can merge them."]}
      terminal={[
        { text: "scripts/burst.sh", type: "command", delay: 0 },
        ...TITLES.map((title, index) => ({
          text: `Opened #${5 + index}  ${title}`,
          type: "log" as const,
          delay: index === 0 ? 10 : 3,
        })),
        { text: "6 pull requests are open and green.", type: "success", delay: 10 },
      ]}
      terminalFrames={TERMINAL_FRAMES}
      stage={<BurstStage />}
      stageFrames={STAGE_FRAMES}
      close="One queue. One validated commit at a time. main stays green."
    />
  );
}
