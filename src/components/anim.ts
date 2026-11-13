import { Easing, interpolate, useCurrentFrame } from "remotion";

// Motion follows the Cura Brand Guide (section 10): purposeful and calm.
// Enter: ease-out (0, 0, 0.2, 1). Exit: ease-in (0.4, 0, 1, 1).
// Emphasis: ease-in-out (0.4, 0, 0.2, 1). Never linear, bounce or elastic,
// so nothing here overshoots.

export const EASE_OUT = Easing.bezier(0, 0, 0.2, 1);
export const EASE_IN = Easing.bezier(0.4, 0, 1, 1);
export const EASE_IN_OUT = Easing.bezier(0.4, 0, 0.2, 1);

/** Entrance from 0 to 1 starting at `delay`, over `frames` (default 14 = ~470 ms). */
export const useEnter = (delay = 0, frames = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + frames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_OUT,
  });
};

/**
 * Kept for the scene components: same signature as before, now a calm
 * ease-out entrance with no overshoot. `config` is accepted and ignored.
 */
export const useSpringIn = (delay = 0, _config: Record<string, number> = {}) => useEnter(delay, 14);

/** Eased 0..1 progress between two frames (emphasis curve by default). */
export const useProgress = (from: number, to: number, easing = EASE_IN_OUT) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A short emphasis pulse (1 -> peak -> 1), used for success states and taps. */
export const usePulse = (at: number, peak = 1.04, frames = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [at, at + frames / 2, at + frames], [1, peak, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE_IN_OUT,
  });
};
