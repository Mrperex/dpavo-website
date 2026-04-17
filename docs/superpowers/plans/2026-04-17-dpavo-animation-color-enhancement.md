# D'Pavo Animation & Color Enhancement — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix menu hero text visibility, expand gold color usage, and add 9 layers of energetic animation to the home and menu pages.

**Architecture:** All animation work uses GSAP + @gsap/react (`useGSAP`) already installed. A single new `MagneticButton` component wraps CTAs. All other changes are CSS overrides or additional `useGSAP` blocks in existing page files. No new pages or routes.

**Tech Stack:** Next.js 16 App Router, React 19, GSAP 3.15 + ScrollTrigger, TypeScript, CSS Modules

**Note:** No test infrastructure exists — verification steps use browser checks and `npx tsc --noEmit` instead of unit tests.

---

## File Map

| File | Action | What changes |
|---|---|---|
| `src/components/layout/PageHero/PageHero.module.css` | Modify | `.title` → white; `.hero .label` → semi-white override |
| `src/app/menu/page.tsx` | Modify | Wrap title text in gold `<span>` |
| `src/app/globals.css` | Modify | Add `.labelGold` utility class |
| `src/app/page.module.css` | Modify | Why icons gold; section labels gold; card hover gold glow; 3D tilt |
| `src/app/menu/menu.module.css` | Modify | Featured card hover gold glow; 3D tilt |
| `src/components/Navbar/Navbar.module.css` | Modify | Active link gold underline via `[aria-current]` |
| `src/components/Navbar/Navbar.tsx` | Modify | Add `usePathname`; mark active links with `aria-current` |
| `src/components/animations/StaggerGrid.tsx` | Modify | `ease` → `'back.out(1.4)'`, stagger `0.06`, add optional `x` prop |
| `src/components/animations/MagneticButton.tsx` | Create | Cursor-magnetic CTA wrapper |
| `src/components/animations/index.ts` | Modify | Export `MagneticButton` |
| `src/app/page.tsx` | Modify | Floating badges; hero text parallax; category GSAP bounce-in; wire MagneticButton |
| `src/app/menu/page.tsx` | Modify | Filter pills GSAP bounce-in; wire MagneticButton on featured cards |

---

## Task 1: Fix PageHero title and label colors

**Files:**
- Modify: `src/components/layout/PageHero/PageHero.module.css`

