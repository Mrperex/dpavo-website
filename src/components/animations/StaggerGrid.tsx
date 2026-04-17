'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StaggerGridProps {
  children: React.ReactNode;
  stagger?: number;
  y?: number;
  x?: number;
  scale?: number;
  duration?: number;
  start?: string;
  /** CSS selector for items inside the container to animate. Default: direct children. */
  selector?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function StaggerGrid({
  children,
  stagger = 0.06,
  y = 40,
  x = 0,
  scale = 0.92,
  duration = 0.6,
  start = 'top 85%',
  selector = ':scope > *',
  className,
  style,
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = gsap.utils.toArray<Element>(container.querySelectorAll(selector));
    if (!items.length) return;

    gsap.from(items, {
      y,
      x,
      opacity: 0,
      scale,
      stagger,
      duration,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: container,
        start,
      },
    });
  }, { scope: ref });

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
