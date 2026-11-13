import React from "react";
import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  CheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  HeartIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { brand, naira } from "../brand";
import { fonts } from "../fonts";

const c = brand.colors;

/** White card with the Cura 4px (scaled) left amber border. */
export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
  accent?: boolean;
}> = ({ children, style, dark, accent = true }) => (
  <div
    style={{
      background: dark ? c.primaryMid : c.card,
      color: dark ? c.card : c.ink,
      borderRadius: brand.radius,
      boxShadow: brand.shadow,
      border: dark ? "none" : `2px solid ${brand.palette.lightGrey}`,
      borderLeft: accent ? `${brand.cardAccent}px solid ${c.accent}` : undefined,
      padding: 36,
      ...style,
    }}
  >
    {children}
  </div>
);

/** DM Mono overline label, amber, tracked. */
export const Overline: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({
  children,
  size = 24,
  color = c.accent,
  style,
}) => (
  <div
    style={{
      fontFamily: fonts.mono,
      fontWeight: 500,
      fontSize: size,
      letterSpacing: size * 0.22,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Badges and status labels: pill-shaped (the guide's 20px radius). */
export const Pill: React.FC<{
  children: React.ReactNode;
  tone?: "neutral" | "bad" | "good" | "dark";
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, tone = "neutral", size = 30, style }) => {
  const palette = {
    neutral: { bg: brand.palette.amberPale, fg: c.ink },
    bad: { bg: "#FEE2E2", fg: "#B91C1C" },
    good: { bg: "#D1FAE5", fg: "#047857" },
    dark: { bg: c.ink, fg: c.card },
  }[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: `${size * 0.32}px ${size * 0.7}px`,
        borderRadius: 999,
        background: palette.bg,
        color: palette.fg,
        fontFamily: fonts.body,
        fontSize: size,
        fontWeight: 600,
        letterSpacing: 0.3,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </span>
  );
};

/** Primary button: amber fill, navy text, 4px (scaled) radius. */
export const Button: React.FC<{ children: React.ReactNode; size?: number; variant?: "primary" | "secondary" | "done"; style?: React.CSSProperties }> = ({
  children,
  size = 40,
  variant = "primary",
  style,
}) => {
  const v = {
    primary: { bg: c.accent, fg: c.ink, border: c.accent },
    secondary: { bg: "transparent", fg: c.ink, border: c.ink },
    done: { bg: c.success, fg: c.card, border: c.success },
  }[variant];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        background: v.bg,
        color: v.fg,
        border: `3px solid ${v.border}`,
        borderRadius: brand.buttonRadius,
        fontFamily: fonts.body,
        fontWeight: 600,
        fontSize: size,
        padding: `${size * 0.6}px ${size * 1.2}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** The Cura wordmark: Playfair Display Bold plus the "Health Wallet" overline. No effects. */
export const Wordmark: React.FC<{ size?: number; onDark?: boolean }> = ({ size = 120, onDark }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
    <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: size, lineHeight: 1, color: onDark ? c.accent : c.ink }}>
      {brand.name}
    </div>
    <Overline size={size * 0.13} color={onDark ? c.accent : c.ink} style={{ marginTop: size * 0.08, letterSpacing: size * 0.05 }}>
      {brand.descriptor}
    </Overline>
  </div>
);

/** A friendly, faceless staff icon in Cura navy tones. */
export const Person: React.FC<{ size?: number; color?: string }> = ({ size = 90, color = c.primary }) => (
  <svg viewBox="0 0 100 125" width={size} height={size * 1.25}>
    <circle cx="50" cy="32" r="24" fill={color} />
    <path d="M8 125 C8 80 30 66 50 66 C70 66 92 80 92 125 Z" fill={color} />
  </svg>
);

const ICONS = {
  wallet: CreditCardIcon,
  provider: BuildingStorefrontIcon,
  employer: BuildingOffice2Icon,
  document: DocumentTextIcon,
  folder: FolderOpenIcon,
  plan: ShieldCheckIcon,
  care: HeartIcon,
  check: CheckIcon,
} as const;
export type IconName = keyof typeof ICONS;

/** Heroicons outline inside a coloured circle: the Cura icon-in-circle motif. */
export const IconCircle: React.FC<{ name: IconName; size?: number; dark?: boolean }> = ({ name, size = 90, dark }) => {
  const Icon = ICONS[name];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: dark ? c.ink : brand.palette.amberPale,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon style={{ width: size * 0.5, height: size * 0.5, color: dark ? c.accent : c.ink, strokeWidth: 1.5 }} />
    </div>
  );
};

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
        borderRadius: width * 0.045,
        background: `linear-gradient(140deg, ${brand.palette.navyMid} 0%, ${brand.palette.navy} 100%)`,
        boxShadow: brand.shadowElevated,
        border: "2px solid rgba(255, 255, 255, 0.08)",
        color: c.card,
        padding: width * 0.07,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        fontFamily: fonts.body,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -width * 0.18,
          top: -width * 0.22,
          width: width * 0.62,
          height: width * 0.62,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.05)",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative" }}>
        <Overline size={width * 0.036}>Health Wallet</Overline>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: width * 0.07, color: c.accent }}>{brand.name}</div>
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontSize: width * 0.038, opacity: 0.75, marginBottom: width * 0.012 }}>Your balance</div>
        <div
          style={{
            fontSize: width * 0.1,
            fontWeight: 700,
            color: c.accent,
            fontVariantNumeric: "tabular-nums",
            filter: blurAmount ? `blur(${width * 0.018}px)` : undefined,
          }}
        >
          {balance === undefined ? naira(30000) : naira(Math.round(balance))}
        </div>
        <div style={{ fontSize: width * 0.045, fontWeight: 500, marginTop: width * 0.015 }}>{name}</div>
      </div>
    </div>
  );
};

export const PlanCard: React.FC<{
  name: string;
  benefits?: string[];
  matched?: number; // 0..1 visibility of the "Matched for you" badge
  width?: number;
  dim?: boolean;
  style?: React.CSSProperties;
}> = ({ name, benefits = ["Outpatient care", "Lab tests", "Prescriptions"], matched = 0, width = 420, dim, style }) => (
  <div
    style={{
      width,
      background: c.card,
      borderRadius: brand.radius,
      borderLeft: `${brand.cardAccent}px solid ${c.accent}`,
      boxShadow: brand.shadow,
      padding: width * 0.075,
      color: c.ink,
      opacity: dim ? 0.45 : 1,
      position: "relative",
      fontFamily: fonts.body,
      ...style,
    }}
  >
    <Overline size={width * 0.042}>HMO plan</Overline>
    <div style={{ fontFamily: fonts.display, fontSize: width * 0.095, fontWeight: 600, margin: `${width * 0.02}px 0 ${width * 0.045}px` }}>{name}</div>
    {benefits.map((b) => (
      <div key={b} style={{ display: "flex", alignItems: "center", gap: width * 0.03, fontSize: width * 0.055, color: c.text, marginBottom: width * 0.022 }}>
        <CheckIcon style={{ width: width * 0.06, height: width * 0.06, color: c.success, strokeWidth: 2.5, flexShrink: 0 }} />
        {b}
      </div>
    ))}
    {matched > 0 ? (
      <div style={{ position: "absolute", top: -width * 0.055, right: width * 0.06, opacity: matched, transform: `translateY(${(1 - matched) * 12}px)` }}>
        <Pill tone="neutral" size={width * 0.052}>
          Matched for you
        </Pill>
      </div>
    ) : null}
  </div>
);

/** Success tick in a circle (Success Green, white stroke). */
export const Tick: React.FC<{ size?: number; progress?: number; color?: string }> = ({ size = 60, progress = 1, color = c.success }) => (
  <svg viewBox="0 0 60 60" width={size} height={size}>
    <circle cx="30" cy="30" r="28" fill={color} />
    <path
      d="M17 31 L26 40 L44 21"
      fill="none"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="44"
      strokeDashoffset={44 * (1 - progress)}
    />
  </svg>
);

/** Curved callout arrow in amber. */
export const Arrow: React.FC<{ progress: number; width?: number; color?: string; flip?: boolean }> = ({ progress, width = 200, color = c.accent, flip }) => (
  <svg viewBox="0 0 200 120" width={width} height={width * 0.6} style={{ transform: flip ? "scaleX(-1)" : undefined }}>
    <path d="M10 100 C60 100 120 80 170 25" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray="220" strokeDashoffset={220 * (1 - progress)} />
    <path d="M140 22 L172 20 L168 52" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" opacity={progress > 0.85 ? 1 : 0} />
  </svg>
);
