import React from "react";
import { brand, naira } from "../brand";

const c = brand.colors;

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
}> = ({ children, style, dark }) => (
  <div
    style={{
      background: dark ? c.ink : c.card,
      color: dark ? c.paper : c.ink,
      borderRadius: brand.radius,
      boxShadow: brand.shadow,
      padding: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "neutral" | "bad" | "good" | "dark";
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, tone = "neutral", size = 30, style }) => {
  const palette = {
    neutral: { bg: "#EAF1EE", fg: c.primary },
    bad: { bg: "#FDE4DF", fg: "#B23A26" },
    good: { bg: "#D6F7EA", fg: "#0B6E4C" },
    dark: { bg: c.ink, fg: c.paper },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: `${size * 0.35}px ${size * 0.7}px`,
        borderRadius: 999,
        background: palette.bg,
        color: palette.fg,
        fontSize: size,
        fontWeight: 700,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** A friendly, faceless staff icon. */
export const Person: React.FC<{ size?: number; color?: string; badge?: string; badgeTone?: "bad" | "good" }> = ({
  size = 90,
  color = c.primary,
  badge,
  badgeTone = "bad",
}) => (
  <div style={{ position: "relative", width: size, height: size * 1.25 }}>
    <svg viewBox="0 0 100 125" width={size} height={size * 1.25}>
      <circle cx="50" cy="32" r="24" fill={color} />
      <path d="M8 125 C8 80 30 66 50 66 C70 66 92 80 92 125 Z" fill={color} />
    </svg>
    {badge ? (
      <div
        style={{
          position: "absolute",
          right: -size * 0.1,
          top: -size * 0.05,
          width: size * 0.42,
          height: size * 0.42,
          borderRadius: "50%",
          background: badgeTone === "bad" ? c.alert : c.accent,
          border: `${Math.max(3, size * 0.05)}px solid ${c.paper}`,
          color: "white",
          fontSize: size * 0.24,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {badge}
      </div>
    ) : null}
  </div>
);

export const CuraMark: React.FC<{ size?: number; light?: boolean }> = ({ size = 64, light }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.3,
        background: light ? c.accent : c.primary,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg viewBox="0 0 40 40" width={size * 0.62} height={size * 0.62}>
        <path
          d="M20 33 C10 26 6 20 6 14.5 C6 10 9.5 7 13.5 7 C16.5 7 18.7 8.8 20 11 C21.3 8.8 23.5 7 26.5 7 C30.5 7 34 10 34 14.5 C34 20 30 26 20 33 Z"
          fill={light ? c.ink : c.paper}
        />
      </svg>
    </div>
    <span style={{ fontSize: size * 0.72, fontWeight: 800, letterSpacing: -1, color: light ? c.paper : c.ink }}>
      {brand.name}
    </span>
  </div>
);

export const WalletCard: React.FC<{
  name?: string;
  balance?: number;
  width?: number;
  blurAmount?: boolean;
  style?: React.CSSProperties;
}> = ({ name = "Health Wallet", balance, width = 560, blurAmount, style }) => {
  const h = width * 0.6;
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.07,
        background: `linear-gradient(135deg, ${c.primary} 0%, #0A4A3D 100%)`,
        boxShadow: brand.shadow,
        color: c.paper,
        padding: width * 0.07,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -width * 0.15,
          top: -width * 0.2,
          width: width * 0.6,
          height: width * 0.6,
          borderRadius: "50%",
          background: "rgba(47, 210, 154, 0.18)",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: width * 0.05, fontWeight: 700, opacity: 0.85 }}>Health Wallet</span>
        <CuraMark size={width * 0.075} light />
      </div>
      <div>
        <div style={{ fontSize: width * 0.04, opacity: 0.7, marginBottom: width * 0.01 }}>Balance</div>
        <div
          style={{
            fontSize: width * 0.105,
            fontWeight: 800,
            letterSpacing: -1,
            filter: blurAmount ? `blur(${width * 0.018}px)` : undefined,
          }}
        >
          {balance === undefined ? naira(30000) : naira(Math.round(balance))}
        </div>
        <div style={{ fontSize: width * 0.045, fontWeight: 600, marginTop: width * 0.015 }}>{name}</div>
      </div>
    </div>
  );
};

export const PlanCard: React.FC<{
  name: string;
  benefits?: string[];
  matched?: number; // 0..1 visibility of the "Matched for you" tag
  width?: number;
  dim?: boolean;
  style?: React.CSSProperties;
}> = ({ name, benefits = ["Outpatient care", "Lab tests", "Prescriptions"], matched = 0, width = 420, dim, style }) => (
  <div
    style={{
      width,
      background: c.card,
      borderRadius: width * 0.08,
      boxShadow: brand.shadow,
      padding: width * 0.075,
      color: c.ink,
      opacity: dim ? 0.45 : 1,
      position: "relative",
      ...style,
    }}
  >
    <div style={{ fontSize: width * 0.045, color: c.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
      HMO plan
    </div>
    <div style={{ fontSize: width * 0.095, fontWeight: 800, letterSpacing: -0.5, margin: `${width * 0.015}px 0 ${width * 0.04}px` }}>
      {name}
    </div>
    {benefits.map((b) => (
      <div key={b} style={{ display: "flex", alignItems: "center", gap: width * 0.03, fontSize: width * 0.055, marginBottom: width * 0.02 }}>
        <span
          style={{
            width: width * 0.05,
            height: width * 0.05,
            borderRadius: "50%",
            background: c.accent,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {b}
      </div>
    ))}
    {matched > 0 ? (
      <div
        style={{
          position: "absolute",
          top: -width * 0.06,
          right: width * 0.06,
          transform: `scale(${matched})`,
          transformOrigin: "center",
        }}
      >
        <Pill tone="good" size={width * 0.055}>
          Matched for you
        </Pill>
      </div>
    ) : null}
  </div>
);

/** A soft tick inside a circle. */
export const Tick: React.FC<{ size?: number; progress?: number; color?: string }> = ({
  size = 60,
  progress = 1,
  color = c.accent,
}) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <circle cx="30" cy="30" r="28" fill={color} />
    <path
      d="M17 31 L26 40 L44 21"
      fill="none"
      stroke="white"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="44"
      strokeDashoffset={44 * (1 - progress)}
    />
  </svg>
);

/** Curved arrow used for callouts. */
export const Arrow: React.FC<{ progress: number; width?: number; color?: string; flip?: boolean }> = ({
  progress,
  width = 200,
  color = brand.colors.sun,
  flip,
}) => (
  <svg viewBox="0 0 200 120" width={width} height={width * 0.6} style={{ transform: flip ? "scaleX(-1)" : undefined }}>
    <path
      d="M10 100 C60 100 120 80 170 25"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      strokeDasharray="220"
      strokeDashoffset={220 * (1 - progress)}
    />
    <path
      d="M140 22 L172 20 L168 52"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={progress > 0.85 ? 1 : 0}
    />
  </svg>
);
