import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { linearTiming } from "@remotion/transitions";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { TRANSITION_FRAMES } from "./brand";
import type { TransitionName } from "./types";

// Scenes never fade. The outgoing scene physically leaves while the incoming
// one is revealed: a camera push, a directional wipe, an iris or a slide.

type Empty = Record<string, never>;

const Push: React.FC<TransitionPresentationComponentProps<Empty>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return (
      <AbsoluteFill style={{ transform: `translateY(${-320 * p}px) scale(${1 - 0.05 * p})` }}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill
      style={{
        clipPath: `inset(${(1 - p) * 100}% 0 0 0 round ${(1 - p) * 80}px)`,
        transform: `scale(${1.08 - 0.08 * p})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Iris: React.FC<TransitionPresentationComponentProps<Empty>> = ({ children, presentationDirection, presentationProgress }) => {
  const p = presentationProgress;
  if (presentationDirection === "exiting") {
    return <AbsoluteFill style={{ transform: `scale(${1 + 0.15 * p})` }}>{children}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ clipPath: `circle(${p * 120}% at 50% 55%)`, transform: `scale(${1.1 - 0.1 * p})` }}>{children}</AbsoluteFill>
  );
};

const push = (): TransitionPresentation<Empty> => ({ component: Push, props: {} });
const iris = (): TransitionPresentation<Empty> => ({ component: Iris, props: {} });

export const presentationFor = (name: TransitionName, index: number): TransitionPresentation<any> => {
  switch (name) {
    case "push":
      return push();
    case "iris":
      return iris();
    case "wipe":
      return wipe({ direction: index % 2 ? "from-right" : "from-left" });
    case "slide":
    default:
      return slide({ direction: index % 2 ? "from-left" : "from-right" });
  }
};

export const transitionTiming = linearTiming({
  durationInFrames: TRANSITION_FRAMES,
  easing: Easing.bezier(0.65, 0, 0.35, 1),
});

export const DEFAULT_CYCLE: TransitionName[] = ["push", "wipe", "iris", "slide"];
