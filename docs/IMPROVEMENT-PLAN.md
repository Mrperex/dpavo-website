# D'Pavo Pizza — Auditoría y Plan de Mejoras

**Fecha:** 2026-04-29
**Branch:** `feature/full-redesign`
**Stack:** Next.js 16.2.2, React 19.2, TypeScript 5, GSAP, Lenis, CSS Modules

---

## Resumen Ejecutivo

Auditoría completa del sitio. Combina (a) fixes técnicos críticos, (b) hallazgos de SEO/security/accesibilidad, y (c) **nuevas oportunidades estratégicas para convertir el sitio de "brochure" a plataforma con conversión real** (online ordering, reservaciones, retención email, retargeting, AI search optimization).

**Lighthouse estimado actual:** Performance ~30-40, SEO ~85, Best Practices ~75, A11y ~80
**Objetivo post-plan:** Performance 90+, SEO 95+, Best Practices 95+, A11y 95+
**Objetivo de negocio:** subir conversión (clicks WhatsApp → órdenes), capturar emails, integrar reservas, posicionar en Google Maps "pizzería verón", aparecer en búsquedas AI (ChatGPT/Gemini/Perplexity).

---

## P0 — CRÍTICO (impacto inmediato en UX, conversión y ranking)

### 1. Imágenes catastróficamente grandes (LCP roto)

**Hallazgo:** 14 imágenes entre 15-22MB en `/public/media`. `red-hero-background.jpg` = 20MB. `pizza-meatballs.png` = 22MB. Total ≈ 300MB+. LCP probable >10s en móvil 4G.

| Archivo | Tamaño actual | Tamaño objetivo |
|---|---|---|
| `red-hero-background.jpg` | 20MB | < 200KB (1920×1080 WebP) |
| `pizza-meatballs.png` | 22MB | < 150KB (800×800 WebP) |
| `pizza-shrimps/chicken/tostones.png` | 21MB c/u | < 150KB c/u |
| `pizza-cheese-solo/hawaiian/tomato.png` | 16-19MB | < 150KB c/u |

**Acción:**
- Script `scripts/optimize-images.mjs` con `sharp`: convertir todos los PNG/JPG a WebP @ 1600px máx, calidad 82
- Reemplazar 11 `<img>` raw por `<Image>` de Next.js (next/image ya configurado para AVIF/WebP)
- Hero LCP: `<Image priority fetchPriority="high">` con blur placeholder

**Archivos a modificar:** `src/app/page.tsx` (5), `menu/page.tsx`, `catering/page.tsx`, `CartDrawer.tsx`, `OrderModal.tsx`, `InstaGrid.tsx`.

### 2. CartContext no persiste

Refrescar la página = carrito vacío. Hidratar desde `localStorage` con `useEffect` (post-mount para evitar hydration mismatch).

### 3. Catering missing en drawer móvil

`Navbar.tsx` línea 89-97 no incluye `/catering`. Añadir `['/catering', t.nav.catering]`.

### 4. Cart total format

Forzar `maximumFractionDigits: 0` en `toLocaleString('es-DO')`.

---

## P1 — ALTO (SEO, seguridad, fundamentos)

### 5. Headers de seguridad faltantes

Faltan CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Permissions-Policy, Referrer-Policy. Ampliar `headers()` en `next.config.ts`.

### 6. Metadata por página incompleta

Solo el global tiene title/OG. Las 6 sub-páginas (menu/events/about/gallery/contact/catering) necesitan `export const metadata` con title, description, canonical y OG únicos.

### 7. JSON-LD Restaurant schema completo

- Cambiar `@type: 'FoodEstablishment'` → `'Restaurant'`
- Añadir `acceptsReservations`, `menu`, `paymentAccepted`, `currenciesAccepted: 'DOP'`, `priceRange`, `aggregateRating`
- Añadir `@type: 'Menu'` con `hasMenuSection` → `hasMenuItem` (precio, imagen, descripción, allergens, suitableForDiet)
- Añadir `@type: 'BreadcrumbList'` por página
- Crear `src/lib/schema.ts` con generadores reutilizables

