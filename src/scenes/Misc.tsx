import React from "react";
import { AbsoluteFill, OffthreadVideo, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { useEnter } from "../components/anim";
import { Button, Overline, Wordmark } from "../components/primitives";
import { fonts } from "../fonts";
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
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(15,31,61,0.55) 0%, rgba(15,31,61,0) 30%, rgba(15,31,61,0) 65%, rgba(15,31,61,0.7) 100%)" }} />
      </AbsoluteFill>
    );
  }
  // Placeholder until the Flow clip is added to public/clips.
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${brand.palette.navyMid} 0%, ${c.ink} 70%)`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 760, padding: 50, borderRadius: brand.radius, border: `4px dashed rgba(248,246,241,0.35)`, color: c.paper, fontFamily: fonts.body, textAlign: "center", transform: `scale(${zoom - 0.06})` }}>
        <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: 3, color: c.accent }}>FLOW CLIP</div>
        <div style={{ fontSize: 42, fontWeight: 700, marginTop: 20, lineHeight: 1.3 }}>{v.description}</div>
        <div style={{ fontSize: 28, marginTop: 24, opacity: 0.6 }}>Add public/clips/{v.file}</div>
      </div>
    </AbsoluteFill>
  );
};

export const EndScene: React.FC<{ v: Extract<Visual, { kind: "end" }>; dark?: boolean }> = ({ v }) => {
  const frame = useCurrentFrame();
  const logo = useEnter(0, 16);
  const line = useEnter(10, 16);
  const cta = useEnter(20, 14);
  const url = useEnter(28, 12);
  // End cards always use the navy "footer" of the brand's dark sandwich.
  return (
    <AbsoluteFill style={{ background: c.ink, alignItems: "center", justifyContent: "center", gap: 80, fontFamily: fonts.body }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          right: -380,
          top: -260 + frame * 0.3,
          background: "rgba(26, 50, 96, 0.75)",
        }}
      />
      <div style={{ opacity: logo, transform: `translateY(${(1 - logo) * 30}px)` }}>
        <Wordmark size={190} onDark />
      </div>
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 84,
          fontWeight: 700,
          textAlign: "center",
          maxWidth: 880,
          lineHeight: 1.12,
          color: c.card,
          opacity: line,
          transform: `translateY(${(1 - line) * 40}px)`,
        }}
      >
        {v.line}
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ opacity: cta, transform: `translateY(${(1 - cta) * 30}px)` }}>
          <Button size={46}>{v.cta}</Button>
        </div>
        <Overline size={34} style={{ opacity: url, letterSpacing: 8 }}>
          {brand.url}
        </Overline>
      </div>
    </AbsoluteFill>
  );
};
