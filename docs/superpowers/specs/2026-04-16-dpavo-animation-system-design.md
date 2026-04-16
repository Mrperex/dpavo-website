# D'Pavo Animation System — Design Spec
**Date:** 2026-04-16
**Status:** Approved

## Background

D'Pavo Pizza Website (Next.js 16 / React 19 / CSS Modules) currently uses a simple `useInView` hook + CSS `animate-in` class for scroll animations — a single fade-in per section. The goal is to reverse-engineer the animation system from [incredifulls.com](https://incredifulls.com) — a Shopify site that uses GSAP + ScrollTrigger + Splitting.js + Lenis — and bring the best patterns into D'Pavo's Home and Menu pages. All findings get encoded into a permanent Claude Code skill for reuse on future projects.

## Scope

**Pages:** Home (`src/app/page.tsx`) + Menu (`src/app/menu/page.tsx`)
**Animations:** 6 types (smooth scroll, text reveals, parallax, marquee, pinned scroll, staggered cards)
**Out of scope:** About, Events, Gallery pages (for now). Rive mascot animations (proprietary format). Adobe Typekit fonts (licensed).

---

## Phase 1 — Install Tools & Packages

### npm packages (added to DPAVO)
| Package | Version | Purpose |
|---|---|---|
| `gsap` | latest | Core animation engine (free tier includes ScrollTrigger) |
| `@gsap/react` | latest | React-safe `useGSAP` hook with automatic cleanup |
| `lenis` | latest | Smooth inertia scroll — wraps native scroll |
| `splitting` | latest | Open-source SplitText alternative — splits text into `<span>` chars/words |

### System tools (global installs)
| Tool | Install | Purpose |
|---|---|---|
| `mitmproxy` | `pip install mitmproxy` | TLS-capable intercepting proxy — captures all network assets |
| `playwright` | already in devDeps | Browser automation for full-site scan |

### SplitText alternative rationale
**Splitting.js** (4.5k+ stars, MIT) is the best free alternative to GSAP's paid SplitText club plugin. It splits text into individual `<span>` elements with CSS custom properties (`--char-index`, `--word-index`) that GSAP can target. The pattern `gsap.from('[data-splitting] .char', { y: 80, opacity: 0, stagger: 0.03 })` exactly replicates what incredifulls does with SplitText.

---

## Phase 2 — Full Site Scan

A Playwright script (`scripts/scan-incredifulls.mjs`) crawls every reachable page of incredifulls.com:

**Pages to scan:** `/` · `/collections/all` · `/products/*` · `/pages/store-finder` · any other linked pages

**Per page the script:**
1. Waits for full JS execution and idle network
2. Evaluates `window.gsap`, `window.ScrollTrigger`, `window.lenis` to dump live config
3. Extracts all `gsap.timeline()` and `gsap.from/to()` calls from script tags
4. Scrolls from 0 → bottom in 200px increments, screenshotting every position
5. Downloads all `*.js` and `*.css` assets from `incredifulls.com/cdn/shop/t/60/assets/`
6. Records all animation config values: duration, ease, stagger, scrub, pin settings

**Output saved to:** `Projects/Reverse-Engeneer-Website/scan/`
```
scan/
  assets/         # all JS/CSS files
  screenshots/    # per-page scroll screenshots
  animation-config.json   # extracted GSAP configs
  network-log.har         # full HAR file
```

**mitmproxy usage:** Run alongside Playwright to capture any assets that require TLS interception (fonts, CDN assets loaded dynamically). Command: `mitmdump -w scan/traffic.mitm`.

---

## Phase 3 — Reusable Skill

A permanent Claude Code skill saved to `~/.claude/skills/pizza-animations.md` (or the user's configured skills directory). Invoked with `/pizza-animations` on any future project.

**Skill contains:**
- Installation commands for all packages
- 6 ready-to-use code templates (one per animation type) with exact config values extracted from incredifulls
- React/Next.js safety patterns: SSR guard (`typeof window !== 'undefined'`), `useGSAP` cleanup, Lenis RAF integration
- Splitting.js + GSAP integration pattern
- Common pitfalls (GSAP context cleanup, Lenis + ScrollTrigger sync, `will-change` performance)

---

## Phase 4 — Implementation in D'Pavo

### New file structure
```
src/
  hooks/
    useGSAP.ts          # wraps @gsap/react useGSAP with SSR guard
    useLenis.ts         # initializes Lenis, syncs with GSAP ticker
  components/
    animations/
      SplitReveal.tsx   # wraps Splitting.js + GSAP text reveal
      ParallaxLayer.tsx # wraps ScrollTrigger parallax
      StaggerGrid.tsx   # wraps staggered card entrance
```

### Home page changes (`src/app/page.tsx`)

| Section | Before | After |
|---|---|---|
| Global | Hard scroll | Lenis smooth scroll |
| Hero image | Static | Parallax — moves at 0.4x scroll speed on Y axis |
| Hero heading | CSS fade-in | Splitting.js char-by-char reveal with stagger 0.03s |
| About heading | CSS fade-in | Word-by-word reveal, y:60 → 0, ease: `power3.out` |
| "Why D'Pavo" grid | CSS fade-in | ScrollTrigger stagger, each item 0.1s delay |
| Popular Picks cards | CSS fade-in | Stagger entrance — scale 0.85→1 + y:40→0 per card |
| Marquee | CSS animation | Lenis-synced CSS infinite scroll, pause on hover |
| About section | Scrolls past | Pinned scroll — section freezes while content reveals in stages via ScrollTrigger |

### Menu page changes (`src/app/menu/page.tsx`)

| Section | Before | After |
|---|---|---|
| Global | Hard scroll | Lenis smooth scroll |
| Section headers | CSS fade-in | Splitting.js word reveal |
| Menu item cards | CSS fade-in | Staggered entrance per category group |

### Compatibility
- SSR safe: all GSAP/Lenis code runs only in `useEffect` / `useGSAP` (client-only)
- Respects `prefers-reduced-motion`: all animations wrap in a media query check
- No conflict with existing `useInView` hook — it stays for non-animated sections

---

## Animation Config Values (from incredifulls scan — to be confirmed)

Preliminary values from network request analysis (will be confirmed/updated after Phase 2 scan):

```js
// Lenis init
new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })

// Text reveal (Splitting.js chars)
gsap.from('[data-splitting] .char', {
  y: 80, opacity: 0, stagger: 0.03,
  duration: 0.8, ease: 'power3.out',
  scrollTrigger: { trigger: el, start: 'top 80%' }
})

// Parallax layer
gsap.to(img, {
  yPercent: -20,
  ease: 'none',
  scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true }
})

// Staggered cards
gsap.from(cards, {
  y: 40, opacity: 0, scale: 0.92,
  stagger: 0.08, duration: 0.6, ease: 'power2.out',
  scrollTrigger: { trigger: container, start: 'top 85%' }
})
```

---

## Success Criteria

- [ ] All 6 packages installed, no TypeScript errors
- [ ] mitmproxy installed and functional
- [ ] Scan script crawls all incredifulls pages, outputs to `Reverse-Engineer-Website/scan/`
- [ ] Skill file created and invokable as `/pizza-animations`
- [ ] Lenis smooth scroll active on Home + Menu with no scroll jank
- [ ] Hero parallax visible and smooth on Home
- [ ] Text reveals fire on headings in Home About + Why sections
- [ ] Popular Picks cards stagger in on scroll
- [ ] Marquee upgraded and smooth
- [ ] Menu cards stagger in per category
- [ ] `prefers-reduced-motion` respected globally
- [ ] No SSR errors in Next.js build