### 8. GA4 ID hardcoded + uso de `any`

`G-R8WQJE9BKW` hardcoded → `process.env.NEXT_PUBLIC_GA_ID`. `(window as any).gtag` → `src/types/global.d.ts` con `declare global`.

### 9. API Instagram obsoleta

`/api/instagram` usa Basic Display API (descontinuada sept 2024). Eliminar la ruta + `InstaGrid` + dependencia `react-social-media-embed`.

---

## P2 — MEDIO (calidad, accesibilidad, mantenimiento)

### 10. Accesibilidad
- Sincronizar `document.documentElement.lang` con `LanguageContext` toggle ES/EN
- `type="button"` en todos los botones no-submit
- `aria-live` en filter count del menú
- Cookie consent focus trap
- Skip-to-content link en layout
- Audit de contraste WCAG 2.2 AA

### 11. Cursor + Lenis en mobile/reduced-motion
- `Cursor.tsx`: condicionar render con `(pointer: fine)` media query
- Lenis: respetar `prefers-reduced-motion`

### 12. Bundle hygiene
- Mover `Remotion` y `@remotion/*` a `devDependencies` (no deben ir al bundle de producción)
- Dynamic import de `canvas-confetti` (solo se usa en menu)
- `package.json` `"name": "tmp-app"` → `"dpavo-pizza-website"`

### 13. CSP-friendly JSON-LD
Mover `<script dangerouslySetInnerHTML>` a `<Script type="application/ld+json">` (compatibilidad con CSP nonces a futuro).

---

## P3 — REFINAMIENTO Y BEST PRACTICES

### 14. Consolidar tokens CSS legacy
`--red`/`--primary`, `--gold`/`--secondary`/`--tertiary` duplicados. Refactor a un solo nombre.

### 15. `loading.tsx` y `error.tsx` globales
Skeleton loading + error boundary con reporte a Vercel Analytics.

### 16. Sitemap mejorado
Añadir `images` por URL. `lastModified` real basado en commits.

### 17. README actualizado
Documentar env vars, scripts, decisiones arquitectónicas.

---

## P4 — UPGRADES ESTRATÉGICOS (nuevas capacidades de negocio)

### A — Conversion / Restaurant Features

#### 18. Online ordering nativo con Stripe Checkout
**Razón:** 82% de clientes prefieren ordenar directo del sitio del restaurante (DoorDash data 2026). Direct ordering ahorra 15-30% por orden vs comisión apps. Hoy todo va a WhatsApp deep-link → fricción + sin tracking.

**Acción:**
- Botón "Pedir online" alternativo al WhatsApp (ambos coexisten)
- Stripe Checkout via `src/app/api/checkout/route.ts`: `checkout.sessions.create` desde el cart
- Páginas `/order/success` y `/order/cancel`
- Webhook `/api/stripe/webhook` → email recibo (Resend) + notificación WA al staff
- Checkout invitado (sin auth): nombre, teléfono, dirección delivery o pickup
- GA4 `purchase` event con valor

#### 19. Sistema de reservas
**Razón:** Restaurante con servicio mesa + eventos viernes/sábado. Capturar reservas online ahorra llamadas y aumenta ocupación.

- **Opción A (cero código):** OpenTable / Resy iframe en `/contact` y `/events`
- **Opción B (nativo):** form name/phone/datetime/guests + Resend email staff + confirmación cliente. `src/app/api/reservations/route.ts`
- GA4 `generate_lead` event

#### 20. Newsletter con Resend
**Razón:** Email = mejor ROI para retención (promos martes 2x1, viernes evento).

