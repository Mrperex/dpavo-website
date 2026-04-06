# D'Pavo Pizza Website — Full Redesign Spec

**Date:** 2026-04-06  
**Project:** D'Pavo Urban Pizzeria — `/Users/mrperex/Projects/DPAVO PIZZA WEBSITE`  
**Stack:** Next.js 16.2.2 · React 19 · TypeScript · lucide-react

---

## Overview

Full redesign of the existing D'Pavo Urban Pizzeria Next.js site. The existing 3-page build has solid design tokens and structure but uses placeholder/meta copy. This redesign replaces it with a real restaurant website: 5 pages, a working ES/EN language toggle, real content data files, a reusable component library, and all WhatsApp-driven conversion flows.

---

## Architecture

### Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/menu` | Menu |
| `/events` | Events & Nightlife |
| `/about` | About / Our Story |
| `/gallery` | Gallery |

### Component Library

```
src/
  components/
    ui/
      Button/           — primary, secondary, ghost variants
      SectionHeader/    — label + h2 + optional subtext, reused across all sections
      Badge/            — pill tags (Trending, DJ Set, Main Event, etc.)
      Card/             — base card shell with border/glow variants
    layout/
      Navbar/           — sticky glassmorphism nav with ES/EN toggle
      Footer/           — upgraded with full links and info
      PageHero/         — reusable hero for inner pages (Menu, Events, About, Gallery)
    sections/
      Marquee/          — extracted from current Home, reusable ticker
  content/
    en.ts               — all English strings keyed by section
    es.ts               — all Spanish strings, same key structure
    menu.ts             — typed menu item data
    events.ts           — typed events data
    reviews.ts          — static customer review data
  context/
    LanguageContext.tsx  — React context + provider + useLanguage hook
```

### Language Toggle

- `LanguageContext` is a client-side React context
- `layout.tsx` (server component) renders a `<Providers>` client wrapper that holds `LanguageContext.Provider` — this is the standard Next.js App Router pattern for client context
- `type Lang = 'en' | 'es'`
- All UI strings come from `content/en.ts` or `content/es.ts` via `useLanguage()` hook
- Navbar has a toggle button: `ES | EN` — clicking flips the context
- No external i18n library, no routing changes, no `next-intl`
- Content objects are plain TypeScript — fully typed, easy to extend

### Design Tokens

Retain the existing color system:
- `--primary: #E30613` (red)
- `--secondary: #00B9AE` (teal)
- `--tertiary: #FFCC00` (yellow)
- `--background: #131313`
- `--foreground: #e5e2e1`

Typography, spacing scale, and responsive breakpoints get a full cleanup in `globals.css`.

---

## Pages

### Home (`/`)

Sections top to bottom:

1. **Navbar** — sticky, glassmorphism
2. **Hero** — full-viewport, image background support, headline "EAT. DRINK. PARTY.", two CTAs (View Menu + Tonight/Esta Noche), location + hours meta pills, animated scroll indicator
3. **Marquee ticker** — real brand phrases in ES/EN
4. **Signature Picks** — 3 featured menu items, image slots, WhatsApp order CTA
5. **How It Works** — 3-step process: Choose → Order on WhatsApp → Enjoy. Horizontal icon row.
6. **Day / Night split panel** — updated copy, real D'Pavo messaging
7. **Customer Reviews** — 3 static review cards (name, stars, quote)
8. **Opening Hours + Location** — hours table (Mon–Sun), address, static map placeholder, WhatsApp CTA
9. **Events preview** — 3 upcoming events, link to `/events`
10. **Full-bleed CTA banner** — "No te quedes fuera / Don't miss out", WhatsApp button
11. **Footer**

### Menu (`/menu`)

- **PageHero** with food-toned gradient
- **Category filter** — client component, `useState`, categories: Pizza · Mariscos · Picaderas · Drinks, smooth fade between states
- **Featured cards** — top 2–3 items, large format, image slot, price, WhatsApp CTA with pre-filled item name
- **Full menu grid** — 2-col, all non-featured items, category badge, WhatsApp action
- Data in `content/menu.ts` — typed, expandable