The `.title` class currently has no `color` set, so it inherits `var(--text)` (#232323 near-black) from `body`. The label inside the hero inherits the global `.label` red, which also reads poorly over a dark overlay.

- [ ] **Step 1: Edit PageHero.module.css**

Open `src/components/layout/PageHero/PageHero.module.css`. Find the `.title` rule (line 42) and add `color: #fff`. Add a `.hero .label` override after the `.subtitle` rule:

```css
.title {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 0.92;
  letter-spacing: -0.05em;
  margin: 8px 0 18px;
  text-shadow: 0 2px 16px rgba(0,0,0,0.6);
  color: #fff;
}

.hero :global(.label) {
  color: rgba(255,255,255,0.7);
}
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/menu`. "EL MENÚ" should now render in white, clearly readable over the background image. The eyebrow label "SABORES DE ALTO OCTANAJE" should be semi-white.

- [ ] **Step 3: Make menu title gold**

Open `src/app/menu/page.tsx`. Find line 32. Change the `title` prop to wrap the main text in a gold span:

```tsx
title={
  <>
    <span style={{ color: 'var(--gold)' }}>{t.menuPage.title.replace('.', '')}</span>
    {' '}<span style={{ color: 'var(--primary)' }}>.</span>
  </>
}
```

- [ ] **Step 4: Verify gold title**

Reload `http://localhost:3000/menu`. "EL MENÚ" should now be gold (`#ECBA23`) on the dark overlay — vibrant and clearly readable.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/PageHero/PageHero.module.css src/app/menu/page.tsx
git commit -m "fix: menu hero title white with gold override; label semi-white"
```

---

## Task 2: Gold color expansion (CSS)

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/page.module.css`
- Modify: `src/app/menu/menu.module.css`

- [ ] **Step 1: Add `.labelGold` utility to globals.css**

Open `src/app/globals.css`. After the existing `.label` rule (around line 93), add:

```css
.labelGold {
  font-family: var(--font-display), sans-serif;
  text-transform: uppercase;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--gold);
}
```

- [ ] **Step 2: Switch section header labels to gold in page.module.css**

Open `src/app/page.module.css`. Find `.sectionHeaderLabel` (line 689). Change `color: var(--red)` to `color: var(--gold)`:

```css
.sectionHeaderLabel {
  font-family: var(--font-display), sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
}
```

- [ ] **Step 3: Switch Why D'Pavo icons to gold**

In `src/app/page.module.css`, find `.whyIconWrap` (line 1061). Change `color: var(--red)` to `color: var(--gold)`:

```css
.whyIconWrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(236,186,35,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--gold);
}
```

Also update the background from `rgba(189,31,23,0.08)` (whatever it currently is) to `rgba(236,186,35,0.1)` to match the gold tint.

- [ ] **Step 4: Add gold hover glow to pickCard in page.module.css**

Find `.pickCard:hover .pickImgWrap` (around line 741). Add a gold glow:

```css
.pickCard:hover .pickImgWrap {
  box-shadow: 0 20px 48px rgba(0,0,0,0.2), 0 0 0 2px rgba(236,186,35,0.4);
}
```

- [ ] **Step 5: Add gold hover border to featCard in menu.module.css**

Open `src/app/menu/menu.module.css`. Find `.featCard:hover` (around line 61). Replace it:

```css
.featCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 2px rgba(236,186,35,0.45);
  border-color: rgba(236,186,35,0.4);
}
```

- [ ] **Step 6: Verify gold colors in browser**

Navigate to `http://localhost:3000`. Check:
- Section labels ("NUESTROS PICKS", "Why D'Pavo") are gold
- Why D'Pavo icons are gold
- Hover over a Picks card — gold ring appears on the image circle
Navigate to `http://localhost:3000/menu`. Hover a featured card — gold border glow.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/page.module.css src/app/menu/menu.module.css
git commit -m "feat: expand gold accent to section labels, Why icons, card hover glows"
```

---

## Task 3: Navbar active-page gold underline

**Files:**
- Modify: `src/components/Navbar/Navbar.tsx`
- Modify: `src/components/Navbar/Navbar.module.css`

- [ ] **Step 1: Add usePathname to Navbar.tsx**

Open `src/components/Navbar/Navbar.tsx`. Add the import on line 3:

```tsx
import { usePathname } from 'next/navigation';
```

Inside `export default function Navbar()`, add after the existing hooks:

```tsx
const pathname = usePathname();
```

- [ ] **Step 2: Mark active links with aria-current**

Find the `<ul className={styles.links}>` block (line 34). Replace the five `<li><Link>` items:

```tsx
<ul className={styles.links}>
  {[
    { href: '/',        label: t.nav.home },
    { href: '/menu',    label: t.nav.menu },
    { href: '/events',  label: t.nav.events },
    { href: '/about',   label: t.nav.about },
    { href: '/gallery', label: t.nav.gallery },
  ].map(({ href, label }) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={pathname === href ? 'page' : undefined}
      >
        {label}
      </Link>
    </li>
  ))}
</ul>
```

- [ ] **Step 3: Add active underline CSS**

Open `src/components/Navbar/Navbar.module.css`. After the `.links li a:hover` rule (line 74), add:

```css
.links li a[aria-current='page'] {
  color: #fff;
  position: relative;
}

.links li a[aria-current='page']::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--gold);
  border-radius: 2px;
}
```

- [ ] **Step 4: Verify active underline**

Navigate to `http://localhost:3000/menu`. The "MENÚ" nav link should have a gold underline. Navigate to `/` — "INICIO" should have the underline.