- Footer: form "Suscríbete" → POST `/api/subscribe` → Resend audience
- Validación + Vercel BotID anti-spam
- Integrable con loyalty (#21)

#### 21. Programa de loyalty MVP (sin login)
**Razón:** Cross-channel loyalty es trend 2026 — incrementa repeat orders.

- Cliente da número WhatsApp en cart antes de checkout/WA → Vercel KV acumula puntos
- A los X órdenes → email automático con código descuento
- Clave Vercel KV: `loyalty:{phone}` → counter

#### 22. Google Reviews widget
**Razón:** Social proof aumenta conversión 25%+. `aggregateRating` en JSON-LD = rich results en Google.

- Google Places API (Place Details) con `place_id`
- Vercel Cron diario refetch reviews + rating
- Cache en Vercel KV
- `<ReviewsCarousel />` en home
- Inyectar `aggregateRating` en JSON-LD `Restaurant`

#### 23. FAQ section + FAQ schema
**Razón:** Aún con cambios Google 2023, FAQ schema ayuda con featured snippets. **Crítico para AI search 2026** (ChatGPT/Gemini/Perplexity scrapean structured data).

- Sección en `/about` o página `/faq`: 8-12 preguntas (delivery zones, opening hours, vegan/gluten-free, allergens, reservations, parking, kids menu, payment methods, group bookings, dress code, music nights, catering)
- JSON-LD `@type: FAQPage`

#### 24. MenuItem schema con allergens y dieta
**Razón:** Google rich results para menú + AI search optimization. Resultados pueden mostrar precios y dishes directamente.

- Extender `src/content/menu.ts` con `allergens?: string[]`, `nutrition?: {...}`, `suitableForDiet?: 'VeganDiet' | 'GlutenFreeDiet'`
- JSON-LD `Menu` → `hasMenuSection` (Pizzas, Mariscos, Picaderas, Drinks) → `hasMenuItem` completo

#### 25. Menu filters por dieta
- Toggle "Vegano", "Sin gluten", "Picante" usando datos de #24
- URL state: filtros en query params (`/menu?diet=vegan&cat=Pizza`) — links shareables

---

### B — Modern UX

#### 26. View Transitions API (Next.js 16 + React 19.2)
**Razón:** Animaciones smooth entre páginas, sin flash blanco. Mejor UX percepción.

- Activar `experimental.useCache: true` (Next 16.2)
- Wrap shared layouts con `<ViewTransition name="hero">` para animar hero al navegar
- `<Link transitionTypes={['fade']}>` en Navbar

#### 27. Búsqueda en menú
Input que filtra por nombre/descripción. Estado en URL (`?q=trufa`). Útil con 12+ items.

#### 28. Dark mode
Tokens `[data-theme="light"]` invertidos en `globals.css`. Toggle con `localStorage` + `prefers-color-scheme` sync.

#### 29. Skip-to-content + a11y polish
`<a href="#main-content" className="visually-hidden-focusable">Saltar al contenido</a>` al top de body. Navegación teclado completa.

---

### C — Marketing & Analytics

#### 30. Microsoft Clarity (heatmaps gratis)
**Razón:** Free heatmaps + session replay. Identifica friction reales sin presupuesto.

Crear cuenta clarity.microsoft.com → inyectar script en `layout.tsx` después de consent.

#### 31. Meta Pixel + Conversions API
**Razón:** Para correr Facebook/Instagram ads de retargeting.

- Pixel client-side via `<Script>` con consent
- Server-side via Conversions API (mejor coverage post-iOS 14): `src/app/api/conversions/route.ts`
- Eventos: `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`, `Lead`

#### 32. Web Vitals → GA4
**Razón:** Medir Core Web Vitals **reales** (no solo Lighthouse lab data).

- `web-vitals` library → reportar `CLS, INP, LCP, FCP, TTFB` a GA4
- Vercel Speed Insights ya está, pero esto añade granularidad por país/device

#### 33. A/B testing con Vercel Edge Config + GrowthBook
**Razón:** Optimizar copy, CTAs, layouts sin redeploy. Cero coste server.

- Edge Config como feature flag store
- Middleware lee config y asigna variante (cookie sticky)
- Eventos GA4 con `experiment_id` y `variant_id`

#### 34. Consent Mode v2 (Google) + cookies granulares
**Razón:** Compliance EU + mejor data quality en GA4 con consent denied.

- CookieConsent → 4 categorías: necessary, analytics, marketing, preferences
- Toggle individual por categoría
- `gtag('consent', 'update', { analytics_storage, ad_storage, ad_user_data, ad_personalization, functionality_storage, personalization_storage, security_storage })`

#### 35. Conversion tracking events full-funnel
Centralizar en `src/lib/analytics.ts`:
- `trackViewMenu`, `trackAddToCart`, `trackInitiateCheckout`, `trackPurchase`, `trackClickWhatsApp`, `trackReservation`, `trackNewsletterSignup`
- Cada uno dispara GA4 + Meta Pixel + Clarity custom event

---

### D — Vercel Platform Features

#### 36. Edge Config promo banners
**Razón:** Mostrar/ocultar banners promocionales sin redeploy. Lectura sub-1ms en edge.

- Banner que lee `edge-config:promo` via `@vercel/edge-config`
- Admin actualiza JSON desde Vercel dashboard

#### 37. Vercel Cron jobs
**Razón:** Tareas programadas serverless gratis.

- Diario 4am: refresh sitemap + invalidar cache
- Diario 6am: re-fetch Google Reviews (#22)
- Lunes 9am: newsletter "Eventos de la semana" (Resend audience)

#### 38. Vercel Blob para galería UGC
**Razón:** Clientes suben fotos → moderate manual → publicar en `/gallery`. UGC = trust signal + SEO.

#### 39. Vercel BotID
**Razón:** Proteger forms (newsletter, reservations, contact) sin captcha visible.

GA en Vercel desde junio 2025. Inyectar script + verificar en API routes.

#### 40. Vercel AI Gateway (chatbot)
**Razón:** Chat 24/7 que responde preguntas comunes (hours, menu, allergens) → captura leads.

AI SDK v6 + AI Gateway con prompt: "Eres recepcionista de D'Pavo Pizza..." + RAG sobre menu/horarios/FAQ. Reemplaza WhatsApp FAB en horario fuera de servicio.

---

### E — SEO Avanzado

#### 41. Hreflang ES/EN
**Razón:** Sitio bilingüe pero todo en misma URL. Google no entiende qué versión servir a qué audiencia.

- Migrar a routing i18n: `/es/menu`, `/en/menu` (Next.js i18n built-in)
- O alternativa más ligera: `?lang=en` con `<link rel="alternate" hreflang>` en metadata

#### 42. Open Graph dinámico con `next/og`
- `src/app/menu/opengraph-image.tsx` → genera 1200x630 con texto + featured pizza
- Repetir para `/events`, `/about`, `/contact`, `/catering`

#### 43. og:video + Twitter Player Card
- `metadata.openGraph.videos: [{ url: '/media/dpavo-hero.mp4', width: 1920, height: 1080 }]`
- Twitter card type `'player'`

#### 44. Pinterest Rich Pins
**Razón:** Comida = top categoría Pinterest. Rich Pins muestran precio + descripción.

- Verificar dominio en Pinterest Developers
- Open Graph product tags (`product:price:amount`, `product:price:currency`)

---

### F — PWA

#### 45. Web App Manifest
- `public/manifest.json` con name, icons (192, 512), theme_color, background_color, start_url
- `<link rel="manifest">` en layout

#### 46. Service Worker offline
- Plugin `@ducanh2912/next-pwa` o custom SW con Workbox
- Strategies: `network-first` HTML, `cache-first` `/media/*`
- Offline fallback page

#### 47. Add to Home Screen prompt
Detectar `beforeinstallprompt` → CTA "Instala D'Pavo en tu home" en mobile.

---

### G — DevX / Testing / Observability

#### 48. Sentry para errores
- `@sentry/nextjs` install → wizard
- Source maps upload en build

#### 49. Performance budget en CI
- GitHub Action con `size-limit` que falle el PR si JS >250KB gzip
- Lighthouse CI con thresholds

#### 50. Visual regression Playwright
- `tests/visual.spec.ts` con `toHaveScreenshot()` por ruta y breakpoint
- GitHub Action en cada PR

#### 51. axe-core a11y
`@axe-core/playwright` → assert sin violaciones por ruta

---

## Plan de Implementación por Fases

| Fase | Descripción | Tiempo |
|---|---|---|
| **1** | Performance crítica (#1-#4) | 1-2 días |
| **2** | Seguridad y SEO base (#5-#9) | 1-2 días |
| **3** | Accesibilidad y calidad (#10-#13) | 1 día |
| **4** | Refinamiento (#14-#17) | ½ día |
| **5** | Conversion features (#18-#25) | 3-5 días |
| **6** | UX moderno (#26-#29) | 1-2 días |
| **7** | Marketing & Analytics (#30-#32, #34-#35) | 1 día |
| **8** | Plataforma Vercel (#36-#37, #39) | 1 día |
| **9** | SEO avanzado (#41-#44) | 1 día |
| **10** | PWA (#45-#47) | ½ día |
| **11** | Testing / Observability (#48-#51) | 1 día |
| **12** | A/B + AI (#33, #38, #40) — futuro post-launch | TBD |

**Total fases 1-11:** ~13-17 días de trabajo enfocado.

---

## Verificación

| Aspecto | Cómo medir |
|---|---|
| LCP | Lighthouse mobile + DevTools → <2.5s |
| Cart persistence | Refrescar con items → carrito intacto |
| CSP | DevTools Network Headers → ver CSP activo |
| SEO | view-source → title/description únicos por ruta + Rich Results Test pass |
| JSON-LD | [Google Rich Results Test](https://search.google.com/test/rich-results) → Restaurant + Menu + BreadcrumbList valid |
| A11y | Lighthouse 95+, navegar todo con teclado, axe-core sin violations |
| Mobile drawer | Móvil → "Catering" visible |
| Imágenes | Network → `image/webp`/`avif` <200KB |
| Online order | E2E: home → menu → add to cart → checkout Stripe test → email recibo |
| Reservations | Form submit → email staff + confirmation cliente |
| Newsletter | Submit → contact en Resend audience |
| Reviews | Home → carousel reviews reales + JSON-LD aggregateRating |
| Search | `/menu?q=trufa` → solo "Hongos & Trufa" visible |
| View Transitions | Navegar /menu → /events → animación smooth |
| PWA | Lighthouse PWA = 100, "Install" disponible en Chrome address bar |
| Web Vitals | Real user data en GA4 dashboard tras 1 semana |

---

## Referencias

**Performance / Next.js:**
- [Next.js 16 release notes](https://nextjs.org/blog/next-16) | [Next.js 16.2](https://nextjs.org/blog/next-16-2)
- [DebugBear: next/image guide](https://www.debugbear.com/blog/nextjs-image-optimization)
- [Next.js Production Checklist](https://nextjs.org/docs/pages/guides/production-checklist)
- [Next.js View Transitions](https://nextjs.org/docs/app/guides/view-transitions)
- [PPR Production Patterns 2026](https://samcheek.com/blog/nextjs-partial-prerendering-production-2026)

**Restaurant / Conversion:**
- [DoorDash: Restaurant Website Guide 2026](https://merchants.doordash.com/en-us/blog/building-restaurant-website)
- [Homebase: 11 Restaurant Website Features 2026](https://www.joinhomebase.com/blog/restaurant-website)
- [Chowly: Restaurant SEO 2026](https://chowly.com/resources/blogs/how-to-tackle-restaurant-seo-a-guide-to-top-google-rankings-in-2026/)
- [SevenRooms: Design that converts](https://sevenrooms.com/blog/restaurant-website-design-tips-that-convert/)

**SEO / Schema:**
- [Google: LocalBusiness Structured Data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Restaurant Schema 2026 Guide](https://richmenu.io/restaurant-schema-markup/)
- [Restaurant SEO Checklist 2026](https://thedigitalrestaurant.com/restaurant-seo-checklist/)

**Security:**
- [Next.js CSP Guide](https://nextjs.org/docs/pages/guides/content-security-policy)
- [Sudolabs: Dynamic CSP](https://sudolabs.com/insights/dynamic-csp-in-next-js-applications)
