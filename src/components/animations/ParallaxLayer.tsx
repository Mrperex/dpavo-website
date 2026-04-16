'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxLayerProps {
  children: React.ReactNode;
  /** 0 = no movement, 0.4 = moves at 40% of scroll speed */
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ParallaxLayer({ children, speed = 0.4, className, style }: ParallaxLayerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.to(inner, {
      yPercent: -(speed * 30),
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} className={className} style={{ overflow: 'hidden', ...style }}>
      <div ref={innerRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  );
}
