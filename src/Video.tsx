import React from "react";
import { AbsoluteFill, Audio, Sequence, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { fontFamily } from "./fonts";
import { brand, CANVAS, TRANSITION_FRAMES } from "./brand";
import { useSpringIn } from "./components/anim";
import { DashboardScene, DocumentScene, StackScene } from "./scenes/Stack";
import { PeopleScene, PersonasScene } from "./scenes/People";
import { CalendarScene, PayScene, PlanAssignScene, PlanSortScene, WalletHeroScene, WalletsToPlansScene } from "./scenes/Wallet";
import { ClipScene, EndScene } from "./scenes/Misc";
import { getVo, sceneFrames, voSeconds } from "./timing";
import { DEFAULT_CYCLE, presentationFor, transitionTiming } from "./transitions";
import type { Scene, VideoScript, Visual } from "./types";

const c = brand.colors;
const hasStatic = (path: string) => getStaticFiles().some((f) => f.name === path);

const VisualFor: React.FC<{ v: Visual; dark?: boolean }> = ({ v, dark }) => {
  switch (v.kind) {
    case "people":
      return <PeopleScene v={v} />;
    case "personas":
      return <PersonasScene v={v} />;
    case "stack":
      return <StackScene v={v} />;
    case "dashboard":
      return <DashboardScene v={v} />;
    case "document":
      return <DocumentScene v={v} />;
    case "walletsToPlans":
      return <WalletsToPlansScene v={v} />;
    case "planSort":
      return <PlanSortScene v={v} />;
    case "planAssign":
      return <PlanAssignScene v={v} />;
    case "walletHero":
      return <WalletHeroScene v={v} />;
    case "pay":
      return <PayScene v={v} />;
    case "calendar":
      return <CalendarScene v={v} />;
    case "clip":
      return <ClipScene v={v} />;
    case "end":
      return <EndScene v={v} dark={dark} />;
  }
};

/** When the voiceover starts inside a scene: after the incoming transition. */
const voStartFor = (index: number) => (index === 0 ? 6 : TRANSITION_FRAMES);

const Backdrop: React.FC<{ dark?: boolean }> = ({ dark }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: dark ? c.ink : c.paper, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          left: -300 + Math.sin(frame * 0.01) * 40,
          top: -260 + Math.cos(frame * 0.012) * 30,
          background: dark ? "rgba(47,210,154,0.10)" : "rgba(15,107,87,0.07)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          right: -280 + Math.cos(frame * 0.009) * 40,
          bottom: -200 + Math.sin(frame * 0.011) * 30,
          background: dark ? "rgba(244,181,63,0.08)" : "rgba(244,181,63,0.10)",
        }}
      />
    </AbsoluteFill>
  );
};

const Headline: React.FC<{ text: string; delay: number; dark?: boolean; overMedia?: boolean }> = ({ text, delay, dark, overMedia }) => {
  const words = text.split(" ");
  return (
    <div
      style={{
        position: "absolute",
        top: 190,
        left: 70,
        right: 70,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 22px",
        fontSize: 92,
        fontWeight: 800,
        letterSpacing: -2.5,
        lineHeight: 1.05,
        color: dark || overMedia ? c.paper : c.ink,
        textAlign: "center",
        textShadow: overMedia ? "0 4px 30px rgba(0,0,0,0.35)" : undefined,
      }}
    >
      {words.map((w, i) => (
        <Word key={i} word={w} delay={delay + i * 3} />
      ))}
    </div>
  );
};

const Word: React.FC<{ word: string; delay: number }> = ({ word, delay }) => {
  const s = useSpringIn(delay, { damping: 14, stiffness: 150 });
  return (
    <span style={{ display: "inline-block", overflow: "hidden", paddingBottom: 8 }}>
      <span style={{ display: "inline-block", transform: `translateY(${(1 - s) * 110}%)` }}>{word}</span>
    </span>
  );
};

