/**
 * Scene 2 — Hero Showcase with 3D Camera Orbit (frames 270–750 / 9–25s)
 *
 * Sequence:
 *   0–60:   Mockup rotates from left tilt to center (camera settles)
 *   60–180: Slow orbit right while homepage recording scrolls through hero.
 *           Callout annotations highlight: Nav, CTAs, hero image
 *   180–300: Perspective flattens → full-screen immersion (no chrome)
 *            Recording continues naturally through categories/story
 *   300–480: Camera pulls back, mockup re-tilts slightly for depth
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Video,
  staticFile,
} from "remotion";
import { BrowserMockup } from "../components/BrowserMockup";
import { Callout } from "../components/Callout";
import { Particles } from "../components/Particles";

export const Scene2Hero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ CAMERA ORBIT ═══
  // Phase 1 (0–180): orbit from left to center-right
  // Phase 2 (180–300): flatten to full-screen
  // Phase 3 (300–480): pull back with subtle tilt

  const rotateY = interpolate(
    frame,
    [0, 60, 180, 240, 300, 480],
    [-12, -5, 8, 3, -4, -6],
    { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
  );
  const rotateX = interpolate(
    frame,
    [0, 60, 180, 240, 300, 480],
    [8, 5, 2, 0, 4, 6],
    { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
  );

  // Mockup scale: starts at showcase size, goes full-screen, then back
  const mockupScale = interpolate(
    frame,
    [0, 60, 180, 260, 320, 480],
    [0.72, 0.78, 0.85, 1.15, 0.75, 0.70],
    { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) }
  );

  // Chrome visibility: hide during full-screen immersion
  const showChrome = frame < 200 || frame > 310;

  // Perspective value — gets more dramatic during orbit
  const perspective = interpolate(frame, [0, 180, 300], [1400, 1000, 1300], {
    extrapolateRight: "clamp",
  });

  // During full-screen immersion, flatten rotation
  const immersionBlend = interpolate(frame, [200, 260, 290, 340], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const finalRotateX = rotateX * (1 - immersionBlend);
  const finalRotateY = rotateY * (1 - immersionBlend);

  // Background glow follows rotation
  const glowX = interpolate(rotateY, [-12, 8], [35, 65]);
  const glowPulse = 0.06 + Math.sin(frame * 0.025) * 0.03;

  // Scene envelope
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [455, 480], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Website Design" label during immersion
  const designLabelOpacity = interpolate(frame, [220, 250, 280, 310], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", opacity: fadeIn * fadeOut }}>
      {/* Dynamic background glow that follows the orbit */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${glowX}% 55%,
            rgba(189,31,23,${glowPulse}) 0%,
            rgba(236,186,35,${glowPulse * 0.4}) 25%,
            transparent 60%)`,
        }}
      />

      <Particles count={12} colors={["#ECBA23"]} />

      {/* ═══ 3D BROWSER MOCKUP ═══ */}
      <AbsoluteFill>
        <BrowserMockup
          rotateX={finalRotateX}
          rotateY={finalRotateY}
          scale={mockupScale}
          perspective={perspective}
          showChrome={showChrome}
          url="dpavopizzeria.com"
          shadowIntensity={0.65}
          glowColor={`rgba(236,186,35,${0.1 + immersionBlend * 0.05})`}
        >
          <Video
            src={staticFile("media/recording-homepage.mp4")}
            startFrom={270}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </BrowserMockup>
      </AbsoluteFill>

      {/* ═══ CALLOUT ANNOTATIONS (Phase 1: orbit) ═══ */}

      {/* Navigation bar */}
      <Callout
        text="Navegación Premium"
        targetX={960}
        targetY={115}
        labelX={1100}
        labelY={60}
        startFrame={50}
        holdFrames={100}
        color="#ECBA23"
        side="left"
      />

      {/* WhatsApp CTA */}
      <Callout
        text="CTA — Ordena por WhatsApp"
        targetX={1380}
        targetY={115}
        labelX={1100}
        labelY={155}
        startFrame={80}
        holdFrames={85}
        color="#28CA41"
        side="left"
      />

      {/* Hero heading */}
      <Callout
        text="Tipografía D'Pavo — Antonio Bold"
        targetX={500}
        targetY={360}
        labelX={150}
        labelY={440}
        startFrame={110}
        holdFrames={80}
        color="#ECBA23"
        side="right"
      />

      {/* Main CTA buttons */}
      <Callout
        text="CTAs Duales — Menú & Eventos"
        targetX={560}
        targetY={530}
        labelX={140}
        labelY={570}
        startFrame={140}
        holdFrames={70}
        color="#BD1F17"
        side="right"
      />

      {/* "Diseño Responsive" label during full-screen phase */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          right: 80,
          opacity: designLabelOpacity,
          fontFamily: "'Antonio', sans-serif",
          fontSize: 28,
          color: "#ECBA23",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          textShadow: "0 2px 12px rgba(0,0,0,0.8)",
        }}
      >
        Diseño Premium
      </div>

      {/* Floor reflection */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "10%",
          right: "10%",
          height: 100,
          background: `linear-gradient(to bottom,
            rgba(189,31,23,${glowPulse * 1.5}) 0%,
            transparent 100%)`,
          filter: "blur(50px)",
          opacity: 0.5 * (1 - immersionBlend),
        }}
      />
    </AbsoluteFill>
  );
};
