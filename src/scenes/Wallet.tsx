import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { brand, naira } from "../brand";
import { lerp, useProgress, useSpringIn } from "../components/anim";
import { Card, Person, PlanCard, Pill, Tick, WalletCard } from "../components/primitives";
import type { Visual } from "../types";

const c = brand.colors;

export const WalletsToPlansScene: React.FC<{ v: Extract<Visual, { kind: "walletsToPlans" }> }> = ({ v }) => {
  const n = v.people.length;
  const colW = 320;
  const startX = (1080 - colW * n) / 2;
  const foldP = useProgress(150, 175);
  const fold = v.folder ? foldP : 0;
  const folderIn = useSpringIn(v.folder ? 140 : 99999);
  return (
    <AbsoluteFill>
      {v.people.map((p, i) => (
        <Column key={p} name={p} plan={v.plans[i % v.plans.length]} i={i} x={startX + i * colW} w={colW} fold={fold} />
      ))}
      {v.folder ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1290, display: "flex", justifyContent: "center", transform: `scale(${folderIn})` }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 24, padding: "28px 40px" }}>
            <div style={{ width: 70, height: 56, borderRadius: 10, background: c.sun }} />
            <div style={{ fontSize: 42, fontWeight: 800 }}>{v.folder}</div>
            <Tick size={52} progress={fold} />
          </Card>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Column: React.FC<{ name: string; plan: string; i: number; x: number; w: number; fold: number }> = ({ name, plan, i, x, w, fold }) => {
  const frame = useCurrentFrame();
  const personIn = useSpringIn(i * 4);
  const fly = useProgress(10 + i * 6, 34 + i * 6);
  const planIn = useSpringIn(50 + i * 10, { damping: 13 });
  const matched = useSpringIn(66 + i * 10, { damping: 10, stiffness: 180 });
  const walletY = lerp(520, 1010, fly);
  const walletScale = lerp(1, 0.42, fly);
  const walletOpacity = interpolate(frame, [36 + i * 6, 44 + i * 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = interpolate(frame, [34 + i * 6, 40 + i * 6, 52 + i * 6], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <div style={{ position: "absolute", left: x + w / 2 - 140, top: walletY, transform: `scale(${walletScale}) rotate(${(1 - fly) * (i - 1) * 6}deg)`, opacity: walletOpacity, transformOrigin: "center" }}>
        <WalletCard width={280} name={name} balance={30000} />
      </div>
      <div
        style={{
          position: "absolute",
          left: x,
          width: w,
          top: 1000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${personIn})`,
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -30, borderRadius: "50%", background: c.accent, opacity: glow * 0.35, filter: "blur(20px)" }} />
          <Person size={120} />
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, marginTop: 14 }}>{name}</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: x + (w - 310) / 2,
          top: lerp(500, 540, planIn),
          opacity: planIn * (1 - fold),
          transform: `translateY(${(1 - planIn) * 120 + fold * 700}px) scale(${1 - fold * 0.7})`,
        }}
      >
        <PlanCard name={plan} width={310} matched={matched} benefits={["Chosen by " + name, "Licensed HMO"]} />
      </div>
    </>
  );
};

export const PlanSortScene: React.FC<{ v: Extract<Visual, { kind: "planSort" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const fan = useSpringIn(0, { damping: 14 });
  const names = ["Essential", "Family Plus", "Chronic Care", "Premium", "Starter", "Senior"];
  const keep = [0, 1];
  const sort = useProgress(20 + v.factors.length * 14, 30 + v.factors.length * 14 + 24);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
        {v.factors.map((f, i) => (
          <FactorChip key={f} label={f} delay={14 + i * 14} />
        ))}
      </div>
      {names.map((nm, i) => {
        const angle = (i - (names.length - 1) / 2) * 9 * fan;
        const isKeep = keep.includes(i);
        const fanX = 540 - 190 + (i - (names.length - 1) / 2) * 60 * fan;
        const fanY = 720 + Math.abs(i - (names.length - 1) / 2) * 18;
        const keepIndex = keep.indexOf(i);
        const targetX = isKeep ? (keepIndex === 0 ? 90 : 610) : fanX + (i < 3 ? -900 : 900);
        const targetY = isKeep ? 660 : fanY + 200;
        const x = lerp(fanX, targetX, sort);
        const y = lerp(fanY, targetY, sort);
        const shuffle = Math.sin((frame + i * 13) * 0.25) * 18 * (1 - sort) * interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={nm}
            style={{
              position: "absolute",
              left: x,
              top: y + shuffle,
              transform: `rotate(${lerp(angle, 0, sort)}deg)`,
              zIndex: isKeep ? 2 : 1,
              opacity: isKeep ? 1 : 1 - sort * 0.9,
            }}
          >
            <PlanCard name={nm} width={380} matched={isKeep ? sort : 0} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const FactorChip: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const s = useSpringIn(delay, { damping: 11, stiffness: 170 });
  return (
    <div style={{ transform: `translateY(${(1 - s) * -200}px)`, opacity: s }}>
      <Pill tone="dark" size={34}>
        {label}
      </Pill>
    </div>
  );
};

export const PlanAssignScene: React.FC<{ v: Extract<Visual, { kind: "planAssign" }> }> = ({ v }) => {
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 70, marginTop: 80 }}>
        {v.people.map((p, i) => (
          <AssignColumn key={p.name} p={p} i={i} drain={Boolean(v.drain)} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const AssignColumn: React.FC<{ p: { name: string; plan: string; benefits: string[] }; i: number; drain: boolean }> = ({ p, i, drain }) => {
  const frame = useCurrentFrame();
  const slide = useSpringIn(drain ? 0 : 6 + i * 10, { damping: 15 });
  const matched = useSpringIn(drain ? 0 : 24 + i * 10, { damping: 10, stiffness: 180 });
  const press = drain ? interpolate(frame, [18 + i * 12, 22 + i * 12, 30 + i * 12], [1, 0.9, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const chosenP = useProgress(24 + i * 12, 36 + i * 12);
  const chosen = drain ? chosenP : 0;
  const fromX = i === 0 ? 300 : -300;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
      <div style={{ transform: `translateX(${(1 - slide) * fromX}px) rotate(${(1 - slide) * (i === 0 ? 8 : -8)}deg)`, opacity: slide }}>
        <PlanCard name={p.plan} benefits={p.benefits} width={400} matched={matched} />
      </div>
      <div
        style={{
          padding: "22px 0",
          width: 400,
          textAlign: "center",
          borderRadius: 999,
          background: chosen > 0.5 ? c.accent : c.ink,
          color: chosen > 0.5 ? c.ink : c.paper,
          fontSize: 40,
          fontWeight: 800,
          transform: `scale(${press})`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 14,
        }}
      >
        {chosen > 0.5 ? (
          <>
            <Tick size={46} progress={chosen} color={c.ink} /> Chosen
          </>
        ) : (
          "Choose"
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <Person size={90} />
        <div style={{ fontSize: 44, fontWeight: 800 }}>{p.name}</div>
      </div>
    </div>
  );
};

export const WalletHeroScene: React.FC<{ v: Extract<Visual, { kind: "walletHero" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const spin = useSpringIn(0, { damping: 13, stiffness: 90 });
  const fill = useProgress(14, 70);
  const menu = useSpringIn(8, { damping: 15 });
  const target = v.balance ?? 30000;
  const balance = v.mode === "spin" ? 0 : v.mode === "fill" ? target * fill : target;
  const rotY = v.mode === "spin" ? (1 - spin) * 200 : 0;
  const cardY = v.mode === "menu" ? lerp(0, -220, menu) : 0;
  const options = v.options ?? [];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 2000 }}>
      {v.mode === "fill" ? <CoinStream progress={fill} /> : null}
      <div style={{ transform: `translateY(${cardY + 60}px) rotateY(${rotY}deg) scale(${v.mode === "spin" ? 0.6 + spin * 0.4 : 1})` }}>
        <WalletCard width={720} balance={balance} name="Your name" />
      </div>
      {v.mode === "menu" ? (
        <div style={{ position: "absolute", top: 1180, display: "flex", gap: 28 }}>
          {options.map((o, i) => (
            <OptionTile key={o} label={o} delay={20 + i * 8} />
          ))}
        </div>
      ) : null}
      {v.mode === "fill" ? (
        <div style={{ position: "absolute", top: 520, opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Card style={{ display: "flex", alignItems: "center", gap: 20, padding: "24px 34px" }}>
            <div style={{ width: 56, height: 70, borderRadius: 10, background: c.primary }} />
            <div style={{ fontSize: 40, fontWeight: 800 }}>Your employer</div>
          </Card>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const CoinStream: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  if (progress <= 0 || progress >= 1) return null;
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => {
        const t = ((frame * 0.05 + i / 8) % 1);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 - 30 + Math.sin(i * 2.1) * 60,
              top: lerp(640, 900, t),
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: c.sun,
              color: c.ink,
              fontSize: 34,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: Math.sin(t * Math.PI),
            }}
          >
            {"₦"}
          </div>
        );
      })}
    </>
  );
};

const OptionTile: React.FC<{ label: string; delay: number }> = ({ label, delay }) => {
  const s = useSpringIn(delay, { damping: 12, stiffness: 160 });
  return (
    <div style={{ transform: `translateY(${(1 - s) * 200}px)`, opacity: s }}>
      <Card style={{ width: 290, padding: 32, display: "flex", flexDirection: "column", gap: 18, alignItems: "flex-start" }}>
        <div style={{ width: 70, height: 70, borderRadius: 20, background: "#D6F7EA" }} />
        <div style={{ fontSize: 40, fontWeight: 800 }}>{label}</div>
      </Card>
    </div>
  );
};

export const PayScene: React.FC<{ v: Extract<Visual, { kind: "pay" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const phoneIn = useSpringIn(0);
  const tapAt = 26;
  const tap = interpolate(frame, [tapAt, tapAt + 4, tapAt + 10], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ripple = interpolate(frame, [tapAt, tapAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = useProgress(tapAt + 8, tapAt + 34);
  const paid = useSpringIn(tapAt + 34, { damping: 10, stiffness: 160 });
  const tick = useProgress(tapAt + 38, tapAt + 50);
  const shopIn = useSpringIn(6);
  // Payment path from phone button to provider card.
  const p0 = { x: 330, y: 1240 };
  const p1 = { x: 560, y: 600 };
  const p2 = { x: 760, y: 640 };
  const bez = (t: number) => ({
    x: (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x,
    y: (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y,
  });
  const head = bez(pulse);
  return (
    <AbsoluteFill>
      <svg width="1080" height="1920" style={{ position: "absolute", inset: 0 }}>
        <path
          d={`M${p0.x} ${p0.y} Q${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
          fill="none"
          stroke={c.accent}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="1200"
          strokeDashoffset={1200 * (1 - pulse)}
          opacity={0.9}
        />
      </svg>
      {pulse > 0 && pulse < 1 ? (
        <div style={{ position: "absolute", left: head.x - 26, top: head.y - 26, width: 52, height: 52, borderRadius: "50%", background: c.accent, boxShadow: `0 0 40px ${c.accent}` }} />
      ) : null}
      <div style={{ position: "absolute", left: 90, top: 560, transform: `translateY(${(1 - phoneIn) * 500}px) rotate(-4deg)` }}>
        <div style={{ width: 460, height: 900, borderRadius: 70, background: c.ink, padding: 22, boxShadow: brand.shadow }}>
          <div style={{ width: "100%", height: "100%", borderRadius: 52, background: c.paper, padding: 34, display: "flex", flexDirection: "column", gap: 26 }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: c.muted }}>{v.provider}</div>
            <div style={{ fontSize: 44, fontWeight: 800 }}>Amount due</div>
            <div style={{ fontSize: 76, fontWeight: 800, letterSpacing: -1 }}>{naira(4500)}</div>
            <WalletCard width={392} balance={30000} name="Health Wallet" />
            <div style={{ flex: 1 }} />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: 300,
                  height: 300,
                  marginLeft: -150,
                  marginTop: -150,
                  borderRadius: "50%",
                  border: `6px solid ${c.accent}`,
                  transform: `scale(${ripple})`,
                  opacity: (1 - ripple) * (frame >= tapAt ? 1 : 0),
                }}
              />
              <div style={{ background: c.primary, color: c.paper, borderRadius: 999, padding: "26px 0", textAlign: "center", fontSize: 32, fontWeight: 800, transform: `scale(${tap})` }}>
                Pay from Health Wallet
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 600, top: 470, transform: `scale(${shopIn})` }}>
        <Card style={{ width: 400, padding: 34, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ height: 120, borderRadius: 24, background: `repeating-linear-gradient(90deg, ${c.primary} 0 50px, ${c.accent} 50px 100px)` }} />
          <div style={{ fontSize: 40, fontWeight: 800 }}>{v.provider}</div>
          <div style={{ fontSize: 28, color: c.muted }}>Verified provider</div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 600, top: 900, transform: `scale(${paid})`, transformOrigin: "left center" }}>
        <Card style={{ display: "flex", alignItems: "center", gap: 22, padding: "28px 36px" }}>
          <Tick size={80} progress={tick} />
          <div>
            <div style={{ fontSize: 52, fontWeight: 800 }}>Paid</div>
            <div style={{ fontSize: 30, color: c.muted }}>Today, 10:42</div>
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const CalendarScene: React.FC<{ v: Extract<Visual, { kind: "calendar" }> }> = ({ v }) => {
  const frame = useCurrentFrame();
  const enter = useSpringIn(0);
  const days = Math.min(90, Math.floor(interpolate(frame, [8, 90], [1, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const flip = (frame % 8) / 8;
  const walk = useProgress(10, 120);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 160, top: 560, transform: `scale(${enter})` }}>
        <div style={{ width: 520, height: 560, perspective: 1600, position: "relative" }}>
          <Card style={{ position: "absolute", inset: 0, padding: 0, overflow: "hidden" }}>
            <div style={{ height: 120, background: c.alert }} />
            <div style={{ fontSize: 220, fontWeight: 800, textAlign: "center", marginTop: 60, fontVariantNumeric: "tabular-nums" }}>{days}</div>
            <div style={{ fontSize: 40, textAlign: "center", color: c.muted, fontWeight: 700 }}>days waiting</div>
          </Card>
          {days < 90 ? (
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: 280,
                background: c.card,
                borderRadius: `${brand.radius}px ${brand.radius}px 0 0`,
                transformOrigin: "top",
                transform: `rotateX(${flip * 110}deg)`,
                opacity: 1 - flip,
                borderBottom: `2px solid ${c.line}`,
              }}
            />
          ) : null}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: lerp(720, 1000, walk),
          top: lerp(860, 760, walk) + Math.abs(Math.sin(frame * 0.5)) * -16,
          transform: `scale(${lerp(1, 0.45, walk)})`,
        }}
      >
        <div style={{ width: 150, height: 150, borderRadius: "50%", background: c.sun, color: c.ink, fontSize: 90, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: brand.shadow }}>
          {"₦"}
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", opacity: enter }}>
        <Pill tone="bad" size={40}>
          {v.label}
        </Pill>
      </div>
    </AbsoluteFill>
  );
};
