/**
 * Callout — Animated annotation label with a leader line pointing to a UI element.
 * Used to highlight key features during the website showcase.
 */
import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

interface CalloutProps {
  /** Label text */
  text: string;
  /** Position of the dot (target UI element) */
  targetX: number;
  targetY: number;
  /** Position of the label box */
  labelX: number;
  labelY: number;
  /** Frame when this callout appears */
  startFrame: number;
  /** How long the callout stays fully visible (frames) */
  holdFrames?: number;
  /** Accent color */
  color?: string;
  /** Which side the line originates from: "left" | "right" */
  side?: "left" | "right";
}

export const Callout: React.FC<CalloutProps> = ({
  text,
  targetX,
  targetY,
  labelX,
  labelY,
  startFrame,
  holdFrames = 120,
  color = "#ECBA23",
  side = "left",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = Math.max(0, frame - startFrame);

  // Entrance spring
  const enterSpring = spring({
    frame: local,
    fps,
    config: { damping: 16, stiffness: 100, mass: 0.7 },
  });

  // Exit fade
  const exitStart = holdFrames;
  const exitOpacity = interpolate(local, [exitStart, exitStart + 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(enterSpring, [0, 0.3], [0, 1]) * exitOpacity;
  const scale = interpolate(enterSpring, [0, 1], [0.6, 1]);

  // Dot pulse
  const dotPulse = 1 + Math.sin(local * 0.12) * 0.15;
  const dotGlow = interpolate(Math.sin(local * 0.12), [-1, 1], [6, 16]);

  // Line grow
  const lineProgress = interpolate(enterSpring, [0, 1], [0, 1]);

  // Calculate line endpoints
  const lineStartX = side === "left" ? labelX + text.length * 5 : labelX;
  const lineStartY = labelY + 14;
  const midX = lineStartX + (targetX - lineStartX) * lineProgress;
  const midY = lineStartY + (targetY - lineStartY) * lineProgress;

  if (local < 0 || opacity <= 0) return null;

  return (
    <>
      {/* Leader line */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          opacity,
        }}
      >
        <line
          x1={lineStartX}
          y1={lineStartY}
          x2={midX}
          y2={midY}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray="4 3"
          opacity={0.7}
        />
      </svg>

      {/* Target dot */}
      <div
        style={{
          position: "absolute",
          left: targetX - 6,
          top: targetY - 6,
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
          boxShadow: `0 0 ${dotGlow}px ${dotGlow / 2}px ${color}88`,
          transform: `scale(${dotPulse * scale})`,
          opacity,
          pointerEvents: "none",
        }}
      />

      {/* Label box */}
      <div
        style={{
          position: "absolute",
          left: labelX,
          top: labelY,
          transform: `scale(${scale})`,
          transformOrigin: side === "left" ? "left center" : "right center",
          opacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontFamily: "'Schibsted Grotesk', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            color: "#ffffff",
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            padding: "7px 16px",
            borderRadius: 5,
            borderLeft: `3px solid ${color}`,
            whiteSpace: "nowrap",
            letterSpacing: "0.06em",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
          }}
        >
          {text}
        </div>
      </div>
    </>
  );
};
