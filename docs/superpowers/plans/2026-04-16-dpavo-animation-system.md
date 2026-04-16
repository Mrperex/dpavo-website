# D'Pavo Animation System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reverse-engineer incredifulls.com's animation stack and implement GSAP + Lenis + Splitting.js animations on D'Pavo's Home and Menu pages, plus create a permanent reusable `/pizza-animations` Claude Code skill.

**Architecture:** Lenis wraps the native scroll globally via `providers.tsx`, synced with GSAP's RAF ticker. Shared animation components (`SplitReveal`, `ParallaxLayer`, `StaggerGrid`) live in `src/components/animations/` and use `@gsap/react`'s `useGSAP` hook for automatic cleanup. All animation code is client-only (`'use client'`) and respects `prefers-reduced-motion`.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / CSS Modules / gsap / @gsap/react / lenis / splitting

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `scripts/scan-incredifulls.mjs` | Playwright script — crawls all incredifulls pages, downloads assets, extracts GSAP config |
| Create | `src/hooks/useLenis.ts` | Re-exports the Lenis instance created in providers for child access |
| Create | `src/components/animations/SplitReveal.tsx` | Splitting.js + GSAP char/word text reveal with ScrollTrigger |
| Create | `src/components/animations/ParallaxLayer.tsx` | ScrollTrigger scrub parallax wrapper |
| Create | `src/components/animations/StaggerGrid.tsx` | GSAP staggered entrance for card grids |
| Create | `src/components/animations/index.ts` | Barrel export |
| Modify | `package.json` | Add gsap, @gsap/react, lenis, splitting |
| Modify | `src/app/providers.tsx` | Init Lenis + GSAP globally, sync RAF |
| Modify | `src/app/globals.css` | Add prefers-reduced-motion reset |
| Modify | `src/app/page.tsx` | Apply all 5 animation types to Home |
| Modify | `src/app/menu/page.tsx` | Apply SplitReveal + StaggerGrid to Menu |
| Modify | `src/components/sections/Marquee/Marquee.tsx` | Upgrade to CSS infinite scroll |
| Modify | `src/components/sections/Marquee/Marquee.module.css` | Smooth marquee keyframe |

---

## Task 1: Install npm packages

**Files:** `package.json`

- [ ] **Step 1: Install animation packages**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE"
npm install gsap @gsap/react lenis splitting
```

- [ ] **Step 2: Verify TypeScript sees the packages**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors about missing modules (there may be pre-existing errors — ignore those, only fail if gsap/lenis/splitting are unresolved).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install gsap, lenis, splitting animation packages"
```

---

## Task 2: Install system tools

**Files:** none (system-level installs)

- [ ] **Step 1: Install mitmproxy**

```bash
pip install mitmproxy
```

- [ ] **Step 2: Verify mitmproxy**

```bash
mitmdump --version
```

Expected output: `Mitmproxy: X.X.X ...`

- [ ] **Step 3: Install Playwright Chromium browser**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE"
npx playwright install chromium
```

Expected: Downloads Chromium binary, ends with `✓ Chromium ... is already installed` or similar success message.

---

## Task 3: Create + run full site scan

**Files:**
- Create: `scripts/scan-incredifulls.mjs`
- Output: `/Users/mrperex/Projects/Reverse-Engeneer-Website/scan/`

- [ ] **Step 1: Create the scan script**

```js
// scripts/scan-incredifulls.mjs
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../../Reverse-Engeneer-Website/scan');
const BASE_URL = 'https://incredifulls.com';
const SEED_PATHS = ['/', '/collections/all', '/pages/find-us-in-stores'];

