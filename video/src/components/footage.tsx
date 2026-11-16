import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { appear, color, current, mono, sans } from "../theme";

export interface Shot {
  /** File under public/footage/<flow>/, without the extension. */
  readonly frame: string;
  /** How long the shot stays on screen, in video frames. */
  readonly hold: number;
  /** Where the capture comes from; shown in the window bar. */
  readonly source: "dashboard" | "github";
  /** Narration that starts with this shot and stays until the next one. */
  readonly caption?: string;
}

const SOURCE_LABEL = {
  dashboard: "localhost:3000 · Yardmaster dashboard",
  github: "github.com/MBrunoS/yardmaster-demo",
} as const;

const WIDTH = 1700;
const BAR = 40;
// Captures are 1568 x 733.
const HEIGHT = Math.round((WIDTH * 733) / 1568);
const FADE = 8;

export function footageFrames(shots: readonly Shot[]): number {
  return shots.reduce((sum, shot) => sum + shot.hold, 0);
}

/** Real captures played in order, each cross-fading into the next, with narration below. */
export function Footage({ flow, shots }: { flow: string; shots: readonly Shot[] }) {
  const frame = useCurrentFrame();
  let start = 0;
  const timed = shots.map((shot) => {
    const at = start;
    start += shot.hold;
    return { ...shot, at };
  });
  const active = current(frame, timed) ?? timed[0]!;
  const captions = timed.filter((shot) => shot.caption !== undefined);
  const caption = current(frame, captions);
  const captionIn = caption ? appear(frame, caption.at, 12) : 0;

  return (
    <AbsoluteFill style={{ background: color.bg, color: color.text, fontFamily: sans }}>
      <div
        style={{
          position: "absolute",
          top: 44,
          left: (1920 - WIDTH) / 2,
          width: WIDTH,
          borderRadius: 14,
          overflow: "hidden",
          border: `2px solid ${color.line}`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            height: BAR,
            background: color.panel,
            display: "flex",
            alignItems: "center",
            padding: "0 18px",
            gap: 8,
            fontFamily: mono,
            fontSize: 18,
            color: color.muted,
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((dot) => (
            <div key={dot} style={{ width: 12, height: 12, borderRadius: "50%", background: dot }} />
          ))}
          <span style={{ marginLeft: 14 }}>{SOURCE_LABEL[active.source]}</span>
        </div>
        <div style={{ position: "relative", height: HEIGHT, background: "#0d0f14" }}>
          {timed.map((shot) => {
            // Mount only the shots near the playhead; each fades in over the previous one.
            if (frame < shot.at - 1 || frame > shot.at + shot.hold + FADE) return null;
            const opacity = interpolate(frame, [shot.at, shot.at + FADE], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <Img
                key={shot.frame}
                src={staticFile(`footage/${flow}/${shot.frame}.jpg`)}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity }}
              />
            );
          })}
        </div>
      </div>
      {caption ? (
        <div
          style={{
            position: "absolute",
            left: 110,
            right: 110,
            bottom: 52,
            height: 110,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            opacity: captionIn,
            translate: `0 ${(1 - captionIn) * 12}px`,
          }}
        >
          {caption.caption}
        </div>
      ) : null}
    </AbsoluteFill>
  );
}
