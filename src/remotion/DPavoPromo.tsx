/**
 * DPavoPromo — Premium 45-second website showcase composition
 *
 * Frame budget (30fps, 1350 total):
 *   Scene 1 — Hook & 3D Reveal:   frames    0–270  (0–9s)
 *   Scene 2 — Hero Camera Orbit:  frames  270–750  (9–25s)
 *   Scene 3 — Menu Deep Dive:     frames  750–1110 (25–37s)
 *   Scene 4 — Close & CTA:        frames 1110–1350 (37–45s)
 *
 * Techniques:
 *   - 3D perspective browser mockup (BrowserMockup component)
 *   - Cinematic camera orbit (interpolated rotateX/Y)
 *   - Callout annotations with leader lines
 *   - Live website recordings (Playwright → MP4)
 *   - Particle effects + floor reflections
 *   - Professional fade transitions between scenes
 *
 * Assets:
 *   - public/media/recording-homepage.mp4  (npm run record:website)
 *   - public/media/recording-menu.mp4      (npm run record:website)
 *   - public/media/dpavo-promo-music.mp3   (download from Pixabay)
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  Audio,
  staticFile,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Scene1Intro } from "./scenes/Scene1Intro";
import { Scene2Hero } from "./scenes/Scene2Hero";
import { Scene3Sections } from "./scenes/Scene3Sections";
import { Scene4Close } from "./scenes/Scene4Close";

/** Set to false if you haven't placed dpavo-promo-music.mp3 yet */
const HAS_MUSIC = true;

export const DPavoPromo: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  const musicVolume = (frame: number) => {
    const fadeIn = 60;
    const fadeOutStart = durationInFrames - 75;
    if (frame < fadeIn)
      return interpolate(frame, [0, fadeIn], [0, 0.65]);
    if (frame > fadeOutStart)
      return interpolate(frame, [fadeOutStart, durationInFrames], [0.65, 0]);
    return 0.65;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>

      {/* ── Background music ── */}
      {HAS_MUSIC && (
        <Audio
          src={staticFile("media/dpavo-promo-music.mp3")}
          startFrom={0}
          volume={musicVolume}
        />
      )}

      {/* ── Scene 1 — Hook & 3D Reveal (0–9s) ── */}
      <Sequence from={0} durationInFrames={280}>
        <Scene1Intro />
      </Sequence>

      {/* ── Scene 2 — Hero Camera Orbit (9–25s) ── */}
      <Sequence from={270} durationInFrames={490}>
        <Scene2Hero />
      </Sequence>

      {/* ── Scene 3 — Menu Deep Dive (25–37s) ── */}
      <Sequence from={750} durationInFrames={370}>
        <Scene3Sections />
      </Sequence>

      {/* ── Scene 4 — Close & CTA (37–45s) ── */}
      <Sequence from={1110} durationInFrames={240}>
        <Scene4Close />
      </Sequence>

    </AbsoluteFill>
  );
};