async function scanPage(page, url, name) {
  console.log(`  Scanning: ${name}`);
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    console.log(`  Skipped (error): ${url}`);
    return null;
  }

  await page.waitForTimeout(2000);

  const config = await page.evaluate(() => {
    return {
      gsapVersion: window.gsap?.version ?? null,
      lenisOptions: window.lenis ? {
        duration: window.lenis.options?.duration,
        easing: window.lenis.options?.easing?.toString(),
        smoothWheel: window.lenis.options?.smoothWheel,
      } : null,
      scrollTriggerDefaults: window.ScrollTrigger?.defaults?.() ?? null,
    };
  });

  const screenshotDir = join(OUTPUT_DIR, 'screenshots', name);
  await mkdir(screenshotDir, { recursive: true });
  const pageHeight = await page.evaluate(() => document.body.scrollHeight);

  for (let y = 0; y <= pageHeight; y += 400) {
    await page.evaluate((s) => window.scrollTo(0, s), y);
    await page.waitForTimeout(200);
    await page.screenshot({
      path: join(screenshotDir, `scroll-${String(y).padStart(5, '0')}.png`),
    });
  }

  return config;
}

async function main() {
  await mkdir(join(OUTPUT_DIR, 'assets'), { recursive: true });
  await mkdir(join(OUTPUT_DIR, 'screenshots'), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    recordHar: { path: join(OUTPUT_DIR, 'network-log.har') },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const downloaded = new Set();
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/cdn/shop/t/60/assets/') && !downloaded.has(url)) {
      downloaded.add(url);
      try {
        const body = await response.body();
        const filename = url.split('/').pop().split('?')[0];
        await writeFile(join(OUTPUT_DIR, 'assets', filename), body);
        console.log(`  ↓ ${filename}`);
      } catch { /* ignore read errors */ }
    }
  });

  const configs = {};

  for (const path of SEED_PATHS) {
    const name = path === '/' ? 'home' : path.replace(/\//g, '-').slice(1);
    configs[path] = await scanPage(page, BASE_URL + path, name);
  }

  // Discover product pages (up to 3)
  await page.goto(`${BASE_URL}/collections/all`, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  const productUrls = await page.evaluate(() =>
    [...new Set(
      [...document.querySelectorAll('a[href*="/products/"]')]
        .map((a) => a.href)
        .filter((h) => !h.includes('?'))
    )].slice(0, 3)
  );

  for (const url of productUrls) {
    const name = 'product-' + url.split('/products/')[1]?.replace(/\//g, '-') ?? 'unknown';
    configs[url] = await scanPage(page, url, name);
  }

  await context.close();
  await browser.close();

  await writeFile(
    join(OUTPUT_DIR, 'animation-config.json'),
    JSON.stringify(configs, null, 2)
  );

  console.log(`\n✓ Scan complete → ${OUTPUT_DIR}`);
  console.log(`  Assets downloaded: ${downloaded.size}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Ensure output directory exists**

```bash
mkdir -p "/Users/mrperex/Projects/Reverse-Engeneer-Website/scan"
```

- [ ] **Step 3: Run the scan**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE"
node scripts/scan-incredifulls.mjs
```

Expected: Downloads JS/CSS files to `scan/assets/`, screenshots to `scan/screenshots/home/`, prints `✓ Scan complete`. Takes ~3–5 minutes.

- [ ] **Step 4: Verify output**

```bash
ls /Users/mrperex/Projects/Reverse-Engeneer-Website/scan/assets/
cat /Users/mrperex/Projects/Reverse-Engeneer-Website/scan/animation-config.json
```

Expected: See `gsap.min.js`, `lenis.min.js`, `landing.css`, etc. Config JSON shows `gsapVersion: "3.x.x"` and `lenisOptions`.

- [ ] **Step 5: Extract Lenis easing from scan — update spec config values**

Open `scan/assets/lenis.min.js` and `scan/assets/landing.css`. Grep for `duration` and `easing` values to confirm or update the preliminary values in the spec. Document findings in `scan/animation-config.json` manually if needed.

- [ ] **Step 6: Commit scan script**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE"
git add scripts/scan-incredifulls.mjs
git commit -m "feat: add incredifulls full-site scan script"
```

---

## Task 4: Wire Lenis + GSAP globally

**Files:**
- Modify: `src/app/providers.tsx`

- [ ] **Step 1: Replace providers.tsx**

```tsx
// src/app/providers.tsx
'use client';

import { useEffect } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onRaf = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(onRaf);
    };
  }, []);

  return <LanguageProvider>{children}</LanguageProvider>;
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE"
npx tsc --noEmit 2>&1 | grep -E "(error|lenis|gsap)" | head -20
```

Expected: No errors on providers.tsx.

- [ ] **Step 3: Smoke-test dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll the page — it should feel noticeably smoother (inertia scroll). No console errors about Lenis or GSAP. Stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/app/providers.tsx
git commit -m "feat: init Lenis smooth scroll + GSAP globally in providers"
```

---

## Task 5: Create SplitReveal component

**Files:**
- Create: `src/components/animations/SplitReveal.tsx`

- [ ] **Step 1: Create SplitReveal.tsx**

```tsx
// src/components/animations/SplitReveal.tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Splitting from 'splitting';
import 'splitting/dist/splitting.css';

gsap.registerPlugin(ScrollTrigger);

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface SplitRevealProps {
  children: React.ReactNode;
  as?: Tag;
  by?: 'chars' | 'words';
  stagger?: number;
  y?: number;
  duration?: number;
  ease?: string;
  start?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SplitReveal({
  children,
  as: Tag = 'div',
  by = 'words',
  stagger = 0.05,
  y = 60,
  duration = 0.8,
  ease = 'power3.out',
  start = 'top 82%',
  className,
  style,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const [result] = Splitting({ target: el, by });
    const targets = by === 'chars' ? result.chars! : result.words!;

    gsap.from(targets, {
      y,
      opacity: 0,
      stagger,
      duration,
      ease,
      scrollTrigger: {
        trigger: el,
        start,
      },
    });
  }, { scope: ref });

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "SplitReveal" | head -10
```

Expected: No errors on this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/SplitReveal.tsx
git commit -m "feat: add SplitReveal component (Splitting.js + GSAP)"
```

---

## Task 6: Create ParallaxLayer component

**Files:**
- Create: `src/components/animations/ParallaxLayer.tsx`

- [ ] **Step 1: Create ParallaxLayer.tsx**

```tsx
// src/components/animations/ParallaxLayer.tsx
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
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "ParallaxLayer" | head -10
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/ParallaxLayer.tsx
git commit -m "feat: add ParallaxLayer component (ScrollTrigger scrub)"
```

---

## Task 7: Create StaggerGrid component

**Files:**
- Create: `src/components/animations/StaggerGrid.tsx`

- [ ] **Step 1: Create StaggerGrid.tsx**

```tsx
// src/components/animations/StaggerGrid.tsx
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
  stagger = 0.08,
  y = 40,
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
      opacity: 0,
      scale,
      stagger,
      duration,
      ease: 'power2.out',
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
```

- [ ] **Step 2: Create barrel export**

```ts
// src/components/animations/index.ts
export { SplitReveal } from './SplitReveal';
export { ParallaxLayer } from './ParallaxLayer';
export { StaggerGrid } from './StaggerGrid';
```

- [ ] **Step 3: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep -E "(StaggerGrid|animations/index)" | head -10
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/animations/
git commit -m "feat: add StaggerGrid component + barrel export"
```

---

## Task 8: Add global prefers-reduced-motion reset

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Read globals.css to find where to append**

Read `src/app/globals.css` — look for end of file.

- [ ] **Step 2: Append reduced-motion block**

Add at the end of `src/app/globals.css`:

```css
/* Respect user motion preferences — disables all CSS transitions/animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add prefers-reduced-motion global reset"
```

---

## Task 9: Apply animations to Home page — text reveals + staggered cards

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add animation imports to page.tsx**

At the top of `src/app/page.tsx`, add after the existing imports:

```tsx
import { SplitReveal, ParallaxLayer, StaggerGrid } from '@/components/animations';
```

- [ ] **Step 2: Wrap hero heading in SplitReveal**

Find in `src/app/page.tsx`:
```tsx
<h1 className={styles.heroTitle}>
  D&apos;<span>P</span>avo
</h1>
```

Replace with:
```tsx
<SplitReveal as="h1" by="chars" stagger={0.04} y={80} className={styles.heroTitle}>
  D&apos;<span>P</span>avo
</SplitReveal>
```

- [ ] **Step 3: Wrap hero pizza image in ParallaxLayer**

Find in `src/app/page.tsx`:
```tsx
<div className={styles.heroImageWrap}>
  <img
    src="/media/pizza-hero.png"
    alt="La Pavorosa - D'Pavo signature pizza"
    className={styles.heroImg}
  />
</div>
```

Replace with:
```tsx
<div className={styles.heroImageWrap}>
  <ParallaxLayer speed={0.35}>
    <img
      src="/media/pizza-hero.png"
      alt="La Pavorosa - D'Pavo signature pizza"
      className={styles.heroImg}
    />
  </ParallaxLayer>
</div>
```

- [ ] **Step 4: Wrap About heading in SplitReveal**

Find in `src/app/page.tsx`:
```tsx
<h2 className={styles.aboutHeading}>
  {t.home.aboutHeading1}<br />{t.home.aboutHeading2}
</h2>
```

Replace with:
```tsx
<SplitReveal as="h2" by="words" stagger={0.06} y={50} className={styles.aboutHeading}>
  {t.home.aboutHeading1} {t.home.aboutHeading2}
</SplitReveal>
```

Note: Remove the `<br />` — Splitting.js and `<br>` don't mix well. The heading will wrap naturally via CSS.

- [ ] **Step 5: Wrap Popular Picks grid in StaggerGrid**

Find in `src/app/page.tsx`:
```tsx
<div className={styles.picksGrid}>
  {featured.map((item) => (
```

Replace with:
```tsx
<StaggerGrid className={styles.picksGrid} stagger={0.1} y={40} scale={0.93}>
  {featured.map((item) => (
```

And close with `</StaggerGrid>` where `</div>` was for `picksGrid`.

- [ ] **Step 6: Wrap Why D'Pavo grid in StaggerGrid**

Find in `src/app/page.tsx`:
```tsx
<div className={styles.whyGrid}>
  {[
```

Replace with:
```tsx
<StaggerGrid className={styles.whyGrid} stagger={0.07} y={30} scale={0.96} start="top 88%">
  {[
```

And close with `</StaggerGrid>` where `</div>` was for `whyGrid`.

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "page.tsx" | head -10
```

Expected: No new errors from animation imports.

- [ ] **Step 8: Smoke-test home page visually**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll slowly through the page. Verify:
- Hero `D'Pavo` heading animates character by character on load
- Pizza image shifts slower than background as you scroll (parallax)
- About heading words animate in as section enters viewport
- Popular Picks cards stagger in one by one
- Why D'Pavo grid items stagger in

Stop server.

- [ ] **Step 9: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: apply SplitReveal, ParallaxLayer, StaggerGrid to Home page"
```

---

## Task 10: Apply pinned scroll to Home — About section

**Files:**
- Modify: `src/app/page.tsx`

The About section (`aboutSection`) pins while the image slides in from the left and the text block slides in from the right, creating a staged reveal.

- [ ] **Step 1: Add useGSAP + ScrollTrigger import to page.tsx**

At the top of `src/app/page.tsx`, add:

```tsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
```

Note: `useRef` and `useEffect` are already imported — remove duplicates.

- [ ] **Step 2: Add pinned about ref + animation inside the Home component**

Inside the `Home` function, before the `return`, add:

```tsx
const aboutRef = useRef<HTMLElement>(null);

useGSAP(() => {
  const section = aboutRef.current;
  if (!section) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const imageSide = section.querySelector(`.${styles.aboutImageSide}`);
  const textSide = section.querySelector(`.${styles.aboutText}`);

  // Set initial hidden state BEFORE defining the timeline
  gsap.set(imageSide, { opacity: 0, x: -40 });
  gsap.set(textSide, { opacity: 0, x: 40 });

  gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 60%',
    },
  })
    .to(imageSide, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0)
    .to(textSide, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.15);
}, { scope: aboutRef });
```

- [ ] **Step 3: Attach ref to AnimSection**

Find the about AnimSection:
```tsx
<AnimSection className={styles.aboutSection}>
```

Replace with:
```tsx
<section ref={aboutRef} className={`${styles.aboutSection} animate-in`}>
```

And the closing tag:
```tsx
</AnimSection>
```
Replace with:
```tsx
</section>
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "page.tsx" | head -15
```

Expected: No new errors.

- [ ] **Step 5: Smoke-test**

```bash
npm run dev
```

Scroll to the About section. The image side should slide in from the left and text from the right as the section enters the viewport. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: add scroll-triggered staged reveal to About section"
```