const Captions: React.FC<{ text: string; start: number; frames: number; dark?: boolean }> = ({ text, start, frames }) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/);
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += 5) chunks.push(words.slice(i, i + 5));
  const local = frame - start;
  if (local < 0 || local > frames + 10) return null;
  const perWord = frames / words.length;
  let index = 0;
  let acc = 0;
  for (let i = 0; i < chunks.length; i++) {
    acc += chunks[i].length * perWord;
    if (local < acc) {
      index = i;
      break;
    }
    index = i;
  }
  const chunkStart = chunks.slice(0, index).reduce((n, ch) => n + ch.length, 0) * perWord;
  const pop = interpolate(local - chunkStart, [0, 5], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 230, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          background: "rgba(12, 43, 39, 0.88)",
          color: c.paper,
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.25,
          padding: "18px 34px",
          borderRadius: 26,
          textAlign: "center",
          transform: `scale(${pop})`,
          maxWidth: 900,
        }}
      >
        {chunks[index].join(" ")}
      </div>
    </div>
  );
};

const SceneFrame: React.FC<{ script: VideoScript; scene: Scene; index: number; frames: number }> = ({ script, scene, index, frames }) => {
  const voStart = voStartFor(index);
  const vo = getVo(script.id, scene.id);
  const voFrames = Math.round(voSeconds(script.id, scene) * CANVAS.fps);
  const isEnd = scene.visual.kind === "end";
  const isClip = scene.visual.kind === "clip";
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Backdrop dark={script.dark} />
      <VisualFor v={scene.visual} dark={script.dark} />
      {!isEnd ? <Headline text={scene.text} delay={index === 0 ? 2 : TRANSITION_FRAMES - 4} dark={script.dark} overMedia={isClip} /> : null}
      {scene.note ? (
        <div style={{ position: "absolute", bottom: 150, left: 0, right: 0, textAlign: "center", fontSize: 28, color: script.dark ? c.paper : c.muted, opacity: 0.85 }}>
          {scene.note}
        </div>
      ) : null}
      <Captions text={scene.vo} start={voStart} frames={voFrames} />
      {vo && hasStatic(vo.file) ? (
        <Sequence from={voStart} durationInFrames={frames - voStart} layout="none">
          <Audio src={staticFile(vo.file)} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};

export const CuraVideo: React.FC<{ script: VideoScript }> = ({ script }) => {
  const frames = script.scenes.map((s) => sceneFrames(script.id, s));
  const starts: number[] = [];
  frames.reduce((acc, f, i) => {
    starts[i] = acc;
    return acc + f - TRANSITION_FRAMES;
  }, 0);
  const sfx = hasStatic("sfx/whoosh.wav");
  return (
    <AbsoluteFill style={{ background: script.dark ? c.ink : c.paper }}>
      <TransitionSeries>
        {script.scenes.map((scene, i) => {
          const items = [
            <TransitionSeries.Sequence key={`s-${scene.id}`} durationInFrames={frames[i]}>
              <SceneFrame script={script} scene={scene} index={i} frames={frames[i]} />
            </TransitionSeries.Sequence>,
          ];
          if (i < script.scenes.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`t-${scene.id}`}
                presentation={presentationFor(scene.exit ?? DEFAULT_CYCLE[i % DEFAULT_CYCLE.length], i)}
                timing={transitionTiming}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {sfx ? (
        <>
          {hasStatic("sfx/bed.wav") ? <Audio src={staticFile("sfx/bed.wav")} volume={0.12} loop /> : null}
          {starts.slice(1).map((s, i) => (
            <Sequence key={`w-${i}`} from={Math.max(0, s - 2)} durationInFrames={30} layout="none">
              <Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} />
            </Sequence>
          ))}
          {script.scenes.map((scene, i) =>
            scene.visual.kind === "pay" ? (
              <React.Fragment key={`pay-${i}`}>
                <Sequence from={starts[i] + 26} durationInFrames={15} layout="none">
                  <Audio src={staticFile("sfx/click.wav")} volume={0.5} />
                </Sequence>
                <Sequence from={starts[i] + 60} durationInFrames={45} layout="none">
                  <Audio src={staticFile("sfx/paid.wav")} volume={0.45} />
                </Sequence>
              </React.Fragment>
            ) : null,
          )}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
