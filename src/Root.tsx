import React from "react";
import { Composition, Folder } from "remotion";
import { CANVAS } from "./brand";
import { scripts } from "./scripts";
import { videoFrames } from "./timing";
import { CuraVideo } from "./Video";

export const Root: React.FC = () => (
  <Folder name="Cura">
    {scripts.map((script) => (
      <Composition
        key={script.id}
        id={script.id}
        component={CuraVideo}
        durationInFrames={videoFrames(script)}
        fps={CANVAS.fps}
        width={CANVAS.width}
        height={CANVAS.height}
        defaultProps={{ script }}
      />
    ))}
  </Folder>
);
