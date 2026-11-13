import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

/** Spring from 0 to 1 starting at `delay` frames. */
export const useSpringIn = (delay = 0, config: { damping?: number; stiffness?: number; mass?: number } = {}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 120, mass: 0.8, ...config },
  });
};

/** Eased 0..1 progress between two frames. */
export const useProgress = (from: number, to: number, easing = Easing.bezier(0.33, 0, 0.15, 1)) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Slow continuous drift so no frame is ever fully static. */
export const useDrift = (amount = 6, speed = 0.02) => {
  const frame = useCurrentFrame();
  return {
    x: Math.sin(frame * speed) * amount,
    y: Math.cos(frame * speed * 0.8) * amount * 0.6,
  };
};
