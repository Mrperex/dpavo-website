/**
 * Scene 3 — Menu Page Deep Dive (frames 750–1110 / 25–37s)
 *
 * Sequence:
 *   0–30:   Slide transition from left — menu page in 3D mockup
 *   30–120: Camera orbits while menu recording shows hero + filter clicks
 *   120–240: Callouts highlight: category tabs, food cards, WhatsApp CTA, prices
 *   240–360: Camera pulls back, slight upward tilt for grandeur
 *
 * Uses recording-menu.mp4 which shows live filter tab interactions.
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

export const Scene3Sections: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const TOTAL = 360;

  // ═══ ENTRANCE — slide in from left ═══
  const enterSpring = spring({
    frame,
    fps,
    config: { damping: 22, stiffness: 50, mass: 1.4 },
  });
  const enterX = interpolate(enterSpring, [0, 1], [-1200, 0]);

  // ═══ CAMERA ORBIT ═══
  // Slowly orbits right → comes back left
  const rotateY = interpolate(
    frame,
    [0, 90, 200, 300, TOTAL],
    [15, 6, -6, -10, -8],
    { extrapolateRight: "clamp" }
  );
  const rotateX = interpolate(
    frame,
    [0, 90, 200, 300, TOTAL],
    [5, 3, 4, 8, 7],
    { extrapolateRight: "clamp" }
  );

  // Scale: starts medium, grows slightly during highlight, pulls back
  const mockupScale = interpolate(
    frame,
    [0, 60, 150, 280, TOTAL],
    [0.68, 0.74, 0.80, 0.72, 0.68],
    { extrapolateRight: "clamp" }
  );

  // Background glow follows orbit
  const glowX = interpolate(rotateY, [-10, 15], [65, 35]);
  const glowPulse = 0.05 + Math.sin(frame * 0.03) * 0.03;

  // Scene envelope
  const fadeIn = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [335, TOTAL], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Section label transitions
  const menuLabel = interpolate(frame, [40, 65, 140, 165], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const filterLabel = interpolate(frame, [130, 155, 260, 285], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fullMenuLabel = interpolate(frame, [260, 285, 330, TOTAL], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", opacity: fadeIn * fadeOut }}>
      {/* Background glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at ${glowX}% 50%,
            rgba(236,186,35,${glowPulse}) 0%,
            rgba(189,31,23,${glowPulse * 0.5}) 30%,
            transparent 60%)`,
        }}
      />

      <Particles count={15} colors={["#ECBA23", "#BD1F17"]} />

      {/* ═══ 3D BROWSER MOCKUP ═══ */}
      <AbsoluteFill
        style={{
          transform: `translateX(${enterX}px)`,
        }}
      >
        <BrowserMockup
          rotateX={rotateX}
          rotateY={rotateY}
          scale={mockupScale}
          perspective={1300}
          url="dpavopizzeria.com/menu"
          shadowIntensity={0.7}
          glowColor="rgba(236,186,35,0.15)"
        >
          <Video
            src={staticFile("media/recording-menu.mp4")}
            startFrom={0}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            muted
          />
        </BrowserMockup>
      </AbsoluteFill>

      {/* ═══ CALLOUT ANNOTATIONS ═══ */}

      {/* Filter tabs */}
      <Callout
        text="Filtros — Pizza, Mariscos, Picaderas, Bebidas"
        targetX={450}
        targetY={340}
        labelX={100}
        labelY={260}
        startFrame={120}
        holdFrames={100}
        color="#BD1F17"
        side="right"
      />

      {/* Featured card */}
      <Callout
        text="Diseño de Cards Premium"
        targetX={410}
        targetY={560}
        labelX={100}
        labelY={620}
        startFrame={165}
        holdFrames={85}
        color="#ECBA23"
        side="right"
      />

      {/* WhatsApp CTA */}
      <Callout
        text="Pedidos por WhatsApp — 1 Click"
        targetX={410}
        targetY={740}
        labelX={100}
        labelY={770}
        startFrame={210}
        holdFrames={80}
        color="#28CA41"
        side="right"
      />

      {/* Pricing */}
      <Callout
        text="Precios Claros — RD$"
        targetX={830}
        targetY={640}
        labelX={1200}
        labelY={580}
        startFrame={250}
        holdFrames={75}
        color="#ECBA23"
        side="left"
      />

      {/* ═══ SECTION LABELS ═══ */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 60,
          opacity: menuLabel,
          fontFamily: "'Antonio', sans-serif",
          fontSize: 22,
          color: "#ECBA23",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 22px",
          borderRadius: 4,
          borderLeft: "3px solid #ECBA23",
          backdropFilter: "blur(8px)",
        }}
      >
        Página de Menú
      </div>

      <div
        style={{
          position: "absolute",
          top: 36,
          left: 60,
          opacity: filterLabel,
          fontFamily: "'Antonio', sans-serif",
          fontSize: 22,
          color: "#ffffff",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 22px",
          borderRadius: 4,
          borderLeft: "3px solid #BD1F17",
          backdropFilter: "blur(8px)",
        }}
      >
        Filtros Interactivos
      </div>

      <div
        style={{
          position: "absolute",
          top: 36,
          left: 60,
          opacity: fullMenuLabel,
          fontFamily: "'Antonio', sans-serif",
          fontSize: 22,
          color: "#ffffff",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          background: "rgba(0,0,0,0.7)",
          padding: "10px 22px",
          borderRadius: 4,
          borderLeft: "3px solid #BD1F17",
          backdropFilter: "blur(8px)",
        }}
      >
        Carta Completa
      </div>

      {/* Floor reflection */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "12%",
          right: "12%",
          height: 110,
          background: `linear-gradient(to bottom,
            rgba(236,186,35,${glowPulse * 1.8}) 0%,
            transparent 100%)`,
          filter: "blur(45px)",
          opacity: 0.4,
        }}
      />
    </AbsoluteFill>
  );
};
