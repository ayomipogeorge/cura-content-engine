// Renders a contact sheet per video (one frame every N frames) for quick
// visual QA without rendering the whole video.
// Usage: node tools/contact-sheet.mjs [compositionId] [--every=45]
import { bundle } from "@remotion/bundler";
import { getCompositions, renderStill } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const only = args.find((a) => !a.startsWith("--"));
const every = Number((args.find((a) => a.startsWith("--every=")) ?? "--every=45").split("=")[1]);
const browserExecutable = process.env.BROWSER_EXECUTABLE || undefined;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const comps = (await getCompositions(serveUrl, { browserExecutable })).filter((c) => !only || c.id === only);

for (const comp of comps) {
  const dir = path.resolve("out/sheets", comp.id);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  let n = 0;
  for (let f = 0; f < comp.durationInFrames; f += every) {
    await renderStill({
      serveUrl,
      composition: comp,
      frame: f,
      output: path.join(dir, `${String(n++).padStart(3, "0")}.jpg`),
      imageFormat: "jpeg",
      scale: 0.25,
      browserExecutable,
    });
  }
  const cols = 6;
  const sheet = path.resolve("out/sheets", `${comp.id}.jpg`);
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error",
    "-framerate", "1", "-i", path.join(dir, "%03d.jpg"),
    "-vf", `tile=${cols}x${Math.ceil(n / cols)}:padding=8:color=white`,
    "-frames:v", "1", sheet,
  ]);
  console.log(`${comp.id}: ${n} frames -> ${sheet}`);
}