---

## Task 11: Upgrade Marquee component

**Files:**
- Modify: `src/components/sections/Marquee/Marquee.tsx`
- Modify: `src/components/sections/Marquee/Marquee.module.css`

- [ ] **Step 1: Read current Marquee files**

Read both files to understand the current implementation before editing.

- [ ] **Step 2: Replace Marquee.tsx**

```tsx
// src/components/sections/Marquee/Marquee.tsx
'use client';

import { useRef } from 'react';
import styles from './Marquee.module.css';

interface MarqueeProps {
  items: string[];
  speed?: number; // pixels per second, default 60
  direction?: 'left' | 'right';
}

export function Marquee({ items, speed = 60, direction = 'left' }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Duplicate enough times to ensure seamless loop at any screen width
  const repeated = [...items, ...items, ...items, ...items];
  const duration = (repeated.length * 120) / speed;

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div
        ref={trackRef}
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
```

- [ ] **Step 3: Read Marquee.module.css**

Read `src/components/sections/Marquee/Marquee.module.css` before editing.

- [ ] **Step 4: Replace Marquee.module.css**

Replace the entire contents with:

```css
.wrapper {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  cursor: default;
}

.track {
  display: inline-flex;
  gap: 0;
  animation: marquee-scroll linear infinite;
  will-change: transform;
}

.wrapper:hover .track {
  animation-play-state: paused;
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  flex-shrink: 0;
}

.dot {
  opacity: 0.4;
}
```

