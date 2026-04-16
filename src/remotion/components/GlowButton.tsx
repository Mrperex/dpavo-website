import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface GlowButtonProps {
  text: string;
  startFrame: number;
  color?: string;
  textColor?: string;
  fontSize?: number;
}

export const GlowButton: React.FC<GlowButtonProps> = ({
  text,
  startFrame,
  color = "#ECBA23",
  textColor = "#232323",
  fontSize = 28,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = Math.max(0, frame - startFrame);

  const scaleIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const pulse = Math.sin(localFrame * 0.08) * 0.04 + 1;

  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });

  const glowSize = interpolate(
    Math.sin(localFrame * 0.08),
    [-1, 1],
    [10, 30],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        transform: `scale(${scaleIn * pulse})`,
        opacity,
        display: "inline-block",
      }}
    >
      <div
        style={{
          backgroundColor: color,
          color: textColor,
          fontSize,
          fontFamily: "'Antonio', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "18px 52px",
          borderRadius: 4,
          boxShadow: `0 0 ${glowSize}px ${glowSize / 2}px ${color}66`,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </div>
    </div>
  );
};