### Events & Nightlife (`/events`)

- **PageHero** — dark, moody
- **Featured event** — full-width card, image left / info right, WhatsApp reserve CTA
- **Weekly calendar** — 3 cards (Thu/Fri/Sat), icon, name, time, tag, WhatsApp reserve
- **Vibe section** — 3 atmosphere descriptors (DJ Sets, Live Music, Karaoke) as dark horizontal band
- **WhatsApp broadcast strip** — "Get notified about events" → WhatsApp broadcast link

### About / Our Story (`/about`)

- **PageHero** — warmer tone than nightlife pages
- **Origin story block** — two-column: text left, image slot right (venue photo)
- **Values / pillars** — 3 items: icon + title + copy (e.g. Local Roots, Urban Energy, Premium Ingredients)
- **Team section** — disabled by default (flag in content file), placeholder cards ready to activate when real photos available
- **Location & visit panel** — address, hours, map placeholder, WhatsApp CTA

### Gallery (`/gallery`)

- **PageHero** — minimal, dark
- **Filter tabs** — client component, `useState`, categories: All · Food · Venue · Events
- **Masonry grid** — CSS columns (no JS library), 3 cols desktop / 2 tablet / 1 mobile, aspect-ratio enforced slots, hover overlay with category badge, gradient placeholders for missing images
- **Lightbox** — click → full-screen overlay, pure `useState` + CSS, no external library

---

## Conversion Flow

All CTAs use WhatsApp deep links. The phone number is defined once as `WHATSAPP_NUMBER` in `content/config.ts` — never hardcoded inline. Pre-filled messages per flow:
- Menu item order: `Quisiera ordenar [item name]`
- Table reservation: `Quisiera reservar una mesa para [event name]`
- General contact: opens WhatsApp directly

No cart, no backend, no external ordering platform.

---

## Assets

- Logo: available (user has it)
- Food shots: partially available (some exist, others are placeholders)
- Venue photos: not yet available — design uses gradient placeholders with clear swap points
- All `<img>` tags use `next/image` with defined `width`/`height` or `fill` + wrapper sizing

---

## Animations

Inspired by the Crafto Pizza Parlor reference. Implemented with CSS `@keyframes` + native `IntersectionObserver` — no animation library added.

### Scroll-triggered entrance (all sections)
- A `useInView` custom hook wraps `IntersectionObserver` and returns a `ref` + `inView: boolean`
- Elements start as `opacity: 0; transform: translateY(24px)` and transition to `opacity: 1; transform: translateY(0)` when they enter the viewport
- Applied via a CSS class toggle: `.animate-in` added when `inView === true`
- `transition: 0.5s cubic-bezier(0.37, 0, 0.63, 1)`

### Staggered grid items
- Card grids (Signature Picks, Menu grid, Events calendar, Gallery) stagger children using `animation-delay: calc(var(--index) * 80ms)` via CSS custom property set inline

### Hover effects
- **Cards** — `transform: translateY(-4px)` + elevated `box-shadow` on hover, `transition: 0.3s ease`
- **Buttons** — scale `1.02` + glow shadow on hover (already partially in place)
- **Feature/highlight boxes** — border color brightens + subtle background shift, `transition: 0.4s cubic-bezier(0.61, 1, 0.88, 1)`

### Process step reveal
- Step items scale from `0.9` + `opacity: 0` to `1` + `opacity: 1` on scroll entry, staggered

### Navbar
- Hamburger icon: lines rotate/collapse on open, `transition: 0.25s`
- Navbar background solidifies on scroll (transparent at top → glassmorphism when scrolled)

### Marquee
- Existing CSS `animation: marquee` retained, speed tuned

---

## Out of Scope

- Online ordering cart
- Payment processing
- Email/backend form submissions
- External review API (Yelp, Google)
- Animation libraries (Framer Motion, GSAP) — native CSS + IntersectionObserver only
- CMS integration

---

## Key Constraints

- Next.js App Router patterns only — no Pages Router
- `'use client'` only where interactivity is required (filter tabs, lightbox, language toggle)
- All server components by default
- No new dependencies beyond what's already in `package.json`
