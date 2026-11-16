import { Composition } from "remotion";
import { BASE_MOVES_FRAMES, BaseMoves } from "./flows/BaseMoves";
import { BURST_FRAMES, Burst } from "./flows/Burst";
import { SEMANTIC_CONFLICT_FRAMES, SemanticConflict } from "./flows/SemanticConflict";
import { FPS, HEIGHT, WIDTH } from "./theme";

const size = { fps: FPS, height: HEIGHT, width: WIDTH };

export function Root() {
  return (
    <>
      <Composition id="burst" component={Burst} durationInFrames={BURST_FRAMES} {...size} />
      <Composition
        id="semantic-conflict"
        component={SemanticConflict}
        durationInFrames={SEMANTIC_CONFLICT_FRAMES}
        {...size}
      />
      <Composition id="base-moves" component={BaseMoves} durationInFrames={BASE_MOVES_FRAMES} {...size} />
    </>
  );
}
