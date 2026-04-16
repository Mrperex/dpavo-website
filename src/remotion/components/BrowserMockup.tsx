/**
 * BrowserMockup — Renders children inside a realistic browser chrome frame
 * with optional 3D perspective tilt for Apple-style product reveal.
 */
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface BrowserMockupProps {
  children: React.ReactNode;
  /** 3D rotation (degrees) */
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  /** Scale multiplier */
  scale?: number;
  /** CSS perspective value */
  perspective?: number;
  /** Whether to show the chrome toolbar */
  showChrome?: boolean;
  /** URL text in the address bar */
  url?: string;
  /** Shadow intensity 0–1 */
  shadowIntensity?: number;
  /** Glow color around the mockup */
  glowColor?: string;
}

export const BrowserMockup: React.FC<BrowserMockupProps> = ({
  children,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  scale = 1,
  perspective = 1200,
  showChrome = true,
  url = "dpavopizzeria.com",
  shadowIntensity = 0.7,
  glowColor = "rgba(236,186,35,0.15)",
}) => {
  const CHROME_H = 44;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        perspective,
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: `
            0 60px 120px rgba(0,0,0,${shadowIntensity}),
            0 20px 60px rgba(0,0,0,${shadowIntensity * 0.6}),
            0 0 80px ${glowColor},
            0 0 0 1px rgba(255,255,255,0.08)
          `,
          width: "92%",
          height: showChrome ? "88%" : "92%",
          position: "relative",
          background: "#1a1a1a",
        }}
      >
        {/* ── Browser chrome toolbar ── */}
        {showChrome && (
          <div
            style={{
              height: CHROME_H,
              backgroundColor: "#1e1e1e",
              display: "flex",
              alignItems: "center",
              paddingLeft: 18,
              paddingRight: 18,
              gap: 8,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0,
            }}
          >
            {/* Traffic lights */}
            {["#FF5F57", "#FFBD2E", "#28CA41"].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: c,
                  flexShrink: 0,
                }}
              />
            ))}

            {/* Tab */}
            <div
              style={{
                marginLeft: 16,
                height: 30,
                backgroundColor: "#2a2a2a",
                borderRadius: "8px 8px 0 0",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                gap: 8,
                maxWidth: 220,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #BD1F17, #ECBA23)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.65)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                D'Pavo Pizza
              </span>
            </div>

            {/* URL bar */}
            <div
              style={{
                flex: 1,
                marginLeft: 12,
                height: 28,
                backgroundColor: "#111",
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                paddingLeft: 12,
                paddingRight: 12,
                gap: 6,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M6 1C5 1 3 2.5 3 4.5C3 6 4 7 6 7C8 7 9 6 9 4.5C9 2.5 7 1 6 1Z"
                  stroke="rgba(40,202,65,0.8)"
                  strokeWidth="1.2"
                  fill="none"
                />
                <path d="M6 7V10" stroke="rgba(40,202,65,0.8)" strokeWidth="1.2" />
              </svg>
              <span
                style={{
                  fontFamily: "'SF Mono', monospace, system-ui",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.01em",
                }}
              >
                {url}
              </span>
            </div>
          </div>
        )}

        {/* ── Website content ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: showChrome ? `calc(100% - ${CHROME_H}px)` : "100%",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
