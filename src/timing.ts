import voManifest from "./generated/vo-manifest.json";
import { CANVAS, TRANSITION_FRAMES } from "./brand";
import type { Scene, VideoScript } from "./types";

type VoEntry = { file: string; seconds: number };
type VoManifest = Record<string, Record<string, VoEntry>>;

const manifest = voManifest as VoManifest;

// Estimated speaking rate when no recorded voiceover exists yet.
const WORDS_PER_SECOND = 2.6;
// Breathing room after each voiceover line, in seconds.
const VO_TAIL = 0.45;

export const getVo = (scriptId: string, sceneId: string): VoEntry | undefined =>
  manifest[scriptId]?.[sceneId];

export const voSeconds = (scriptId: string, scene: Scene): number => {
  const vo = getVo(scriptId, scene.id);
  if (vo) return vo.seconds;
  const words = scene.vo.trim().split(/\s+/).length;
  return words / WORDS_PER_SECOND;
};

/**
 * Frames for one scene. The voiceover starts after the incoming transition
 * (TRANSITION_FRAMES), so the visuals always lead the voice.
 */
export const sceneFrames = (scriptId: string, scene: Scene): number => {
  const fps = CANVAS.fps;
  const needed = Math.ceil((voSeconds(scriptId, scene) + VO_TAIL) * fps) + TRANSITION_FRAMES;
  const planned = Math.round(scene.seconds * fps);
  return Math.max(needed, planned, TRANSITION_FRAMES * 2 + 1);
};

export const videoFrames = (script: VideoScript): number => {
  const total = script.scenes.reduce((sum, s) => sum + sceneFrames(script.id, s), 0);
  return total - TRANSITION_FRAMES * (script.scenes.length - 1);
};
