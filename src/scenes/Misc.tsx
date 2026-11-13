import React from "react";
import { AbsoluteFill, OffthreadVideo, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { useSpringIn } from "../components/anim";
import { CuraMark } from "../components/primitives";
import type { Visual } from "../types";

const c = brand.colors;

const hasStatic = (path: string) => getStaticFiles().some((f) => f.name === path);

export const ClipScene: React.FC<{ v: Extract<Visual, { kind: "clip" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const path = `clips/${v.file}`;
  const zoom = 1.06 + frame * 0.0012;
  if (hasStatic(path)) {
    return (
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <OffthreadVideo src={staticFile(path)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(12,43,39,0.55) 0%, rgba(12,43,39,0) 30%, rgba(12,43,39,0) 65%, rgba(12,43,39,0.7) 100%)" }} />
      </AbsoluteFill>
    );
  }
  // Placeholder until the Flow clip is added to public/clips.
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, #15473F 0%, ${c.ink} 70%)`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 760, padding: 50, borderRadius: brand.radius, border: `4px dashed rgba(245,242,234,0.35)`, color: c.paper, textAlign: "center", transform: `scale(${zoom - 0.06})` }}>
        <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 3, color: c.accent }}>FLOW CLIP</div>
        <div style={{ fontSize: 42, fontWeight: 700, marginTop: 20, lineHeight: 1.3 }}>{v.description}</div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.6 }}>Add public/clips/{v.file}</div>
      </div>
    </AbsoluteFill>
  );
};

export const EndScene: React.FC<{ v: Extract<Visual, { kind: "end" }>; dark?: boolean }> = ({ v, dark }) => {
  const frame = useCurrentFrame();
  const logo = useSpringIn(0, { damping: 12 });
  const line = useSpringIn(10);
  const cta = useSpringIn(20, { damping: 11, stiffness: 170 });
  const breathe = 1 + Math.sin(frame * 0.12) * 0.02;
  return (
    <AbsoluteFill style={{ background: dark ? c.ink : c.paper, alignItems: "center", justifyContent: "center", gap: 70 }}>
      <div style={{ transform: `scale(${logo * 1.6})` }}>
        <CuraMark size={90} light={dark} />
      </div>
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          letterSpacing: -2,
          textAlign: "center",
          maxWidth: 880,
          lineHeight: 1.08,
          color: dark ? c.paper : c.ink,
          opacity: line,
          transform: `translateY(${(1 - line) * 60}px)`,
        }}
      >
        {v.line}
      </div>
      <div style={{ transform: `scale(${cta * breathe})`, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ background: c.accent, color: c.ink, fontSize: 48, fontWeight: 800, padding: "30px 60px", borderRadius: 999 }}>{v.cta}</div>
        <div style={{ fontSize: 46, fontWeight: 700, color: dark ? c.paper : c.primary, opacity: interpolate(frame, [26, 36], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          {brand.url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
