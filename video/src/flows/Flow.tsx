import type { ReactNode } from "react";
import { Series } from "remotion";
import { Close, ScriptRun, Statement } from "../components/scenes";
import type { TerminalLine } from "../components/remocn/terminal-simulator";

export const STATEMENT = 85;
export const CLOSE = 110;

/** Every flow has the same shape: statement, script run, the queue at work, close. */
export function Flow(props: {
  statement: readonly string[];
  terminal: TerminalLine[];
  terminalFrames: number;
  stage: ReactNode;
  stageFrames: number;
  close: string;
}) {
  return (
    <Series>
      <Series.Sequence durationInFrames={STATEMENT}>
        <Statement lines={props.statement} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={props.terminalFrames}>
        <ScriptRun lines={props.terminal} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={props.stageFrames}>{props.stage}</Series.Sequence>
      <Series.Sequence durationInFrames={CLOSE}>
        <Close line={props.close} />
      </Series.Sequence>
    </Series>
  );
}

export function flowFrames(terminalFrames: number, stageFrames: number): number {
  return STATEMENT + terminalFrames + stageFrames + CLOSE;
}
