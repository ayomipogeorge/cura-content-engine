// Renders the videos.
//   npm run render                      all videos, native 4K (2160 x 3840) + 1080p upload copies
//   npm run render -- s02               only videos whose id starts with s02
//   npm run render:preview              fast 540 x 960 previews, no mastering
//   npm run render -- --best            slower, higher-quality x264 encode
//
// Output (out/):
//   <id>-4k.mp4     master, loudness-normalised to -14 LUFS / -1.5 dBTP
//   <id>-1080.mp4   1080 x 1920 copy for uploading to social platforms
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const preview = args.includes("--preview");
const best = args.includes("--best");
const only = args.find((a) => !a.startsWith("--"));
const browserExecutable = process.env.BROWSER_EXECUTABLE || undefined;

fs.mkdirSync("out", { recursive: true });

console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = (await getCompositions(serveUrl, { browserExecutable })).filter((c) => !only || c.id.startsWith(only));
if (comps.length === 0) {
  console.error(`No videos match "${only}".`);
  process.exit(1);
}

const ff = (...a) => execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...a], { stdio: "inherit" });

for (const comp of comps) {
  const raw = path.resolve("out", `${comp.id}${preview ? "-preview" : "-4k-raw"}.mp4`);
  console.log(`\n${comp.id}: ${(comp.durationInFrames / comp.fps).toFixed(1)}s`);
  let last = -1;
  await renderMedia({
    serveUrl,
    composition: comp,
    codec: "h264",
    outputLocation: raw,
    scale: preview ? 0.5 : 2,
    crf: preview ? 28 : 16,
    x264Preset: best ? "slow" : "veryfast",
    audioBitrate: "320k",
    browserExecutable,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== last) {
        last = pct;
        process.stdout.write(`  ${pct}%`);
      }
    },
  });
  process.stdout.write("\n");
  if (preview) {
    console.log(`  -> ${path.relative(process.cwd(), raw)}`);
    continue;
  }

  const master = path.resolve("out", `${comp.id}-4k.mp4`);
  const upload = path.resolve("out", `${comp.id}-1080.mp4`);
  const hasAudio = execFileSync("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", raw]).toString().trim() !== "";
  // Loudness master for social platforms; video stream copied untouched.
  if (!hasAudio) ff("-i", raw, "-c", "copy", "-movflags", "+faststart", master);
  else ff("-i", raw, "-c:v", "copy", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", master);
  // 1080 x 1920 upload copy.
  ff("-i", master, "-vf", "scale=1080:1920:flags=lanczos", "-c:v", "libx264", "-preset", best ? "slow" : "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "copy", "-movflags", "+faststart", upload);
  fs.rmSync(raw);
  console.log(`  -> ${path.relative(process.cwd(), master)}\n  -> ${path.relative(process.cwd(), upload)}`);
}
