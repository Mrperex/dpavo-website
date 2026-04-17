# D'Pavo Animation & Color Enhancement — Design Spec

**Date:** 2026-04-17  
**Status:** Approved  
**Scope:** Home page + Menu page — additional animations, yellow/gold color expansion, menu hero text fix

---

## Context

The animation system was installed and verified (commits `5e5494d`–`fb88ffe`). The client now wants:
1. More and better animations — direction: **Energetic / Street Bold** (fast snaps, elastic easing, hover pops)
2. More gold (`#ECBA23`) throughout the site
3. Menu page hero text visibility fix ("EL MENÚ" unreadable on background image)

---

## Fix 1 — Menu Hero Text Visibility

**File:** `src/components/layout/PageHero/PageHero.module.css`

The `.title` class has no `color` set, inheriting `var(--text)` (`#232323`) from `body`. The backdrop overlay exists but the dark text still reads poorly against the mixed background image.

**Changes:**
- `.title` → `color: #fff` (default for all PageHero usages)
- `.label` inside `.hero` → `color: rgba(255,255,255,0.7)` (override the global `.label` red)
- Menu page title goes gold specifically: in `src/app/menu/page.tsx`, wrap the title text in `<span style={{ color: 'var(--gold)' }}>` — no new tone variant needed, cleaner than a CSS override

---

## Fix 2 — Gold Color Expansion

Gold token: `--gold: #ECBA23` (also `--secondary`, `--tertiary`). Currently appears only on: hero title, Today's Special badge, price labels.

### Placements

| Location | File | Change |
|---|---|---|
| Section eyebrow labels on light backgrounds | `src/app/globals.css` + section overrides | `.label` stays red globally; add `.labelGold` utility class with `color: var(--gold)` — apply to Picks, Why D'Pavo, About section labels |
| Why D'Pavo card icons | `src/app/page.module.css` | `.whyIcon` stroke/fill → `var(--gold)` |
| Menu card hover border + glow | `src/app/page.module.css`, `src/app/menu/menu.module.css` | On `:hover`: `border-color: var(--gold)`, `box-shadow: 0 0 24px rgba(236,186,35,0.25)` |
| Menu page hero title | `src/app/menu/page.tsx` | Wrap title text in `<span style={{ color: 'var(--gold)' }}>` — inherits white `.title` base, gold override scoped to menu page only |
| Navbar active-page underline | `src/components/Navbar/Navbar.module.css` | Active link gets `::after` pseudo-element with `background: var(--gold)`, `height: 2px` |

**Rule:** Red stays on navbar background, primary CTA fills, badges, and red-background sections. Gold is accent-only on light surfaces.

---

## Fix 3 — Animation Additions

All new animations use GSAP (already installed). Reduced-motion guard applies to all scroll-triggered and continuous animations.

### 3a — Multi-layer Hero Parallax

**File:** `src/app/page.tsx` + `src/app/page.module.css`

The hero already has a `ParallaxLayer` on the pizza image (`speed=0.35`). Extend to three layers:

| Layer | Element | Speed | Direction |
|---|---|---|---|
| Background texture | `.hero` background | 0.08 | scroll down = moves up slowly |
| Hero text block | `.heroInner` | 0.12 | slightly slower than scroll |
| Pizza image | `.heroImageWrap` | 0.35 | already implemented |

Implementation: GSAP `ScrollTrigger` with `scrub: true` on `useGSAP` in `page.tsx`. The existing `ParallaxLayer` component handles the pizza; add direct GSAP `scrub` on the text block and a CSS `background-attachment: fixed`-style effect on the hero bg.

### 3b — Floating Badges (Continuous Loop)

**File:** `src/app/page.tsx`

Two elements get a perpetual float animation on mount:
- `Today's Special` badge (`.todayBadge` in hero)
- `AUTHENTIC Flavor` badge (`.aboutBadge` or equivalent in about section)

```
gsap.to(element, { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
```

No ScrollTrigger — starts on mount, runs forever. Paused when `prefers-reduced-motion`.

### 3c — Elastic Easing on Card Stagger

**Files:** `src/components/animations/StaggerGrid.tsx`, any direct card animations

Replace `power3.out` with `back.out(1.4)` on:
- Popular Picks cards (home)
- Why D'Pavo cards (home)
- Featured menu cards (menu page)
- Menu list rows (menu page)

Also change stagger from `0.08` → `0.06` (slightly faster succession for street-energy feel).

### 3d — Number Counters on Category Badges

**File:** `src/app/page.tsx` (the `¿QUÉ SE TE ANTOJA?` category icon section)

