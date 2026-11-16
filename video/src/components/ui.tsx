import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { appear, color, current, mono, sans } from "../theme";

export type Tone = "muted" | "progress" | "success" | "failure" | "replaced";

const TONE: Record<Tone, string> = {
  failure: color.red,
  muted: color.muted,
  progress: color.amber,
  replaced: color.purple,
  success: color.green,
};

export interface Step {
  readonly at: number;
  readonly label: string;
  readonly tone: Tone;
}

/** The stage every flow plays on: background, repository header and scenario name. */
export function Stage({ scenario, children }: { scenario: string; children: ReactNode }) {
  return (
    <AbsoluteFill style={{ background: color.bg, color: color.text, fontFamily: sans }}>
      <div
        style={{
          position: "absolute",
          top: 56,
          left: 96,
          right: 96,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: color.muted,
        }}
      >
        <span style={{ fontFamily: mono }}>yardmaster-demo</span>
        <span>{scenario}</span>
      </div>
      {children}
    </AbsoluteFill>
  );
}

function StatusIcon({ tone }: { tone: Tone }) {
  const frame = useCurrentFrame();
  const size = 22;
  if (tone === "progress") {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: `3px solid ${color.line}`,
          borderTopColor: color.amber,
          rotate: `${frame * 12}deg`,
          boxSizing: "border-box",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: tone === "muted" ? "transparent" : TONE[tone],
        border: tone === "muted" ? `3px solid ${color.muted}` : "none",
        boxSizing: "border-box",
      }}
    />
  );
}

/** A check line whose label and tone follow the scripted steps. */
export function Check({ name, steps }: { name: string; steps: readonly Step[] }) {
  const frame = useCurrentFrame();
  const step = current(frame, steps);
  if (!step) return null;
  const pop = appear(frame, step.at, 10);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
      <StatusIcon tone={step.tone} />
      <span style={{ color: color.muted }}>{name}</span>
      <span
        style={{
          color: TONE[step.tone] === color.muted ? color.text : TONE[step.tone],
          fontWeight: 700,
          opacity: 0.4 + 0.6 * pop,
        }}
      >
        {step.label}
      </span>
    </div>
  );
}

export interface PullRequest {
  readonly number: number;
  readonly title: string;
  readonly appearAt: number;
  readonly yardmaster: readonly Step[];
  /** Frame at which the pull request is merged; the card dims to a merged state. */
  readonly mergedAt?: number;
  readonly children?: ReactNode;
}

export function PrCard({ pr, compact = false }: { pr: PullRequest; compact?: boolean }) {
  const frame = useCurrentFrame();
  const shown = appear(frame, pr.appearAt);
  const merged = pr.mergedAt === undefined ? 0 : appear(frame, pr.mergedAt, 20);
  const failed = current(frame, pr.yardmaster)?.tone === "failure";
  return (
    <div
      style={{
        opacity: shown * (1 - 0.45 * merged),
        translate: `0 ${(1 - shown) * 24}px`,
        background: color.panel,
        border: `2px solid ${failed ? color.red : color.line}`,
        borderRadius: 18,
        padding: compact ? "12px 26px" : "26px 32px",
        display: "flex",
        flexDirection: "column",
        gap: compact ? 6 : 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <span style={{ fontSize: compact ? 30 : 36, fontWeight: 700 }}>{pr.title}</span>
        <span style={{ fontSize: 26, color: color.muted, fontFamily: mono }}>#{pr.number}</span>
      </div>
      {pr.children}
      <div style={{ display: "flex", gap: 44 }}>
        <Check name="CI" steps={[{ at: pr.appearAt + 16, label: "passing", tone: "success" }]} />
        <Check name="Yardmaster" steps={pr.yardmaster} />
      </div>
    </div>
  );
}

export interface Commit {
  readonly at: number;
  readonly label: string;
  readonly sha: string;
  readonly tone?: Tone;
}

/** The target branch as a vertical line; commits arrive at the top. */
export function MainTrack({ commits, style }: { commits: readonly Commit[]; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const visible = commits.filter((commit) => frame >= commit.at).reverse();
  return (
    <div style={{ position: "absolute", ...style }}>
      <div style={{ fontSize: 28, color: color.muted, marginBottom: 26 }}>
        <span style={{ fontFamily: mono, color: color.text }}>main</span> · always green
      </div>
      <div style={{ position: "relative", paddingLeft: 44 }}>
        <div
          style={{
            position: "absolute",
            left: 12,
            top: 6,
            bottom: 6,
            width: 4,
            borderRadius: 2,
            background: color.line,
          }}
        />
        {visible.map((commit) => {
          const shown = appear(frame, commit.at, 16);
          return (
            <div
              key={commit.sha}
              style={{
                position: "relative",
                height: 74 * shown,
                opacity: shown,
                overflow: "visible",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -44,
                  top: 8,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: TONE[commit.tone ?? "success"],
                  border: `5px solid ${color.bg}`,
                  boxSizing: "border-box",
                  scale: `${0.6 + 0.4 * shown}`,
                }}
              />
              <div style={{ fontSize: 26, fontWeight: 700, whiteSpace: "nowrap" }}>{commit.label}</div>
              <div style={{ fontSize: 20, color: color.muted, fontFamily: mono }}>{commit.sha}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** The narration line at the bottom of the stage. */
export function Caption({ lines }: { lines: readonly { at: number; text: string }[] }) {
  const frame = useCurrentFrame();
  const line = current(frame, lines);
  if (!line) return null;
  const shown = appear(frame, line.at, 12);
  return (
    <div
      style={{
        position: "absolute",
        left: 96,
        right: 96,
        bottom: 72,
        fontSize: 44,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        opacity: shown,
        translate: `0 ${(1 - shown) * 14}px`,
      }}
    >
      {line.text}
    </div>
  );
}

/** One line of a diff, added or removed. */
export function DiffLine({ kind, children }: { kind: "+" | "-"; children: string }) {
  const tone = kind === "+" ? color.green : color.red;
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: 24,
        padding: "6px 14px",
        borderRadius: 8,
        background: `${tone}1f`,
        color: tone,
        whiteSpace: "pre",
      }}
    >
      {kind} {children}
    </div>
  );
}
