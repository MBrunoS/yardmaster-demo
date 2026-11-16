import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { appear, color, mono, sans } from "../theme";
import { SoftBlurIn } from "./remocn/soft-blur-in";
import { type TerminalLine, TerminalSimulator } from "./remocn/terminal-simulator";

/** A short statement on a quiet background, one entry per line. */
export function Statement({ lines, fontSize = 76 }: { lines: readonly string[]; fontSize?: number }) {
  return (
    <AbsoluteFill
      style={{ background: color.bg, alignItems: "center", justifyContent: "center", gap: 8 }}
    >
      {lines.map((text, index) => (
        <div key={text} style={{ position: "relative", width: "100%", height: fontSize * 1.3 }}>
          <Sequence from={index * 14} layout="none">
            <SoftBlurIn
              text={text}
              fontSize={fontSize}
              color={index === lines.length - 1 ? color.accent : color.text}
              fontWeight={700}
              fontFamily={sans}
            />
          </Sequence>
        </div>
      ))}
    </AbsoluteFill>
  );
}

/** The demo script running in a terminal. */
export function ScriptRun({ lines }: { lines: TerminalLine[] }) {
  return (
    <AbsoluteFill style={{ background: color.bg }}>
      <AbsoluteFill style={{ scale: "1.7" }}>
        <TerminalSimulator
          lines={lines}
          title="~/yardmaster-demo"
          background="#0f0e13"
          chromeColor={color.panel}
          charsPerFrame={3}
          fontFamily={mono}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/** Wordmark, the guarantee, and where to find the project. */
export function Close({ line }: { line: string }) {
  const frame = useCurrentFrame();
  const mark = appear(frame, 0, 20);
  const rest = appear(frame, 22, 20);
  return (
    <AbsoluteFill
      style={{
        background: color.bg,
        color: color.text,
        fontFamily: sans,
        alignItems: "center",
        justifyContent: "center",
        gap: 36,
      }}
    >
      <div
        style={{
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          opacity: mark,
          scale: `${0.94 + 0.06 * mark}`,
        }}
      >
        Yardmaster<span style={{ color: color.accent }}>.</span>
      </div>
      <div style={{ fontSize: 44, opacity: rest, textAlign: "center", maxWidth: 1400 }}>{line}</div>
      <div style={{ fontSize: 30, color: color.muted, fontFamily: mono, opacity: rest }}>
        github.com/MBrunoS/yardmaster
      </div>
      <div style={{ position: "absolute", bottom: 56, fontSize: 22, color: color.muted, opacity: rest }}>
        Scripted reconstruction of the demo flow, not a screen recording.
      </div>
    </AbsoluteFill>
  );
}
