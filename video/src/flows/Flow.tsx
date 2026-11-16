import { Series } from "remotion";
import { Footage, footageFrames, type Shot } from "../components/footage";
import { Close, Statement } from "../components/scenes";

const STATEMENT = 85;
const CLOSE = 110;

/** Every flow has the same shape: statement, the real run, close. */
export function Flow(props: {
  flow: string;
  statement: readonly string[];
  shots: readonly Shot[];
  close: string;
}) {
  return (
    <Series>
      <Series.Sequence durationInFrames={STATEMENT}>
        <Statement lines={props.statement} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={footageFrames(props.shots)}>
        <Footage flow={props.flow} shots={props.shots} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={CLOSE}>
        <Close line={props.close} />
      </Series.Sequence>
    </Series>
  );
}

export function flowFrames(shots: readonly Shot[]): number {
  return STATEMENT + footageFrames(shots) + CLOSE;
}
