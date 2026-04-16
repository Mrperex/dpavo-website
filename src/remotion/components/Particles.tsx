import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
  delay: number;
}

interface ParticlesProps {
  count?: number;
  colors?: string[];
}

export const Particles: React.FC<ParticlesProps> = ({
  count = 30,
  colors = ["#ECBA23", "#BD1F17", "#ffffff"],
}) => {
  const frame = useCurrentFrame();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (((i * 137.508) % 100) + (Math.sin(i * 2.4) * 10 + 10)),
      y: ((i * 73.23) % 100),
      size: 2 + (i % 5),
      speed: 0.3 + (i % 10) * 0.07,
      opacity: 0.2 + (i % 5) * 0.1,
      color: colors[i % colors.length],
      delay: (i * 7) % 60,
    }));
  }, [count, colors]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {particles.map((p) => {
        const localFrame = Math.max(0, frame - p.delay);
        const yOffset = (localFrame * p.speed) % 120;
        const startY = p.y - yOffset;
        const opacity = interpolate(
          localFrame,
          [0, 20, 80, 120],
          [0, p.opacity, p.opacity, 0],
          { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
        );

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${((startY % 120) + 120) % 120 - 10}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              opacity,
              filter: `blur(${p.size > 5 ? 1 : 0}px)`,
            }}
          />
        );
      })}
    </div>
  );
};
