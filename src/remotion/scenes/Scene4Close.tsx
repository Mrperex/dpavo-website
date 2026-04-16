/**
 * Scene 4 — Strong Close & CTA (frames 1110–1350 / 37–45s)
 *
 * Sequence:
 *   0–60:   Both mockups float in side by side (desktop + menu page)
 *           showing the website is multi-page and complete
 *   60–120: Mockups dissolve → dark canvas
 *   120–240: Brand close: D'PAVO logo, tagline, CTA button, contact info
 *            Gold particles intensify. Fade to black.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
  Img,
  Video,
  staticFile,
} from "remotion";
import { BrowserMockup } from "../components/BrowserMockup";
import { GlowButton } from "../components/GlowButton";
import { Particles } from "../components/Particles";

export const Scene4Close: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ PHASE 1: Dual mockup display (0–120) ═══
  const dualOpacity = interpolate(frame, [0, 25, 80, 120], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Left mockup — homepage (tilted left)
  const leftSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 55, mass: 1.2 },
  });
  const leftX = interpolate(leftSpring, [0, 1], [-600, -280]);
  const leftY = interpolate(leftSpring, [0, 1], [200, 0]);

  // Right mockup — menu page (tilted right)
  const rightSpring = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 55, mass: 1.2 },
    delay: 8,
  });
  const rightX = interpolate(rightSpring, [0, 1], [600, 280]);
  const rightY = interpolate(rightSpring, [0, 1], [200, 0]);

  // ═══ PHASE 2: Brand close (120–240) ═══
  const brandLocal = Math.max(0, frame - 100);

  const brandFadeIn = interpolate(frame, [100, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Logo
  const logoSpring = spring({
    frame: brandLocal,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.4 },
    delay: 10,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.3, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 0.3], [0, 1]);
  const logoRotate = Math.sin(brandLocal * 0.02) * 1.2;

  // Brand name
  const nameSpring = spring({
    frame: brandLocal,
    fps,
    config: { damping: 16, stiffness: 70 },
    delay: 30,
  });
  const nameY = interpolate(nameSpring, [0, 1], [40, 0]);
  const nameOpacity = interpolate(nameSpring, [0, 0.4], [0, 1]);

  // Gold lines
  const lineGrow = interpolate(brandLocal, [35, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Tagline
  const taglineOpacity = interpolate(brandLocal, [65, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const taglineBlur = interpolate(brandLocal, [65, 95], [8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Listo para lanzar?" label
  const readyOpacity = interpolate(brandLocal, [85, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phone / URL
  const contactOpacity = interpolate(brandLocal, [110, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background glow
  const glowPulse = 0.06 + Math.sin(brandLocal * 0.035) * 0.03;

  // Iris vignette
  const vignette = interpolate(brandLocal, [0, 60], [0.3, 0.55], {
    extrapolateRight: "clamp",
  });

  // Final fade to black
  const finalFade = interpolate(frame, [215, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scene fade-in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity: fadeIn, backgroundColor: "#050505" }}>

      {/* Background glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(189,31,23,${glowPulse}) 0%,
            rgba(236,186,35,${glowPulse * 0.4}) 25%,
            transparent 55%)`,
        }}
      />

      {/* Iris vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            transparent 30%,
            rgba(0,0,0,${vignette}) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Particles — intensify for the close */}
      <Particles count={40} colors={["#ECBA23", "#BD1F17", "#ffffff"]} />

      {/* ═══ PHASE 1: DUAL MOCKUPS ═══ */}
      <AbsoluteFill style={{ opacity: dualOpacity }}>
        {/* Left — Homepage */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translateX(${leftX}px) translateY(${leftY}px)`,
          }}
        >
          <BrowserMockup
            rotateX={6}
            rotateY={18}
            scale={0.48}
            perspective={1200}
            url="dpavopizzeria.com"
            shadowIntensity={0.6}
            glowColor="rgba(189,31,23,0.15)"
          >
            <Video
              src={staticFile("media/recording-homepage.mp4")}
              startFrom={60}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
          </BrowserMockup>
        </div>

        {/* Right — Menu page */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translateX(${rightX}px) translateY(${rightY}px)`,
          }}
        >
          <BrowserMockup
            rotateX={6}
            rotateY={-18}
            scale={0.48}
            perspective={1200}
            url="dpavopizzeria.com/menu"
            shadowIntensity={0.6}
            glowColor="rgba(236,186,35,0.15)"
          >
            <Video
              src={staticFile("media/recording-menu.mp4")}
              startFrom={90}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              muted
            />
          </BrowserMockup>
        </div>

        {/* "Multi-page Website" label between mockups */}
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Antonio', sans-serif",
            fontSize: 24,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            opacity: interpolate(frame, [40, 65], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Sitio Web Completo · Multi-Página
        </div>
      </AbsoluteFill>

      {/* ═══ PHASE 2: BRAND CLOSE ═══ */}
      <AbsoluteFill
        style={{
          opacity: brandFadeIn,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Logo */}
        <div
          style={{
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            opacity: logoOpacity,
            marginBottom: 28,
            filter: "drop-shadow(0 0 50px rgba(189,31,23,0.55))",
          }}
        >
          <Img
            src={staticFile("media/dpavo-logo.jpg")}
            style={{
              width: 150,
              height: 150,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #ECBA23",
              boxShadow: "0 0 50px rgba(236,186,35,0.35)",
            }}
          />
        </div>

        {/* Gold line — D'PAVO — Gold line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            transform: `translateY(${nameY}px)`,
            opacity: nameOpacity,
          }}
        >
          <div
            style={{
              width: lineGrow * 200,
              height: 2,
              backgroundColor: "#ECBA23",
              boxShadow: "0 0 10px rgba(236,186,35,0.5)",
            }}
          />
          <div
            style={{
              fontFamily: "'Antonio', sans-serif",
              fontWeight: 700,
              fontSize: 82,
              color: "#ffffff",
              letterSpacing: "0.1em",
              textShadow: "0 0 48px rgba(189,31,23,0.6)",
              whiteSpace: "nowrap",
            }}
          >
            D'<span style={{ color: "#ECBA23" }}>P</span>AVO
          </div>
          <div
            style={{
              width: lineGrow * 200,
              height: 2,
              backgroundColor: "#ECBA23",
              boxShadow: "0 0 10px rgba(236,186,35,0.5)",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 38,
            color: "#ECBA23",
            opacity: taglineOpacity,
            filter: `blur(${taglineBlur}px)`,
            marginTop: 8,
            marginBottom: 6,
          }}
        >
          Pizza, tragos y vida nocturna
        </div>

        {/* Location */}
        <div
          style={{
            fontFamily: "'Schibsted Grotesk', sans-serif",
            fontWeight: 400,
            fontSize: 17,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            opacity: taglineOpacity,
            marginBottom: 20,
          }}
        >
          Verón · Punta Cana · República Dominicana
        </div>

        {/* "Listo para lanzar?" */}
        <div
          style={{
            fontFamily: "'Schibsted Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 22,
            color: "#ffffff",
            letterSpacing: "0.06em",
            opacity: readyOpacity,
            marginBottom: 28,
          }}
        >
          ¿Listo para lanzar?
        </div>

        {/* CTA */}
        <GlowButton
          text="Aprobemos el Diseño"
          startFrame={120}
          color="#BD1F17"
          textColor="#ffffff"
          fontSize={26}
        />

        {/* Contact info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            marginTop: 30,
            opacity: contactOpacity,
          }}
        >
          <div
            style={{
              fontFamily: "'Antonio', sans-serif",
              fontSize: 24,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.15em",
            }}
          >
            (829) 753-1995
          </div>
          <div
            style={{
              fontFamily: "'Schibsted Grotesk', sans-serif",
              fontSize: 16,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.08em",
            }}
          >
            dpavopizzeria.com
          </div>
        </div>
      </AbsoluteFill>

      {/* Final black fade */}
      <AbsoluteFill
        style={{
          backgroundColor: "#000",
          opacity: finalFade,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
