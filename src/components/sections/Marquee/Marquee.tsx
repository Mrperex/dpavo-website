// src/components/sections/Marquee/Marquee.tsx
'use client';

import styles from './Marquee.module.css';

interface MarqueeProps {
  items: string[];
  speed?: number; // pixels per second, default 60
  direction?: 'left' | 'right';
}

export function Marquee({ items, speed = 60, direction = 'left' }: MarqueeProps) {
  // Duplicate enough times to ensure seamless loop at any screen width
  const repeated = [...items, ...items, ...items, ...items];
  const duration = (repeated.length * 120) / speed;

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div
        className={styles.track}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>
            {item} <span className={styles.dot}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
