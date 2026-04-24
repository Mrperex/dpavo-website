'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClipRevealProps {
  children: React.ReactNode;
  start?: string;
  duration?: number;
  ease?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ClipReveal({
  children,
  start = 'top 85%',
  duration = 0.9,
  ease = 'power3.out',
  className,
  style,
}: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from(el, {
      clipPath: 'inset(100% 0 0 0)',
      duration,
      ease,
      scrollTrigger: { trigger: el, start },
    });
  }, { scope: ref });

  return (
    <div
      ref={ref}
      className={className}
      style={{ clipPath: 'inset(0% 0 0 0)', overflow: 'hidden', ...style }}
    >
      {children}
    </div>
  );
}