- [ ] **Step 5: Verify Marquee still renders**

```bash
npm run dev
```

Open `http://localhost:3000`. The Marquee should scroll smoothly and pause on hover. Stop server.

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/Marquee/
git commit -m "feat: upgrade Marquee to smooth CSS infinite scroll with hover pause"
```

---

## Task 12: Apply animations to Menu page

**Files:**
- Modify: `src/app/menu/page.tsx`

- [ ] **Step 1: Add animation imports to menu/page.tsx**

At the top of `src/app/menu/page.tsx`, add after existing imports:

```tsx
import { SplitReveal, StaggerGrid } from '@/components/animations';
```

- [ ] **Step 2: Replace the featured section header label**

Find in `src/app/menu/page.tsx`:
```tsx
<SectionHeader label={t.menuPage.featured} title="" />
```

Replace with:
```tsx
<SplitReveal as="p" by="words" stagger={0.05} y={30}>
  {t.menuPage.featured}
</SplitReveal>
```

- [ ] **Step 3: Wrap featured cards grid in StaggerGrid**

Find:
```tsx
<div className={styles.featuredGrid}>
  {featured.map((item, i) => (
    <article
      key={item.id}
      className={`${styles.featCard} animate-in visible`}
      style={{ '--index': i } as React.CSSProperties}
    >
```

Replace with:
```tsx
<StaggerGrid className={styles.featuredGrid} stagger={0.12} y={40} scale={0.94}>
  {featured.map((item) => (
    <article
      key={item.id}
      className={styles.featCard}
    >
```

Remove the `--index` style prop and close with `</StaggerGrid>` where the grid div closes.

- [ ] **Step 4: Replace list grid div with StaggerGrid**

Find:
```tsx
<div
  ref={gridRef}
  className={`${styles.listGrid} animate-in ${gridInView ? 'visible' : ''}`}
>
```

Replace with:
```tsx
<StaggerGrid className={styles.listGrid} stagger={0.05} y={25} scale={0.97} start="top 90%">
```

And change closing `</div>` to `</StaggerGrid>`.

Remove the now-unused `gridRef` and `gridInView` variables (and the `useInView` import if no longer used).

- [ ] **Step 5: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "menu/page" | head -10
```

Expected: No new errors.

- [ ] **Step 6: Smoke-test menu page**

```bash
npm run dev
```

Open `http://localhost:3000/menu`. Scroll — featured cards stagger in, list cards animate in per group. Stop server.

- [ ] **Step 7: Commit**

```bash
git add src/app/menu/page.tsx
git commit -m "feat: apply SplitReveal + StaggerGrid animations to Menu page"
```

---

## Task 13: Final build verification

**Files:** none (verification only)

- [ ] **Step 1: Full TypeScript check**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE"
npx tsc --noEmit
```

Expected: Zero errors. If errors exist, fix them before continuing.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: Build completes with no errors. There should be no `window is not defined` or other SSR errors. If there are SSR errors on animation imports, wrap them in `dynamic(() => import(...), { ssr: false })`.

- [ ] **Step 3: Run prod server + full visual check**

```bash
npm start
```

Open `http://localhost:3000`. Perform these checks:
- Scroll smoothly (Lenis) ✓
- Hero heading animates char-by-char ✓
- Hero pizza parallax visible ✓
- About section staged entrance ✓
- Picks cards stagger ✓
- Why D'Pavo items stagger ✓
- Marquee scrolling + pauses on hover ✓

Open `http://localhost:3000/menu`:
- Featured cards stagger ✓
- List cards animate in ✓

Stop server.

- [ ] **Step 4: Test prefers-reduced-motion**

In browser DevTools → Rendering → Emulate CSS media feature → set `prefers-reduced-motion: reduce`. Reload. All animations should be suppressed — content should just appear without motion.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: post-animation system verification — all checks pass"
```

---

## Task 14: Create /pizza-animations skill

**Files:** Claude Code skill system

- [ ] **Step 1: Invoke skill-creator to register the skill**

Use the `skill-creator` Claude Code skill (`/skill-creator`) in a new session. Brief it with:

> Create a skill named `pizza-animations` that teaches how to implement the incredifulls.com animation stack in any React/Next.js project. The skill should contain: (1) installation commands for gsap, @gsap/react, lenis, splitting; (2) Lenis + GSAP RAF sync setup for providers; (3) ready-to-use SplitReveal, ParallaxLayer, StaggerGrid component code; (4) the exact config values extracted from incredifulls (duration 1.2, easing `Math.min(1, 1.001 - Math.pow(2, -10 * t))`, stagger 0.05–0.1, y 40–80, ease power2/power3.out); (5) SSR safety patterns; (6) prefers-reduced-motion guard pattern; (7) common pitfalls (GSAP context cleanup, Lenis + ScrollTrigger sync, will-change usage).

The skill file lives in the Claude Code skills system so it can be invoked as `/pizza-animations` on any future project.

- [ ] **Step 2: Verify skill is accessible**

In a Claude Code session, type `/pizza-animations`. It should load the skill content.

---

## Success Criteria Checklist

- [ ] `npm install gsap @gsap/react lenis splitting` succeeds, no TS errors
- [ ] `pip install mitmproxy` + `npx playwright install chromium` succeed
- [ ] Scan script runs end-to-end, `scan/assets/` has gsap.min.js and lenis.min.js
- [ ] `animation-config.json` shows real Lenis options from live site
- [ ] Lenis smooth scroll active on Home + Menu (visible inertia on scroll)
- [ ] Hero `D'Pavo` heading animates character-by-character on load
- [ ] Hero pizza image parallaxes at slower speed than page
- [ ] About section image + text slide in from sides on scroll
- [ ] Popular Picks cards stagger in with scale + Y animation
- [ ] Why D'Pavo grid items stagger in
- [ ] Marquee scrolls smoothly + pauses on hover
- [ ] Menu featured cards stagger in
- [ ] Menu list cards stagger in per category
- [ ] `prefers-reduced-motion` suppresses all animations
- [ ] `npm run build` succeeds with zero SSR errors
- [ ] `/pizza-animations` skill accessible in Claude Code
