// Cura brand tokens. Placeholder palette: swap these values once the
// official brand colours, logo and fonts are confirmed. Every component
// reads from here, so one edit restyles every video.

export const brand = {
  name: "Cura",
  url: "getcura.co",
  colors: {
    ink: "#0C2B27", // primary dark (text, dark scenes)
    primary: "#0F6B57", // "Cura primary": deep health green
    accent: "#2FD29A", // "Cura accent": mint for positive moments, "Paid"
    paper: "#F5F2EA", // warm off-white background
    card: "#FFFFFF",
    muted: "#6B7F7A",
    line: "#DCE3DF",
    alert: "#F2674F", // problems, "Not covered"
    sun: "#F4B53F", // highlights, money
  },
  radius: 36,
  shadow: "0 30px 60px rgba(12, 43, 39, 0.16), 0 6px 14px rgba(12, 43, 39, 0.08)",
} as const;

// Design canvas. Everything is laid out at 1080 x 1920 and rendered with
// --scale=2 for a native 2160 x 3840 (4K vertical) master.
export const CANVAS = { width: 1080, height: 1920, fps: 30 } as const;

// Overlap between scenes, in frames (0.6 s at 30 fps). The incoming scene's
// visuals start moving during this window; its voiceover starts after it.
export const TRANSITION_FRAMES = 18;

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
