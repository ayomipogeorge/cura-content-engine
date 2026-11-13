// Cura brand tokens, from the Cura Brand Identity Guide v1.0 (March 2026).
// Every component reads from here.
//
// Web sizes in the guide are scaled about 2.4x for a 1080 x 1920 video canvas
// (e.g. card radius 6px -> 14px, button radius 4px -> 10px, amber card
// border 4px -> 10px), so the same proportions read correctly on a phone.

const palette = {
  navy: "#0F1F3D", // Cura Navy: primary, headers, dark backgrounds
  navyMid: "#1A3260", // Navy Mid: secondary dark, dark cards
  amber: "#F59E0B", // Cura Amber: CTAs, highlights. Use sparingly.
  amberLight: "#FCD34D", // highlight
  amberPale: "#FEF3C7", // badges, tags
  white: "#FFFFFF",
  cream: "#F8F6F1", // Off-White Cream: large surfaces
  lightGrey: "#F1F5F9", // surfaces, card borders
  success: "#10B981",
  error: "#EF4444",
  bodyGrey: "#64748B",
  darkGrey: "#334155", // minimum for body text on white
} as const;

export const brand = {
  name: "Cura",
  descriptor: "Health Wallet",
  tagline: "Nigeria's Payroll-Backed Health Wallet",
  url: "getcura.co",
  palette,
  // Semantic aliases used by the scene components.
  colors: {
    ink: palette.navy, // primary text and dark scenes
    primary: palette.navy, // icons, people, key shapes
    primaryMid: palette.navyMid,
    accent: palette.amber, // highlights, CTAs (always navy text on amber)
    accentPale: palette.amberPale,
    paper: palette.cream, // light scene background
    card: palette.white,
    text: palette.darkGrey,
    muted: palette.bodyGrey,
    line: "#E2E8F0",
    alert: palette.error,
    success: palette.success,
    sun: palette.amberLight,
  },
  radius: 14, // cards
  buttonRadius: 10, // buttons: never pill-shaped, never sharp
  cardAccent: 10, // left amber border on every card (the Cura card motif)
  shadow: "0 6px 28px rgba(15, 31, 61, 0.10)", // Level 2, scaled
  shadowElevated: "0 18px 60px rgba(15, 31, 61, 0.18)", // Level 3, scaled
} as const;

// Design canvas. Everything is laid out at 1080 x 1920 and rendered with
// --scale=2 for a native 2160 x 3840 (4K vertical) master.
export const CANVAS = { width: 1080, height: 1920, fps: 30 } as const;

// Overlap between scenes, in frames (0.6 s at 30 fps), the top of the
// guide's "long, deliberate" 400-600 ms range.
export const TRANSITION_FRAMES = 18;

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
