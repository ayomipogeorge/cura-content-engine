import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand, naira } from "../brand";
import { useProgress, useSpringIn } from "../components/anim";
import { Arrow, Card, IconCircle, Overline, Person, Pill, Tick } from "../components/primitives";
import { fonts } from "../fonts";
import type { Visual } from "../types";

const c = brand.colors;

export const StackScene: React.FC<{ v: Extract<Visual, { kind: "stack" }> }> = ({ v }) => {
  if (v.style === "bubbles") return <Bubbles items={v.items} target={v.target ?? "HR"} />;
  if (v.style === "slam") return <Slam items={v.items} />;
  return <Steps items={v.items} />;
};

const Bubbles: React.FC<{ items: string[]; target: string }> = ({ items, target }) => {
  const desk = useSpringIn(0);
  const spots = [
    { x: -220, y: -420, r: -4 },
    { x: 200, y: -300, r: 3 },
    { x: -180, y: -150, r: 2 },
    { x: 210, y: -20, r: -3 },
  ];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {items.map((t, i) => (
        <Bubble key={t} text={t} delay={6 + i * 12} spot={spots[i % spots.length]} />
      ))}
      <div style={{ position: "absolute", top: 1130, transform: `scale(${desk})` }}>
        <Card style={{ width: 520, display: "flex", alignItems: "center", gap: 28, padding: 30 }}>
          <IconCircle name="employer" size={110} />
          <div>
            <div style={{ fontSize: 46, fontWeight: 700 }}>{target}</div>
            <div style={{ fontSize: 30, color: c.muted }}>Inbox: full</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

const Bubble: React.FC<{ text: string; delay: number; spot: { x: number; y: number; r: number } }> = ({ text, delay, spot }) => {
  const frame = useCurrentFrame();
  const s = useSpringIn(delay, { damping: 10, stiffness: 170 });
  const float = Math.sin((frame + delay * 3) * 0.06) * 8;
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate(${spot.x}px, ${spot.y + float}px) scale(${s}) rotate(${spot.r}deg)`,
      }}
    >
      <div
        style={{
          background: c.card,
          borderRadius: 28,
          borderBottomLeftRadius: 6,
          padding: "26px 36px",
          fontSize: 38,
          fontWeight: 700,
          color: c.ink,
          boxShadow: brand.shadow,
          whiteSpace: "nowrap",
          borderLeft: `10px solid ${c.alert}`,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const Slam: React.FC<{ items: string[] }> = ({ items }) => {
  const frame = useCurrentFrame();
  const amounts = [850000, 620000, 400000];
  const shake = items
    .map((_, i) => 8 + i * 14)
    .reduce((acc, hit) => acc + interpolate(frame, [hit + 6, hit + 8, hit + 14], [0, 10, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), 0);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateX(${Math.sin(frame * 2.3) * shake}px)` }}>
      {items.map((t, i) => {
        const d = 8 + i * 14;
        return <SlamCard key={t} text={t} amount={amounts[i % amounts.length]} delay={d} i={i} />;
      })}
    </AbsoluteFill>
  );
};

const SlamCard: React.FC<{ text: string; amount: number; delay: number; i: number }> = ({ text, amount, delay, i }) => {
  const s = useSpringIn(delay, { damping: 14, stiffness: 220 });
  const rot = [-6, 4, -2][i % 3];
  return (
    <div
      style={{
        position: "absolute",
        top: 560 + i * 230,
        transform: `translateY(${(1 - s) * -1400}px) rotate(${rot}deg) scale(${1 + (1 - s) * 0.3})`,
      }}
    >
      <Card style={{ width: 680, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "40px 44px" }}>
        <div>
          <Overline size={24} color={c.alert}>Due now</Overline>
          <div style={{ fontSize: 46, fontWeight: 700, whiteSpace: "nowrap" }}>{text}</div>
        </div>
        <Pill tone="bad" size={34}>
          {naira(amount)}
        </Pill>
      </Card>
    </div>
  );
};