- [ ] **Step 5: Commit**

```bash
git add src/components/Navbar/Navbar.tsx src/components/Navbar/Navbar.module.css
git commit -m "feat: navbar active page gold underline via aria-current"
```

---

## Task 4: StaggerGrid elastic easing

**Files:**
- Modify: `src/components/animations/StaggerGrid.tsx`

- [ ] **Step 1: Update StaggerGrid with elastic easing and optional x prop**

Replace the full contents of `src/components/animations/StaggerGrid.tsx`:

```tsx
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
```

- [ ] **Step 2: Verify elastic snap**

Navigate to `http://localhost:3000`, scroll to Popular Picks and Why D'Pavo. Cards should overshoot slightly and snap back on entry. Navigate to `http://localhost:3000/menu` — featured cards and list cards same effect.

- [ ] **Step 3: Commit**

```bash
git add src/components/animations/StaggerGrid.tsx
git commit -m "feat: StaggerGrid elastic back.out(1.4) easing, faster stagger 0.06"
```

---

## Task 5: 3D card tilt on hover (CSS)

**Files:**
- Modify: `src/app/page.module.css`
- Modify: `src/app/menu/menu.module.css`

- [ ] **Step 1: Add 3D tilt to pickCard**

Open `src/app/page.module.css`. Find `.pickCard` (line 721). Replace the hover rule:

```css
.pickCard {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 16px 24px;
  transition: transform 0.3s ease;
  text-decoration: none;
  transform-style: preserve-3d;
}

.pickCard:hover {
  transform: perspective(700px) rotateY(6deg) rotateX(3deg) translateY(-6px) scale(1.03);
}

@media (hover: none) {
  .pickCard:hover { transform: none; }
}
```

- [ ] **Step 2: Add 3D tilt to whyItem**

In `src/app/page.module.css`, find `.whyItem` (line 1048). Add perspective tilt on hover:

```css
.whyItem {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  transition: background 0.2s ease, transform 0.3s ease;
  transform-style: preserve-3d;
}

.whyItem:hover {
  background: #fafafa;
  transform: perspective(600px) rotateY(3deg) rotateX(2deg);
}

@media (hover: none) {
  .whyItem:hover { transform: none; }
}
```

- [ ] **Step 3: Add 3D tilt to featCard in menu.module.css**

Open `src/app/menu/menu.module.css`. Find `.featCard` (line 51). Add:

```css
.featCard {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  background: var(--surface-low);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  transform-style: preserve-3d;
}

.featCard:hover {
  transform: perspective(700px) rotateY(5deg) rotateX(2deg) translateY(-5px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 2px rgba(236,186,35,0.45);
  border-color: rgba(236,186,35,0.4);
}

@media (hover: none) {
  .featCard:hover { transform: none; }
}
```

- [ ] **Step 4: Verify tilt in browser**

Navigate to `http://localhost:3000`. Hover over Popular Picks cards — 3D tilt with gold ring. Hover Why D'Pavo cards — subtle tilt. Navigate to `/menu`, hover featured cards — tilt with gold glow.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.module.css src/app/menu/menu.module.css
git commit -m "feat: 3D perspective tilt hover on picks, why, and featured menu cards"
```

---

## Task 6: Floating badges (GSAP continuous loop)

**Files:**
- Modify: `src/app/page.tsx`

The `todayBadge` and `authenticBadge` elements get a perpetual float animation on mount. They're both already rendered — we just need refs and a `useGSAP` effect.

- [ ] **Step 1: Add refs for badges**

Open `src/app/page.tsx`. After the `aboutRef` on line 91, add two more refs:

```tsx
const todayBadgeRef = useRef<HTMLAnchorElement>(null);
const authenticBadgeRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 2: Add floating GSAP effect**

After the existing `useGSAP` block for the about section (after line 113), add a new `useGSAP`:

