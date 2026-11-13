// A video is a list of scenes. Each scene has a visual (one of the
// templates in src/scenes), the on-screen text and the voiceover line.

export type Tone = "neutral" | "bad" | "good";

export type Visual =
  | {
      // A grid of staff icons. Optionally a single plan card stamps onto all
      // of them, or the icons pop in one at a time.
      kind: "people";
      count: number;
      stampLabel?: string;
      popOneByOne?: boolean;
      flashOnLast?: boolean;
      shrug?: boolean;
    }
  | {
      // 2-3 large persona cards, each with need chips and an optional tag.
      kind: "personas";
      people: { name: string; detail: string; chips?: string[]; tag?: string }[];
      tagTone?: Tone;
      sameBudget?: boolean;
    }
  | {
      // Cards that enter one after another: complaints, bills, steps.
      kind: "stack";
      style: "bubbles" | "slam" | "steps";
      items: string[];
      target?: string;
    }
  | {
      // The employer dashboard: staff rows, each with its own wallet amount.
      kind: "dashboard";
      rows: { name: string; role: string; amount: number }[];
      editRow?: number;
      editTo?: number;
    }
  | {
      // Wallet cards fly to people; each picks a different plan card.
      kind: "walletsToPlans";
      people: string[];
      plans: string[];
      folder?: string;
    }
  | {
      // Plan cards fan out and get sorted by matching factors.
      kind: "planSort";
      factors: string[];
    }
  | {
      // Matched plan cards slide to two people; optional wallet drain.
      kind: "planAssign";
      people: { name: string; plan: string; benefits: string[] }[];
      drain?: boolean;
    }
  | {
      // Calendar pages flipping while a naira coin walks away.
      kind: "calendar";
      label: string;
    }
  | {
      // Phone: tap "Pay from Health Wallet", payment pulse to a provider.
      kind: "pay";
      provider: string;
    }
  | {
      // The Health Wallet card as hero: spin in, fill, or open into options.
      kind: "walletHero";
      mode: "spin" | "fill" | "menu";
      balance?: number;
      options?: string[];
    }
  | {
      // A legal or reference document with one highlighted line.
      kind: "document";
      title: string;
      lines: string[];
      highlight: number;
      pointTo?: string;
    }
  | {
      // A live-action clip (generated in Google Flow) placed in
      // public/clips/<file>. Until the file exists, a styled placeholder shows.
      kind: "clip";
      file: string;
      description: string;
    }
  | {
      // Logo, line and URL.
      kind: "end";
      line: string;
      cta: string;
    };

export type TransitionName = "push" | "wipe" | "iris" | "slide";

export interface Scene {
  id: string;
  /** Planned length in seconds. Stretched automatically to fit the voiceover. */
  seconds: number;
  /** On-screen headline. Keep to 7 words or fewer. */
  text: string;
  /** Voiceover line. Also used for burned-in captions. */
  vo: string;
  visual: Visual;
  /** How this scene hands off to the next one. */
  exit?: TransitionName;
  /** Small print shown in the scene (e.g. "Not legal advice"). */
  note?: string;
}

export interface VideoScript {
  id: string;
  title: string;
  pillar: string;
  audience: string;
  leadPlatform: string;
  /** Dark background instead of paper. */
  dark?: boolean;
  scenes: Scene[];
}
