// Generates Cura's small sound kit with ffmpeg: no stock libraries, no
// licences to track. Output goes to public/sfx/.
import { execFileSync } from "node:child_process";
import fs from "node:fs";

fs.mkdirSync("public/sfx", { recursive: true });

const make = (name, filter, duration) => {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-filter_complex", filter, "-t", String(duration), "-ar", "48000", "-ac", "2", `public/sfx/${name}.wav`]);
  console.log(`public/sfx/${name}.wav`);
};

// Soft air whoosh for scene handoffs.
make(
  "whoosh",
  "anoisesrc=d=0.7:c=pink:a=0.5,highpass=f=250,lowpass=f=3500,afade=t=in:d=0.3:curve=qsin,afade=t=out:st=0.32:d=0.38:curve=qsin,volume=0.8",
  0.7,
);

// No UI tap or "paid" tones: the Cura brand guide (section 10) rules out
// sound effects for interactions. Only a transition air and a quiet bed.

// Warm, quiet ambient bed (A major pad with slow movement), 90 s, looped in the video.
make(
  "bed",
  [
    "sine=f=110:d=90[s1]",
    "sine=f=164.81:d=90[s2]",
    "sine=f=220:d=90[s3]",
    "sine=f=277.18:d=90[s4]",
    "[s1][s2][s3][s4]amix=inputs=4:normalize=0,tremolo=f=0.15:d=0.35,lowpass=f=900,volume=0.12,afade=t=in:d=3,afade=t=out:st=86:d=4",
  ].join(";"),
  90,
);
