/**
 * Scene 1 — The Hook & 3D Reveal (frames 0–270 / 0–9s)
 *
 * Sequence:
 *   0–60:   Black → "Your brand. Elevated." text fades in (problem/hook)
 *   60–90:  Text fades out
 *   90–240: Website emerges from darkness in 3D perspective tilt,
 *           slowly rotating into view inside a browser mockup
 *   240–270: Hold + subtle orbit
 *
 * The website recording plays live inside the 3D browser frame,
 * showing real hero CSS animations firing.
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
import { Particles } from "../components/Particles";

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ PHASE 1: Hook text (0–90) ═══
  const hookOpacity = interpolate(frame, [10, 35, 65, 90], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookY = interpolate(frame, [10, 35], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const hookBlur = interpolate(frame, [10, 35], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ═══ PHASE 2: 3D website reveal (90–270) ═══
  const revealLocal = Math.max(0, frame - 90);
  const revealSpring = spring({
    frame: revealLocal,
    fps,
    config: { damping: 28, stiffness: 45, mass: 1.8 },
  });

  // Mockup emerges from below + rotated
  const mockupY = interpolate(revealSpring, [0, 1], [600, 0]);
  const mockupOpacity = interpolate(revealLocal, [0, 40], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 3D rotation: starts tilted, slowly settles + gentle orbit
  const baseRotateX = interpolate(revealSpring, [0, 1], [25, 8]);
  const baseRotateY = interpolate(revealSpring, [0, 1], [-30, -12]);
  // Subtle continuous orbit after settling
  const orbitY = frame > 180
    ? Math.sin((frame - 180) * 0.015) * 3
    : 0;
  const orbitX = frame > 180
    ? Math.sin((frame - 180) * 0.012) * 1.5
    : 0;

  const finalRotateX = baseRotateX + orbitX;
  const finalRotateY = baseRotateY + orbitY;

  // Scale: starts small, grows to showcase size
  const mockupScale = interpolate(revealSpring, [0, 1], [0.55, 0.72]);

  // Background glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.03),
    [-1, 1],
    [0.03, 0.08]
  );

  // Scene fade-out
  const fadeOut = interpolate(frame, [250, 270], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", opacity: fadeOut }}>
      {/* Background radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 60%,
            rgba(189,31,23,${glowIntensity}) 0%,
            rgba(236,186,35,${glowIntensity * 0.5}) 30%,
            transparent 65%)`,
        }}
      />

      {/* Particles — sparse, cinematic */}
      <Particles count={18} colors={["#ECBA23", "#BD1F17", "#ffffff"]} />

      {/* ═══ PHASE 1: Hook text ═══ */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          opacity: hookOpacity,
          transform: `translateY(${hookY}px)`,
          filter: `blur(${hookBlur}px)`,
        }}
      >
        <div
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 32,
            color: "#ECBA23",
            letterSpacing: "0.06em",
            marginBottom: 16,
          }}
        >
          Presentamos
        </div>
        <div
          style={{
            fontFamily: "'Antonio', sans-serif",
            fontWeight: 700,
            fontSize: 72,
            color: "#ffffff",
            letterSpacing: "0.08em",
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          D'<span style={{ color: "#ECBA23" }}>P</span>AVO PIZZA
        </div>
        <div
          style={{
            fontFamily: "'Schibsted Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: 14,
          }}
        >
          Experiencia Digital
        </div>
      </AbsoluteFill>

      {/* ═══ PHASE 2: 3D Browser Reveal ═══ */}
      <AbsoluteFill
        style={{
          opacity: mockupOpacity,
          transform: `translateY(${mockupY}px)`,
        }}
      >
        <BrowserMockup
          rotateX={finalRotateX}
          rotateY={finalRotateY}
          scale={mockupScale}
          perspective={1400}
          url="dpavopizzeria.com"
          shadowIntensity={0.8}
          glowColor="rgba(189,31,23,0.2)"
        >
          <Video
            src={staticFile("media/recording-homepage.mp4")}
            startFrom={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </BrowserMockup>
      </AbsoluteFill>

      {/* Floor reflection hint */}
      {mockupOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "15%",
            right: "15%",
            height: 120,
            background: `linear-gradient(to bottom,
              rgba(189,31,23,${glowIntensity * 2}) 0%,
              transparent 100%)`,
            filter: "blur(40px)",
            opacity: mockupOpacity * 0.4,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