Each category badge (currently static numbers: 8, 1, 2, 1, 4, 10) counts from `0` to its real value when the section scrolls into view.

Implementation: GSAP `ScrollTrigger` + `gsap.to({ val: 0 }, { val: N, duration: 1.2, ease: 'power2.out', onUpdate })` pattern. Uses a ref per badge or a single timeline targeting all badges sequentially.

### 3e — Magnetic Buttons

**File:** new `src/components/animations/MagneticButton.tsx` wrapper component

A wrapper that intercepts `mousemove` on the button area (slightly larger hit zone via padding), calculates cursor offset from center, and applies `gsap.to(el, { x, y, duration: 0.4, ease: 'power2.out' })`. On `mouseleave`, resets to `x:0, y:0`.

Max displacement: `±12px`. Applied to:
- Navbar `ORDENA` button
- Hero `VER MENÚ` CTA
- Hero `ESTA NOCHE` CTA  
- Menu card `ORDENAR AHORA` buttons
- WhatsApp CTA buttons

The component wraps any `children` — no change to existing button markup beyond swapping the wrapper.

### 3f — Category Icon Row Bounce-In

**File:** `src/app/page.tsx`

The 6 category icons (`¿QUÉ SE TE ANTOJA?` row) currently appear without animation. Add a `StaggerGrid`-style entrance:

```
gsap.from(iconEls, {
  y: 30, scale: 0.8, opacity: 0,
  stagger: 0.06,
  duration: 0.55,
  ease: 'back.out(1.4)',
  scrollTrigger: { trigger: section, start: 'top 75%' }
})
```

### 3g — 3D Tilt on Card Hover

**File:** `src/app/page.module.css`, `src/app/menu/menu.module.css`

Popular Picks cards, Why D'Pavo cards, Featured menu cards get a 3D perspective tilt on hover:

```css
.card {
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}
.card:hover {
  transform: perspective(600px) rotateY(6deg) rotateX(3deg) scale(1.03);
}
```

Pure CSS — no GSAP needed. On mobile (touch), disabled via `@media (hover: none)`.

### 3h — Filter Pills Bounce-In (Menu Page)

**File:** `src/app/menu/page.tsx`

The category filter pills (TODO, PIZZA, MARISCOS, etc.) animate in on mount with a stagger bounce. Same pattern as 3f but `x: -10` instead of `y: 30`.

### 3i — Menu List Row Slide-In

**File:** `src/app/page.tsx` (menu list section on home) + `src/app/menu/page.tsx`

Each list row slides from `x: -20, opacity: 0` to rest as the category section enters viewport. Stagger `0.04s` per row.

---

## Architecture Notes

- `MagneticButton` is the only new component. Everything else uses existing `StaggerGrid`, `SplitReveal`, `useGSAP`, direct GSAP calls.
- All GSAP animations check `window.matchMedia('(prefers-reduced-motion: reduce)')` and skip if true.
- Floating badge animation (3b) uses `gsap.context()` cleanup via `useGSAP` to avoid memory leaks on unmount.
- CSS-only tilt (3g) has zero JS cost and degrades gracefully.

---

## Files to Modify

| File | Changes |
|---|---|
| `src/components/layout/PageHero/PageHero.module.css` | `.title` color white; `.hero .label` color override |
| `src/app/globals.css` | Add `.labelGold` utility class |
| `src/app/page.module.css` | Why icon gold; card hover gold border/glow; label gold on applicable sections |
| `src/app/menu/menu.module.css` | Card hover gold border/glow |
| `src/components/Navbar/Navbar.module.css` | Active link gold underline |
| `src/app/page.tsx` | Parallax text layer; floating badges; counter badges; category bounce-in; list row slide-in |
| `src/app/menu/page.tsx` | Filter pills bounce-in; list row slide-in |
| `src/components/animations/StaggerGrid.tsx` | Elastic easing + faster stagger |

**New file:**
| File | Purpose |
|---|---|
| `src/components/animations/MagneticButton.tsx` | Cursor-magnetic wrapper for CTA buttons |

---

## Verification Checklist

1. `npx tsc --noEmit` — 0 errors
2. `npm run build` — clean build
3. Browser: hero parallax depth visible on scroll
4. Browser: badges float continuously
5. Browser: cards snap back with elastic overshoot on scroll entry
6. Browser: badge numbers count up on first scroll into view
7. Browser: ORDENA button pulls toward cursor
8. Browser: "EL MENÚ" readable on menu hero
9. Browser: gold visible on Why icons, card hover, nav underline
10. DevTools → Rendering → `prefers-reduced-motion: reduce` → all sections visible, no motion