const Steps: React.FC<{ items: string[] }> = ({ items }) => {
  const line = useProgress(4, 10 + items.length * 14);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", marginTop: 60 }}>
        <div
          style={{
            position: "absolute",
            left: 47,
            top: 60,
            width: 6,
            height: (items.length - 1) * 220 * line,
            background: c.accent,
            borderRadius: 3,
          }}
        />
        {items.map((t, i) => (
          <StepRow key={t} text={t} n={i + 1} delay={6 + i * 14} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const StepRow: React.FC<{ text: string; n: number; delay: number }> = ({ text, n, delay }) => {
  const s = useSpringIn(delay);
  const tick = useProgress(delay + 8, delay + 18);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 36, height: 220, opacity: s, transform: `translateX(${(1 - s) * 120}px)` }}>
      <div style={{ position: "relative", width: 100, height: 100 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: c.ink,
            color: c.paper,
            fontSize: 46,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {n}
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: tick }}>
          <Tick size={100} progress={tick} />
        </div>
      </div>
      <Card style={{ padding: "34px 44px", width: 560 }}>
        <div style={{ fontSize: 50, fontWeight: 700 }}>{text}</div>
      </Card>
    </div>
  );
};

export const DashboardScene: React.FC<{ v: Extract<Visual, { kind: "dashboard" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(0);
  const cursorMove = useProgress(26, 52);
  const click = interpolate(frame, [54, 58, 64], [1, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const count = useProgress(60, 90);
  const editRow = v.editRow ?? -1;
  const rowH = 150;
  const total = v.rows.reduce((sum, r, i) => sum + (i === editRow && v.editTo ? r.amount + (v.editTo - r.amount) * count : r.amount), 0);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${(1 - enter) * 300}px) scale(${0.9 + enter * 0.1})`, opacity: enter, marginTop: 80, position: "relative" }}>
        <Card style={{ width: 880, padding: 44 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
            <div>
              <Overline size={24}>Employer dashboard</Overline>
              <div style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 600 }}>Team health budgets</div>
            </div>
            <Pill size={28}>Monthly</Pill>
          </div>
          {v.rows.map((r, i) => {
            const isEdit = i === editRow;
            const amount = isEdit && v.editTo ? r.amount + (v.editTo - r.amount) * count : r.amount;
            const rowIn = useRowIn(8 + i * 5);
            return (
              <div
                key={r.name}
                style={{
                  height: rowH,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: `2px solid ${c.line}`,
                  opacity: rowIn,
                  transform: `translateX(${(1 - rowIn) * 60}px)`,
                  background: isEdit && count > 0 ? `rgba(254, 243, 199, ${Math.min(1, count * 2)})` : undefined,
                  margin: "0 -20px",
                  padding: "0 20px",
                  borderRadius: 20,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <Person size={66} />
                  <div>
                    <div style={{ fontSize: 40, fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: 28, color: c.muted }}>{r.role}</div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    padding: "14px 24px",
                    border: `3px solid ${isEdit && frame > 54 ? c.accent : c.line}`,
                    borderRadius: brand.buttonRadius,
                    transform: isEdit ? `scale(${click})` : undefined,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {naira(Math.round(amount / 500) * 500)}
                </div>
              </div>
            );
          })}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${c.line}`, paddingTop: 28, fontSize: 38, fontWeight: 700 }}>
            <span>Total this month</span>
            <span style={{ color: c.ink, background: brand.palette.amberPale, padding: "4px 14px", borderRadius: 8, fontVariantNumeric: "tabular-nums" }}>{naira(Math.round(total / 500) * 500)}</span>
          </div>
        </Card>
        {editRow >= 0 ? (
          <div
            style={{
              position: "absolute",
              left: interpolate(cursorMove, [0, 1], [180, 700]),
              top: interpolate(cursorMove, [0, 1], [1050, 150 + editRow * rowH + 110]),
              transform: `scale(${click})`,
              opacity: interpolate(frame, [20, 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <svg width="70" height="70" viewBox="0 0 24 24">
              <path d="M4 2 L4 20 L9 15 L12.5 22 L15.5 20.5 L12 14 L19 14 Z" fill={c.ink} stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// Hooks must not be called conditionally; this one is called once per row in
// a fixed-length map, which is stable across frames.
const useRowIn = (delay: number) => useSpringIn(delay);

export const DocumentScene: React.FC<{ v: Extract<Visual, { kind: "document" }> }> = ({ v }) => {
  const enter = useSpringIn(0);
  const hl = useProgress(22, 40);
  const arrow = useProgress(40, 56);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `translateY(${(1 - enter) * 400}px) rotate(${(1 - enter) * -8}deg)`, opacity: enter, marginTop: 80, position: "relative" }}>
        <Card style={{ width: 820, padding: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 34 }}>
            <IconCircle name="document" size={90} />
            <div style={{ fontFamily: fonts.display, fontSize: 58, fontWeight: 700 }}>{v.title}</div>
          </div>
          {v.lines.map((l, i) => (
            <div key={l} style={{ position: "relative", padding: "20px 12px", fontSize: 38, lineHeight: 1.3, color: i === v.highlight ? c.ink : c.text, fontWeight: i === v.highlight ? 800 : 500 }}>
              {i === v.highlight ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 10,
                    bottom: 10,
                    width: `${hl * 100}%`,
                    background: brand.palette.amberLight,
                    opacity: 0.6,
                    borderRadius: 10,
                  }}
                />
              ) : null}
              <span style={{ position: "relative" }}>{l}</span>
            </div>
          ))}
        </Card>
        {v.pointTo ? (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: -170, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Arrow progress={arrow} width={160} />
            <div style={{ opacity: arrow }}>
              <Pill tone="dark" size={34}>
                {v.pointTo}
              </Pill>
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
