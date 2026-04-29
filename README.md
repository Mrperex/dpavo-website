# D'Pavo Pizza — Website

Pizzería urbana tropical website for D'Pavo Pizza in Verón, Punta Cana. Bilingual (ES/EN), Next.js 16 App Router on Vercel.

## Stack

- **Framework:** Next.js 16.2 (App Router, Turbopack, React Compiler)
- **UI:** React 19.2, TypeScript 5, CSS Modules
- **Animations:** GSAP + ScrollTrigger, Lenis (smooth scroll)
- **Analytics:** Vercel Analytics + Speed Insights, GA4
- **Hosting:** Vercel
- **Image optimization:** sharp + next/image (AVIF/WebP)

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

Create `.env.local` with:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Canonical site URL — drives sitemap, robots, OG, JSON-LD |
| `NEXT_PUBLIC_GA_ID` | Optional | GA4 measurement ID. Falls back to baked-in dev ID if unset. |

In Vercel: set in **Project Settings → Environment Variables** for Production, Preview, and Development.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run optimize-images` | Convert PNG/JPG in `public/media/` → WebP, backup originals to `_originals/` |
| `npm run remotion:studio` | Open Remotion studio for video pitch (devDeps) |
| `npm run remotion:render` | Render `out/dpavo-promo.mp4` |

## Project structure

```
src/
├── app/                    # App Router routes
│   ├── about/              # Story, values, location
│   ├── catering/           # Catering services + WA CTA
│   ├── contact/            # Map, hours, social
│   ├── events/             # Weekly calendar + ambient music FAB
│   ├── gallery/            # Lightbox masonry gallery
│   ├── menu/               # Filterable menu + cart drawer
│   ├── layout.tsx          # Root layout: fonts, JSON-LD, GA4, providers
│   ├── error.tsx           # Global error boundary
│   ├── loading.tsx         # Global loading fallback
│   ├── sitemap.ts          # Generated sitemap with images
│   └── robots.ts           # robots.txt
├── components/
│   ├── Navbar/             # Top nav + mobile drawer
│   ├── Footer/
│   ├── animations/         # SplitReveal, ParallaxLayer, MagneticButton, etc.
│   ├── layout/             # PageHero, PageTransition
│   └── ui/                 # CartDrawer, MusicFab, OrderModal, CookieConsent, etc.
├── content/                # Bilingual content (en.ts, es.ts) + menu, events, gallery
├── context/                # CartContext, LanguageContext
├── hooks/                  # useInView, useScrolled
├── lib/                    # schema.ts (JSON-LD generators)
└── types/                  # global.d.ts (window.gtag types)

public/media/               # WebP food images (originals in _originals/, gitignored)
scripts/optimize-images.mjs # Image pipeline (sharp)
docs/IMPROVEMENT-PLAN.md    # 51-item improvement roadmap
```

## Architecture decisions

- **CSS Modules** over Tailwind — preserved from original design, supports BEM-ish patterns and per-component scope.
- **No global state library** — Cart and Language use React Context with localStorage persistence.
- **Client-rendered pages** for animation-heavy routes; metadata exported from per-route `layout.tsx` files (Server Components).
- **WhatsApp deep links** as primary CTA channel — every order/reservation/contact funnels through `wa.me` with prefilled messages (see `src/content/config.ts`).
- **Bilingual via Context** — `LanguageContext` toggles `en`/`es` and syncs `<html lang>`. URL routing not yet split (see plan #41 for hreflang/i18n routing).
- **Image pipeline:** PNGs/JPGs are processed by `scripts/optimize-images.mjs` to WebP. Originals are kept locally in `public/media/_originals/` (gitignored).
- **Schema.org** generators in `src/lib/schema.ts` produce Restaurant + Menu JSON-LD with full MenuItem entities for AI search and rich results.

## Deployment

Push to `feature/full-redesign` (or main) → Vercel auto-deploys.

**Pre-deploy checklist:**
1. `npm run build` passes locally
2. `NEXT_PUBLIC_SITE_URL` set in Vercel env to the production domain
3. `NEXT_PUBLIC_GA_ID` set to the real GA4 ID (or leave fallback)
4. Domain verified in Pinterest/Facebook/Google for OG previews

## Roadmap

See [`docs/IMPROVEMENT-PLAN.md`](docs/IMPROVEMENT-PLAN.md) — 51 items across 12 phases covering performance, SEO, security, accessibility, conversion features (online ordering, reservations, newsletter, loyalty, FAQ, reviews), modern UX (View Transitions, dark mode, search), marketing (Microsoft Clarity, Meta Pixel, A/B testing), Vercel platform features (Edge Config, Cron, BotID, AI Gateway), and PWA.

## License

© D'Pavo Pizza. All rights reserved.

Website by [Pablo Pérez](https://wa.me/18295230782).