```tsx
useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const badges = [todayBadgeRef.current, authenticBadgeRef.current].filter(Boolean);
  badges.forEach((el, i) => {
    gsap.to(el, {
      y: -8,
      duration: 3 + i * 0.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });
});
```

- [ ] **Step 3: Attach refs to JSX elements**

Find the `todayBadge` anchor element (line ~149):

```tsx
<a
  ref={todayBadgeRef}
  href={WA_ORDER('La Pavorosa')}
  target="_blank"
  rel="noopener noreferrer"
  className={styles.todayBadge}
>
```

Find the `authenticBadge` div (line ~196):

```tsx
<div ref={authenticBadgeRef} className={styles.authenticBadge}>
```

- [ ] **Step 4: Verify floating in browser**

Navigate to `http://localhost:3000`. Both the gold "TODAY'S SPECIAL" badge and the red "AUTHENTIC Flavor" badge should gently float up and down continuously, even when the page is not being scrolled.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: perpetual float animation on Today's Special and Authentic Flavor badges"
```

---

## Task 7: Hero parallax — text layer

**Files:**
- Modify: `src/app/page.tsx`

The pizza image already has `ParallaxLayer speed={0.35}`. Add a parallax scrub on the `.heroInner` text block (speed 0.12) and on the hero background (CSS `backgroundPositionY` via GSAP).

- [ ] **Step 1: Add heroRef**

In `src/app/page.tsx`, add a ref for the hero section after the other refs:

```tsx
const heroRef = useRef<HTMLElement>(null);
```

- [ ] **Step 2: Add GSAP parallax for heroInner and background**

Add a new `useGSAP` block after the badge float effect:

```tsx
useGSAP(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = heroRef.current;
  if (!hero) return;

  const inner = hero.querySelector<HTMLElement>(`.${styles.heroInner}`);
  if (inner) {
    gsap.to(inner, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  gsap.to(hero, {
    backgroundPositionY: '30%',
    ease: 'none',
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}, { scope: heroRef });
```

- [ ] **Step 3: Attach heroRef to the hero section**

Find the hero section (line ~122):

```tsx
<section ref={heroRef} className={styles.hero}>
```

- [ ] **Step 4: Verify parallax depth**

Navigate to `http://localhost:3000`. Scroll slowly from the top. The text ("Auténtico", "D'PAVO") should drift upward slightly faster than the pizza image, creating a depth illusion. The background texture shifts subtly. Three distinct speeds should be visible.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: multi-layer hero parallax — text layer + background position scrub"
```

---

## Task 8: Category icon row GSAP bounce-in

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.module.css`

The `CategoriesSection` component currently uses a CSS animation via `catItemVisible` toggled by `useInView`. We'll upgrade the entrance to GSAP `back.out(1.4)` for the elastic pop effect. The existing `CountUp` counter is kept — it already works correctly.

- [ ] **Step 1: Convert CategoriesSection to use GSAP**

In `src/app/page.tsx`, replace the entire `CategoriesSection` function (lines 57–84):

```tsx
function CategoriesSection({ title }: { title: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const items = gsap.utils.toArray<Element>(section.querySelectorAll(`.${styles.catItem}`));
    if (!items.length) return;

    gsap.from(items, {
      y: 30,
      scale: 0.8,
      opacity: 0,
      stagger: 0.06,
      duration: 0.55,
      ease: 'back.out(1.4)',
      scrollTrigger: { trigger: section, start: 'top 75%' },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.categoriesSection}>
      <div className="container">
        <p className={styles.catTitle}>{title}</p>
        <div className={styles.catGrid}>
          {CAT_ITEMS.map((cat) => {
            const [counted, setCounted] = useState(false);
            return (
              <Link
                key={cat.label}
                href={cat.href}
                className={styles.catItem}
              >
                <div className={styles.catIconWrap}>
                  <div className={styles.catIcon}>{cat.icon(40)}</div>
                  <span className={styles.catCount}>
                    <CountUp target={cat.count} active={counted} />
                  </span>
                </div>
                <span className={styles.catLabel}>{cat.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

Wait — `useState` inside a `map` callback is invalid in React. Use the `useInView` hook on the section to trigger CountUp, same as before but combined with the GSAP entrance. Replace with:

```tsx
function CategoriesSection({ title }: { title: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }

    const items = gsap.utils.toArray<Element>(section.querySelectorAll(`.${styles.catItem}`));
    if (!items.length) return;

    gsap.from(items, {
      y: 30,
      scale: 0.8,
      opacity: 0,
      stagger: 0.06,
      duration: 0.55,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        onEnter: () => setInView(true),
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.categoriesSection}>
      <div className="container">
        <p className={styles.catTitle}>{title}</p>
        <div className={styles.catGrid}>
          {CAT_ITEMS.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={styles.catItem}
            >
              <div className={styles.catIconWrap}>
                <div className={styles.catIcon}>{cat.icon(40)}</div>
                <span className={styles.catCount}>
                  <CountUp target={cat.count} active={inView} />
                </span>
              </div>
              <span className={styles.catLabel}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Remove CSS animation from catItem in page.module.css**

In `src/app/page.module.css`, find the `.catItem` rule (line ~405). Remove the `opacity: 0` and `transform: translateY(20px)` lines — GSAP now owns the initial state. Also delete the entire `.catItemVisible` rule and its `@keyframes catSlideUp` block below it. Keep all other `.catItem` styles (padding, borders, hover, cursor, etc.).

The `.catItem` rule should end up like:

```css
.catItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 28px 16px;
  border-right: 1px solid var(--border);
  text-decoration: none;
  transition: background 0.2s ease;
}
.catItem:last-child { border-right: none; }
.catItem:hover { background: #fafafa; }
```

(Exact properties may differ — preserve anything already there except `opacity: 0`, `transform: translateY(20px)`, and the animation shorthand.)

- [ ] **Step 3: Add `useState` to imports in page.tsx if needed**

`useState` is already imported on line 10 — no change needed.

- [ ] **Step 4: Verify bounce-in in browser**

Navigate to `http://localhost:3000`. Scroll down to the "¿QUÉ SE TE ANTOJA?" row. The 6 category items should pop in one by one with an elastic overshoot. The count badges should count up from 0.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/page.module.css
git commit -m "feat: category icons GSAP back.out elastic bounce-in, CountUp on scroll entry"
```

---

## Task 9: MagneticButton component

**Files:**
- Create: `src/components/animations/MagneticButton.tsx`
- Modify: `src/components/animations/index.ts`

- [ ] **Step 1: Create MagneticButton.tsx**

Create `src/components/animations/MagneticButton.tsx`:

```tsx
'use client';

import { useRef } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  maxDisplace?: number;
}

export function MagneticButton({ children, className, maxDisplace = 12 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    const dist = Math.sqrt(x * x + y * y);
    const maxDist = Math.max(rect.width, rect.height);
    const factor = Math.min(1, (maxDist - dist) / maxDist);
    gsap.to(el, {
      x: x * factor * (maxDisplace / (maxDist / 2)),
      y: y * factor * (maxDisplace / (maxDist / 2)),
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  function onMouseLeave() {
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Export from index.ts**

Open `src/components/animations/index.ts`. Add the export:

```ts
export { MagneticButton } from './MagneticButton';
```

- [ ] **Step 3: Run TypeScript check**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 errors (or only pre-existing errors, none from MagneticButton).

- [ ] **Step 4: Commit**

```bash
git add src/components/animations/MagneticButton.tsx src/components/animations/index.ts
git commit -m "feat: MagneticButton GSAP cursor-pull wrapper component"
```

---

## Task 10: Wire MagneticButton to CTAs

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/Navbar/Navbar.tsx`

- [ ] **Step 1: Import MagneticButton in page.tsx**

Open `src/app/page.tsx`. Find the import on line 21:

```tsx
import { SplitReveal, ParallaxLayer, StaggerGrid } from '@/components/animations';
```

Add `MagneticButton` to the import:

```tsx
import { SplitReveal, ParallaxLayer, StaggerGrid, MagneticButton } from '@/components/animations';
```

- [ ] **Step 2: Wrap hero CTAs**

Find the hero CTA block (lines 128–135). Wrap each CTA link in `MagneticButton`:

```tsx
<div className={styles.heroCtas}>
  <MagneticButton>
    <Link href="/menu" className={styles.heroCtaDark}>
      {t.hero.cta1} <ArrowRight size={15} />
    </Link>
  </MagneticButton>
  <MagneticButton>
    <Link href="/events" className={styles.heroCtaOutline}>
      {t.hero.cta2}
    </Link>
  </MagneticButton>
</div>
```

- [ ] **Step 3: Import and wire MagneticButton in Navbar.tsx**

Open `src/components/Navbar/Navbar.tsx`. Add to the import section:

```tsx
import { MagneticButton } from '@/components/animations';
```

Find the ORDENA button (`<a href={WA_GENERAL} className={styles.orderBtn}>`, line ~47). Wrap it:

```tsx
<MagneticButton>
  <a href={WA_GENERAL} className={styles.orderBtn} target="_blank" rel="noopener noreferrer">
    <span className={styles.orderBtnPulse} />
    <span className={styles.orderBtnPulse2} />
    {WA_ICON} {t.nav.order}
  </a>
</MagneticButton>
```

- [ ] **Step 4: TypeScript check**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 errors.

- [ ] **Step 5: Verify magnetic effect in browser**

Navigate to `http://localhost:3000`. Hover toward the "VER MENÚ" and "ESTA NOCHE" buttons — they should shift toward the cursor. Hover toward the "ORDENA" button in the navbar — same effect. Move cursor away — they snap back with a slight bounce.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/Navbar/Navbar.tsx
git commit -m "feat: magnetic cursor pull on hero CTAs and ORDENA navbar button"
```

---

## Task 11: Menu filter pills bounce-in + list row slide-in

**Files:**
- Modify: `src/app/menu/page.tsx`

- [ ] **Step 1: Add imports and refs**

Open `src/app/menu/page.tsx`. Update the imports:

```tsx
import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitReveal, StaggerGrid, MagneticButton } from '@/components/animations';
```

Add `gsap.registerPlugin(ScrollTrigger)` right after the imports (before the component function):

```tsx
gsap.registerPlugin(ScrollTrigger);
```

Inside the `MenuPage` function, add a ref for the filter pills bar:

```tsx
const catsBarRef = useRef<HTMLDivElement>(null);
```

- [ ] **Step 2: Add GSAP bounce-in for filter pills**

After the `useState` declarations, add a `useGSAP`:

```tsx
useGSAP(() => {
  const bar = catsBarRef.current;
  if (!bar) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pills = gsap.utils.toArray<Element>(bar.querySelectorAll('button'));
  if (!pills.length) return;

  gsap.from(pills, {
    x: -10,
    scale: 0.9,
    opacity: 0,
    stagger: 0.06,
    duration: 0.45,
    ease: 'back.out(1.4)',
  });
}, { scope: catsBarRef });
```

- [ ] **Step 3: Attach ref to catsBar div**

Find the `<div className={styles.catsBar}>` (line 37). Attach the ref:

```tsx
<div ref={catsBarRef} className={styles.catsBar}>
```

- [ ] **Step 4: Wrap featured card order button with MagneticButton**

Find the `<a href={WA_ORDER(item.name)} className="btn-primary">` inside the featured card (line ~80). Wrap it:

```tsx
<MagneticButton>
  <a href={WA_ORDER(item.name)} className="btn-primary" target="_blank" rel="noopener noreferrer">
    <MessageCircle size={15} /> {t.menuPage.order}
  </a>
</MagneticButton>
```

- [ ] **Step 5: TypeScript check**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 errors.

- [ ] **Step 6: Verify in browser**

Navigate to `http://localhost:3000/menu`. On load, the filter pills (TODO, PIZZA, MARISCOS, etc.) should bounce in from the left one by one. Featured card order buttons should have the magnetic effect on hover.

- [ ] **Step 7: Add x-slide to home page menu list rows (spec 3i)**

Open `src/app/page.tsx`. Find the `menuListSection` block (around line 320). It currently wraps content in `<AnimSection>`. Replace the inner `<div className={styles.menuListGrid}>` with a `StaggerGrid` so each row slides in from `x: -20`:

```tsx
<AnimSection className={styles.menuListSection}>
  <div className="container">
    <div className={styles.sectionHeader}>
      <span className={styles.sectionHeaderLabel}>Exclusive</span>
      <span className={styles.sectionHeaderDivider} />
      <h2 className={styles.sectionHeaderTitle}>Our Menu</h2>
    </div>

    <StaggerGrid
      className={styles.menuListGrid}
      x={-20}
      y={0}
      scale={1}
      stagger={0.04}
      duration={0.45}
      start="top 88%"
    >
      {allItems.map((item) => (
        // ... existing item JSX unchanged
      ))}
    </StaggerGrid>
  </div>
</AnimSection>
```

Keep all existing item JSX inside unchanged — only replace `<div className={styles.menuListGrid}>` with the `StaggerGrid` wrapper.

Also update the `StaggerGrid` import on line 21 to confirm `StaggerGrid` is already imported (it is, from `@/components/animations`).

- [ ] **Step 8: TypeScript check**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npx tsc --noEmit 2>&1 | head -20
```

Expected: 0 errors.

- [ ] **Step 9: Verify in browser**

Navigate to `http://localhost:3000/menu`. Filter pills bounce in from left. Featured card order buttons magnetic. Navigate to `http://localhost:3000`, scroll to "Our Menu" section — rows slide in from left with stagger.

- [ ] **Step 10: Commit**

```bash
git add src/app/menu/page.tsx src/app/page.tsx
git commit -m "feat: filter pills elastic bounce-in; menu list rows x-slide; magnetic order buttons"
```

---

## Task 12: Final build verification + browser integration test

- [ ] **Step 1: TypeScript check**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npx tsc --noEmit
```

Expected: 0 errors.

- [ ] **Step 2: Production build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully` with no errors.

- [ ] **Step 3: Browser checklist — Home page**

Navigate to `http://localhost:3000` and verify:
- [ ] Hero text ("D'PAVO") splits char-by-char and animates in
- [ ] Hero text block drifts up more slowly than background on scroll (parallax depth)
- [ ] "Today's Special" badge floats up/down continuously
- [ ] "AUTHENTIC Flavor" badge floats continuously in About section
- [ ] Section labels ("NUESTROS PICKS", "Why D'Pavo") are gold
- [ ] Popular Picks cards stagger in with elastic overshoot
- [ ] Popular Picks card hover: 3D tilt + gold ring
- [ ] "VER MENÚ" / "ESTA NOCHE" buttons pull toward cursor
- [ ] Category icons bounce in with elastic pop; counts count up
- [ ] Why D'Pavo icons are gold; cards tilt on hover
- [ ] INICIO nav link has gold underline

- [ ] **Step 4: Browser checklist — Menu page**

Navigate to `http://localhost:3000/menu` and verify:
- [ ] "EL MENÚ" title is gold, clearly readable over background image
- [ ] Filter pills bounce in from left on load
- [ ] Featured cards: stagger elastic bounce; 3D tilt + gold glow on hover; magnetic order buttons
- [ ] Menu list cards stagger in as section enters viewport
- [ ] MENÚ nav link has gold underline

- [ ] **Step 5: Console check**

```bash
# In browser DevTools console — should show 0 errors
```

- [ ] **Step 6: Reduced motion check**

In Chrome DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`. All sections should be visible with no motion artifacts.

- [ ] **Step 7: Final commit**

```bash
git add -A
git commit -m "chore: verify animation & color enhancement — all checks pass"
```
