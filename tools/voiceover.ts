// Generates the voiceover for every scene with Gemini's text-to-speech and
// writes src/generated/vo-manifest.json, which the videos read to time each
// scene to its voice line.
//
// Usage:
//   GEMINI_API_KEY=... npm run voiceover               # all videos
//   GEMINI_API_KEY=... npm run voiceover -- s02         # videos whose id starts with s02
//   npm run voiceover -- --force                        # regenerate even unchanged lines
//
// Get a free API key at https://aistudio.google.com/apikey
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { scripts } from "../src/scripts";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_TTS_MODEL || "gemini-2.5-flash-preview-tts";
const VOICE = process.env.CURA_VOICE || "Sulafat";
const STYLE =
  process.env.CURA_VOICE_STYLE ||
  "Read this as a warm, confident Nigerian narrator explaining something useful to a friend. Moderate pace, clear, a slight smile in the voice, never salesy:";

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.find((a) => !a.startsWith("--"));

const manifestPath = path.resolve("src/generated/vo-manifest.json");
type Entry = { file: string; seconds: number; hash: string };
const manifest: Record<string, Record<string, Entry>> = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
  : {};

const hashOf = (text: string) =>
  crypto.createHash("sha1").update(`${MODEL}|${VOICE}|${STYLE}|${text}`).digest("hex").slice(0, 12);

const probeSeconds = (file: string) =>
  Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file])
      .toString()
      .trim(),
  );

async function tts(text: string): Promise<Buffer> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY! },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE}\n${text}` }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: VOICE } } },
        },
      }),
    });
    if (res.ok) {
      const json: any = await res.json();
      const data = json?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData)?.inlineData?.data;
      if (!data) throw new Error(`No audio in response: ${JSON.stringify(json).slice(0, 300)}`);
      return Buffer.from(data, "base64");
    }
    const body = await res.text();
    if (res.status === 429 && /per.?day|PerDay|daily/i.test(body)) {
      throw new Error(
        "Gemini's free daily text-to-speech quota is used up. It resets at midnight Pacific time (9am in Lagos). " +
          "Lines already generated are saved in the repo, so the next run only creates the missing ones.\n" + body.slice(0, 600),
      );
    }
    if (res.status === 429 || res.status >= 500) {
      const wait = 15000 * attempt;
      console.warn(`  ${res.status}, retrying in ${wait / 1000}s: ${body.slice(0, 200).replace(/\s+/g, " ")}`);
      await new Promise((r) => setTimeout(r, wait));
      continue;
    }
    throw new Error(`Gemini TTS ${res.status}: ${body.slice(0, 400)}`);
  }
  throw new Error("Gemini TTS: still rate-limited after 4 tries. Wait a few minutes and run again; finished lines are kept.");
}

async function main() {
  if (!API_KEY) {
    console.log("GEMINI_API_KEY is not set: skipping voiceover. Videos will render with captions and timing estimates.");
    return;
  }
  for (const script of scripts.filter((s) => !only || s.id.startsWith(only))) {
    console.log(`\n${script.id}`);
    const dir = path.resolve("public/vo", script.id);
    fs.mkdirSync(dir, { recursive: true });
    manifest[script.id] ??= {};
    for (const scene of script.scenes) {
      const rel = `vo/${script.id}/${scene.id}.wav`;
      const abs = path.resolve("public", rel);
      const hash = hashOf(scene.vo);
      const existing = manifest[script.id][scene.id];
      if (!force && existing?.hash === hash && fs.existsSync(abs)) {
        console.log(`  ${scene.id}: unchanged`);
        continue;
      }
      const pcm = await tts(scene.vo);
      const raw = abs.replace(/\.wav$/, ".pcm");
      fs.writeFileSync(raw, pcm);
      // Gemini returns 24 kHz, 16-bit mono PCM. Wrap it as WAV and trim
      // leading/trailing silence so scene timing is tight.
      execFileSync("ffmpeg", [
        "-y", "-loglevel", "error",
        "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", raw,
        "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse",
        "-ar", "48000", abs,
      ]);
      fs.rmSync(raw);
      const seconds = probeSeconds(abs);
      manifest[script.id][scene.id] = { file: rel, seconds: Math.round(seconds * 1000) / 1000, hash };
      console.log(`  ${scene.id}: ${seconds.toFixed(2)}s`);
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
    }
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nManifest written to ${path.relative(process.cwd(), manifestPath)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
