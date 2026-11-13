import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand } from "../brand";
import { useSpringIn } from "../components/anim";
import { Card, PlanCard, Person, Pill, WalletCard } from "../components/primitives";
import type { Tone, Visual } from "../types";

const c = brand.colors;

export const PeopleScene: React.FC<{ v: Extract<Visual, { kind: "people" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const cols = v.count > 20 ? 8 : v.count > 6 ? 4 : v.count;
  const size = v.count > 20 ? 78 : v.count > 6 ? 120 : 150;
  const gap = v.count > 20 ? 26 : 44;

  const stampDrop = useSpringIn(10, { damping: 12, stiffness: 140 });
  const stampAt = 24;
  const stampPulse = interpolate(frame, [stampAt, stampAt + 4, stampAt + 12], [1, 0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const lastPop = v.popOneByOne ? (v.count - 1) * 8 : 0;
  const flash = v.flashOnLast
    ? interpolate(frame, [lastPop + 4, lastPop + 9, lastPop + 24], [0, 0.22, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <AbsoluteFill style={{ background: c.accent, opacity: flash }} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, ${size}px)`,
          gap,
          marginTop: v.stampLabel ? 260 : 120,
        }}
      >
        {Array.from({ length: v.count }).map((_, i) => {
          const row = Math.floor(i / cols);
          const col = i % cols;
          const popDelay = v.popOneByOne ? i * 8 : row * 2 + col;
          return (
            <PersonCell
              key={i}
              index={i}
              size={size}
              popDelay={popDelay}
              badgeDelay={v.stampLabel ? stampAt + (row + col) * 2 : null}
              shrug={Boolean(v.shrug) && i % 3 === 1}
            />
          );
        })}
      </div>
      {v.stampLabel ? (
        <div
          style={{
            position: "absolute",
            top: 330,
            transform: `translateY(${interpolate(stampDrop, [0, 1], [-500, 0])}px) scale(${stampPulse})`,
          }}
        >
          <PlanCard name={v.stampLabel} width={360} benefits={["Same cover", "For everyone"]} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const PersonCell: React.FC<{
  index: number;
  size: number;
  popDelay: number;
  badgeDelay: number | null;
  shrug: boolean;
}> = ({ index, size, popDelay, badgeDelay, shrug }) => {
  const frame = useCurrentFrame();
  const pop = useSpringIn(popDelay, { damping: 11, stiffness: 160 });
  const badge = useSpringIn(badgeDelay ?? 99999, { damping: 12 });
  const tilt = shrug ? interpolate(frame, [50, 62], [0, index % 2 ? 9 : -9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const tones = [c.primary, c.primaryMid, "#24427A", c.primary];
  return (
    <div
      style={{
        transform: `scale(${pop}) rotate(${tilt}deg)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Person size={size} color={tones[index % tones.length]} />
      {badgeDelay !== null ? (
        <div
          style={{
            marginTop: size * 0.08,
            width: size * 0.8,
            height: size * 0.22,
            borderRadius: size * 0.06,
            background: c.line,
            transform: `scale(${badge})`,
          }}
        />
      ) : null}
      {shrug ? (
        <div style={{ position: "absolute", top: -size * 0.35, opacity: interpolate(frame, [58, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Pill tone="bad" size={size * 0.22}>
            ?
          </Pill>
        </div>
      ) : null}
    </div>
  );
};

export const PersonasScene: React.FC<{ v: Extract<Visual, { kind: "personas" }> }> = ({ v }) => {
  const n = v.people.length;
  const width = n === 3 ? 300 : 420;
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: n === 3 ? 30 : 60, alignItems: "flex-start", marginTop: 80 }}>
        {v.people.map((p, i) => (
          <React.Fragment key={p.name}>
            {v.sameBudget && i === 1 ? (
              <div
                style={{
                  alignSelf: "center",
                  fontSize: 110,
                  fontWeight: 700,
                  color: c.accent,
                  opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                }}
              >
                =
              </div>
            ) : null}
            <PersonaCard p={p} i={i} width={width} tone={v.tagTone ?? "neutral"} sameBudget={v.sameBudget} />
          </React.Fragment>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const PersonaCard: React.FC<{
  p: { name: string; detail: string; chips?: string[]; tag?: string };
  i: number;
  width: number;
  tone: Tone;
  sameBudget?: boolean;
}> = ({ p, i, width, tone, sameBudget }) => {
  const enter = useSpringIn(i * 6);
  const tag = useSpringIn(22 + i * 8, { damping: 10, stiffness: 180 });
  return (
    <div
      style={{
        transform: `translateY(${(1 - enter) * 260}px)`,
        opacity: enter,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 26,
      }}
    >
      <Card style={{ width, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, position: "relative" }}>
        <Person size={width * 0.38} />
        <div style={{ fontSize: width * 0.1, fontWeight: 700, textAlign: "center" }}>{p.name}</div>
        <div style={{ fontSize: width * 0.075, color: c.muted }}>{p.detail}</div>
        {p.chips ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {p.chips.map((chip, k) => (
              <ChipIn key={chip} delay={10 + i * 6 + k * 5} label={chip} size={width * 0.075} />
            ))}
          </div>
        ) : null}
        {p.tag ? (
          <div style={{ position: "absolute", top: -26, transform: `scale(${tag}) rotate(${(i - 1) * 3}deg)` }}>
            <Pill tone={tone === "bad" ? "bad" : tone === "good" ? "good" : "neutral"} size={width * 0.075}>
              {p.tag}
            </Pill>
          </div>
        ) : null}
      </Card>
      {sameBudget ? <WalletCard width={width} blurAmount name={p.name} /> : null}
    </div>
  );
};

const ChipIn: React.FC<{ delay: number; label: string; size: number }> = ({ delay, label, size }) => {
  const s = useSpringIn(delay, { damping: 12, stiffness: 170 });
  return (
    <div style={{ transform: `scale(${s})` }}>
      <Pill size={size}>{label}</Pill>
    </div>
  );
};
