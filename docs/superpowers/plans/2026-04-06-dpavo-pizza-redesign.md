# D'Pavo Pizza Website — Full Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the D'Pavo Urban Pizzeria website as a real restaurant site — 5 pages, ES/EN language toggle, shared component library, WhatsApp-driven conversions, and Crafto-inspired scroll animations — with zero new dependencies.

**Architecture:** React context provides the language toggle; all strings live in typed `content/en.ts` and `content/es.ts` files. A `useInView` hook wraps `IntersectionObserver` to trigger CSS-class-based entrance animations. All 5 pages share reusable UI primitives (`Button`, `SectionHeader`, `Badge`, `Card`, `PageHero`, `Marquee`).

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · CSS Modules · lucide-react · native IntersectionObserver

**Working directory:** `/Users/mrperex/Projects/DPAVO PIZZA WEBSITE`

---

## File Map

```
src/
  context/
    LanguageContext.tsx          — Lang type, createContext, Provider, useLanguage hook
  hooks/
    useInView.ts                 — IntersectionObserver → ref + inView boolean
    useScrolled.ts               — window scroll → boolean (for navbar)
  content/
    config.ts                    — WHATSAPP_NUMBER constant + wa() helper
    en.ts                        — all English UI strings, keyed by section
    es.ts                        — all Spanish UI strings, same key structure
    menu.ts                      — MenuItem type + MENU_ITEMS array
    events.ts                    — Event type + EVENTS array
    reviews.ts                   — Review type + REVIEWS array
    gallery.ts                   — GalleryItem type + GALLERY_ITEMS array
    about.ts                     — AboutContent type + ABOUT content object
  components/
    ui/
      Button/
        Button.tsx               — variant prop: 'primary' | 'secondary' | 'ghost'
        Button.module.css
      SectionHeader/
        SectionHeader.tsx        — label + h2 + optional subtitle
        SectionHeader.module.css
      Badge/
        Badge.tsx                — pill tag with optional color
        Badge.module.css
    layout/
      Navbar/
        Navbar.tsx               — sticky, glassmorphism, ES/EN toggle, hamburger
        Navbar.module.css
      Footer/
        Footer.tsx               — full links, hours, socials
        Footer.module.css
      PageHero/
        PageHero.tsx             — reusable inner-page hero
        PageHero.module.css
    sections/
      Marquee/
        Marquee.tsx              — animated ticker
        Marquee.module.css
  app/
    providers.tsx                — 'use client' wrapper holding LanguageContext.Provider
    layout.tsx                   — wraps body in <Providers>
    globals.css                  — design tokens + animation utilities (.animate-in, .stagger)
    page.tsx                     — Home (rebuilt)
    page.module.css
    menu/
      page.tsx                   — Menu (rebuilt)
      menu.module.css
    events/
      page.tsx                   — Events (rebuilt)
      events.module.css
    about/
      page.tsx                   — About/Story (new)
      about.module.css
    gallery/
      page.tsx                   — Gallery (new)
      gallery.module.css
```

---

## Phase 1 — Foundation

### Task 1: globals.css — design tokens + animation utilities

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Replace the full contents of `globals.css`** with the cleaned-up version below. This adds the `.animate-in` entrance animation utility and `--index` stagger support while preserving all existing tokens.

```css
/* src/app/globals.css */
:root {
  --primary: #E30613;
  --primary-rgb: 227, 6, 19;
  --secondary: #00B9AE;
  --secondary-rgb: 0, 185, 174;
  --tertiary: #FFCC00;
  --tertiary-rgb: 255, 204, 0;

  --background: #131313;
  --foreground: #e5e2e1;
  --surface: #131313;
  --surface-low: #1C1B1B;
  --surface-high: #2A2A2A;
  --surface-highest: #353534;
  --on-surface: #e5e2e1;
  --on-surface-variant: #e9bcb6;

  --font-headlines: var(--font-epilogue);
  --font-body: var(--font-manrope);
  --font-labels: var(--font-space-grotesk);

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-xl: 32px;
  --radius-full: 999px;

  --glass-blur: 24px;
}

*, *::before, *::after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html, body {
  max-width: 100vw;
  overflow-x: hidden;
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-body), sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-headlines), sans-serif;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.05;
}

p { line-height: 1.65; font-weight: 400; }
a { text-decoration: none; color: inherit; }

.label {
  font-family: var(--font-labels), monospace;
  text-transform: uppercase;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--secondary);
  display: block;
  margin-bottom: 8px;
}

section { padding: 100px 0; }

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Buttons ─────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: var(--primary);
  color: #fff;
  padding: 13px 26px;
  border-radius: var(--radius-sm);
  font-family: var(--font-headlines);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 28px rgba(var(--primary-rgb), 0.45);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  color: var(--secondary);
  padding: 13px 26px;
  border-radius: var(--radius-sm);
  font-family: var(--font-headlines);
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border: 1px solid rgba(var(--secondary-rgb), 0.35);
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}
.btn-secondary:hover {
  background: rgba(var(--secondary-rgb), 0.12);
  border-color: var(--secondary);
  box-shadow: 0 0 18px rgba(var(--secondary-rgb), 0.22);
  transform: translateY(-2px);
}

/* ── Surfaces & Glass ─────────────────────────── */
.surface-low  { background-color: var(--surface-low); }
.surface-high { background-color: var(--surface-high); }
.glass {
  background: rgba(42, 42, 42, 0.55);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
}

/* ── Animation utilities ──────────────────────── */
/* Elements start hidden; JS adds .visible when IntersectionObserver fires */
.animate-in {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.55s cubic-bezier(0.37, 0, 0.63, 1),
              transform 0.55s cubic-bezier(0.37, 0, 0.63, 1);
  transition-delay: calc(var(--index, 0) * 80ms);
}
.animate-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.animate-scale {
  opacity: 0;
  transform: scale(0.88);
  transition: opacity 0.45s cubic-bezier(0.37, 0, 0.63, 1),
              transform 0.45s cubic-bezier(0.61, 1, 0.88, 1);
  transition-delay: calc(var(--index, 0) * 80ms);
}
.animate-scale.visible {
  opacity: 1;
  transform: scale(1);
}

/* ── Neon utilities ───────────────────────────── */
.neon-border {
  border: 1px solid rgba(var(--secondary-rgb), 0.45);
  box-shadow: inset 0 0 6px rgba(var(--secondary-rgb), 0.18),
              0 0 6px rgba(var(--secondary-rgb), 0.18);
}

@media (max-width: 768px) {
  section { padding: 70px 0; }
  .container { padding: 0 16px; }
}
```

- [ ] **Verify** — run `npm run build` in the project root, confirm no CSS errors.

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/app/globals.css
git commit -m "refactor: clean up globals.css, add animation utilities"
```

---

### Task 2: Content files

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/en.ts`
- Create: `src/content/es.ts`
- Create: `src/content/menu.ts`
- Create: `src/content/events.ts`
- Create: `src/content/reviews.ts`
- Create: `src/content/gallery.ts`
- Create: `src/content/about.ts`

- [ ] **Create `src/content/config.ts`**

```ts
// src/content/config.ts
export const WHATSAPP_NUMBER = '18095550000'; // ← replace with real number

export function wa(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_ORDER = (item: string) => wa(`Quisiera ordenar: ${item}`);
export const WA_RESERVE = (event: string) => wa(`Quisiera reservar una mesa para: ${event}`);
export const WA_GENERAL = wa('Hola, me gustaría obtener más información.');
export const WA_EVENTS = wa('Quisiera recibir notificaciones de eventos.');
```

- [ ] **Create `src/content/en.ts`**

```ts
// src/content/en.ts
export const en = {
  nav: {
    home: 'Home',
    menu: 'Menu',
    events: 'Nightlife',
    about: 'Our Story',
    gallery: 'Gallery',
    order: 'Order on WhatsApp',
    lang: 'ES',
  },
  hero: {
    kicker: 'Live from Verón, Punta Cana',
    title1: 'Eat.',
    title2: 'Drink.',
    title3: 'Party.',
    subtitle: 'Urban tropical flavors by day. Full nightlife energy after dark. One address in Verón.',
    cta1: 'View Menu',
    cta2: 'Tonight',
    hours: '11:00 AM – Late Night',
    location: 'Plaza Verón Center',
  },
  marquee: [
    'Eat · Drink · Party',
    'Urban Tropical Energy',
    'Verón, Punta Cana',
    'Pizza · Mariscos · Drinks',
  ],
  signature: {
    label: 'Signature Selection',
    title: 'Built to sell the craving.',
    subtitle: 'Our most-ordered items — premium ingredients, bold flavors.',
    order: 'Order on WhatsApp',
    trending: 'Trending',
  },
  howItWorks: {
    label: 'How It Works',
    title: 'Order in 3 steps.',
    steps: [
      { title: 'Choose Your Order', copy: 'Browse the menu and pick your items.' },
      { title: 'Message Us on WhatsApp', copy: 'Tap the button and send your order directly.' },
      { title: 'Sit Back & Enjoy', copy: 'We prepare it fresh. Pick up or enjoy at the venue.' },
    ],
  },
  dayNight: {
    day: {
      label: 'The Day',
      title: 'Family. Flavors. Sunshine.',
      copy: 'Vibrant lunch energy, warm food-driven atmosphere and the best pizza in Verón.',
    },
    night: {
      label: 'The Night',
      title: 'Beats. Bottles. Bass.',
      copy: 'DJ sets, karaoke nights and immersive atmosphere — D\'Pavo is more than a restaurant.',
    },
  },
  reviews: {
    label: 'What People Say',
    title: 'Real love from real guests.',
  },
  hours: {
    label: 'Visit Us',
    title: 'Opening Hours.',
    address: 'Plaza Verón Center, Verón, Punta Cana',
    schedule: [
      { day: 'Monday – Thursday', hours: '11:00 AM – 11:00 PM' },
      { day: 'Friday', hours: '11:00 AM – 2:00 AM' },
      { day: 'Saturday', hours: '11:00 AM – 3:00 AM' },
      { day: 'Sunday', hours: '12:00 PM – 10:00 PM' },
    ],
    cta: 'Get Directions on WhatsApp',
  },
  eventsCta: {
    label: 'Nightlife Calendar',
    title: 'Programming that feels alive.',
    link: 'Open Events Page',
  },
  cta: {
    label: 'Don\'t Miss Out',
    title: 'The party never stops.',
    subtitle: 'Order now, reserve a table or just come through — we\'re always on.',
    cta1: 'View Menu',
    cta2: 'Reserve on WhatsApp',
  },
  footer: {
    tagline: 'Pizza, drinks and nightlife in Verón. Built louder, sharper and more memorable.',
    explore: 'Explore',
    visit: 'Visit',
    address: 'Plaza Verón Center, Punta Cana',
    hoursShort: '11:00 AM — Late Night',
    whatsapp: 'WhatsApp Reservations',
    rights: 'D\'Pavo Urban Pizzeria.',
  },
  // Inner pages
  menuPage: {
    label: 'High-Octane Flavors',
    title: 'The Menu.',
    subtitle: 'Pizzas, mariscos, picaderas and drinks — all available on WhatsApp.',
    categories: ['All', 'Pizza', 'Mariscos', 'Picaderas', 'Drinks'],
    featured: 'Featured',
    trending: 'Trending',
    order: 'Order on WhatsApp',
    ask: 'Ask on WhatsApp',
  },
  eventsPage: {
    label: '¿Qué pasa esta noche?',
    title: 'Events & Nightlife.',
    subtitle: 'DJ sets, karaoke and full-venue madness every week in Verón.',
    featuredLabel: 'Main Event',
    reserve: 'Reserve Table',
    vibeLabel: 'The Vibe',
    vibeTitle: 'More than a restaurant.',
    vibes: [
      { title: 'DJ Sets', copy: 'House, reggaeton and urban mixes every Friday and Saturday.' },
      { title: 'Live Music', copy: 'Local artists and surprise acts throughout the month.' },
      { title: 'Karaoke Nights', copy: 'Every Thursday — the crowd takes the mic.' },
    ],
    notifyLabel: 'Stay in the Loop',
    notifyTitle: 'Get notified about upcoming events.',
    notifyCta: 'Join on WhatsApp',
    weeklyLabel: 'Weekly Programming',
    weeklyTitle: 'Urban Calendar.',
    reserveNow: 'Reserve Now',
  },
  aboutPage: {
    label: 'Our Story',
    title: 'Nuestra Historia.',
    subtitle: 'A place born in Verón with ambition, flavor and rhythm.',
    storyTitle: 'How D\'Pavo Started.',
    storyBody: [
      'D\'Pavo was born from a simple idea: bring premium, bold-flavored pizza to the heart of Verón, Punta Cana — a neighborhood full of energy, culture and hungry people.',
      'What started as a small kitchen operation quickly grew into a full urban destination. The food got sharper, the nights got louder, and the brand took on a life of its own.',
      'Today D\'Pavo is where locals eat, tourists discover, and nightlife begins. We\'re proud to be part of Verón\'s story.',
    ],
    valuesLabel: 'What We Stand For',
    valuesTitle: 'Built on Three Pillars.',
    values: [
      { title: 'Local Roots', copy: 'Born and bred in Verón. We source local, think local and give back locally.' },
      { title: 'Urban Energy', copy: 'Day or night, D\'Pavo brings the energy — food, music and atmosphere.' },
      { title: 'Premium Ingredients', copy: 'Every pizza, every drink, every dish is made with quality you can taste.' },
    ],
    visitLabel: 'Come See Us',
    visitTitle: 'We\'re Always Open.',
    visitCta: 'Get Directions',
  },
  galleryPage: {
    label: 'Gallery',
    title: 'The Vibe.',
    subtitle: 'Food, nights and the energy of D\'Pavo — captured.',
    categories: ['All', 'Food', 'Venue', 'Events'],
  },
};

export type Content = typeof en;
```

- [ ] **Create `src/content/es.ts`** (same structure, Spanish strings)

```ts
// src/content/es.ts
import type { Content } from './en';

export const es: Content = {
  nav: {
    home: 'Inicio',
    menu: 'Menú',
    events: 'Noche',
    about: 'Nuestra Historia',
    gallery: 'Galería',
    order: 'Pedir por WhatsApp',
    lang: 'EN',
  },
  hero: {
    kicker: 'En vivo desde Verón, Punta Cana',
    title1: 'Come.',
    title2: 'Bebe.',
    title3: 'Fiesta.',
    subtitle: 'Sabores tropicales urbanos de día. Energía nocturna de noche. Una sola dirección en Verón.',
    cta1: 'Ver Menú',
    cta2: 'Esta Noche',
    hours: '11:00 AM – Madrugada',
    location: 'Plaza Verón Center',
  },
  marquee: [
    'Come · Bebe · Fiesta',
    'Energía Tropical Urbana',
    'Verón, Punta Cana',
    'Pizza · Mariscos · Drinks',
  ],
  signature: {
    label: 'Selección Especial',
    title: 'Creado para despertar el antojo.',
    subtitle: 'Nuestros platos más pedidos — ingredientes premium, sabores intensos.',
    order: 'Pedir por WhatsApp',
    trending: 'Tendencia',
  },
  howItWorks: {
    label: 'Cómo Funciona',
    title: 'Ordena en 3 pasos.',
    steps: [
      { title: 'Elige tu Pedido', copy: 'Explora el menú y selecciona lo que quieres.' },
      { title: 'Escríbenos por WhatsApp', copy: 'Toca el botón y envía tu pedido directamente.' },
      { title: 'Relájate y Disfruta', copy: 'Lo preparamos fresco. Recoge o disfruta en el local.' },
    ],
  },
  dayNight: {
    day: {
      label: 'El Día',
      title: 'Familia. Sabores. Sol.',
      copy: 'Energía vibrante al mediodía, ambiente cálido y la mejor pizza de Verón.',
    },
    night: {
      label: 'La Noche',
      title: 'Beats. Botellas. Bajo.',
      copy: 'DJs, noches de karaoke y ambiente inmersivo — D\'Pavo es más que un restaurante.',
    },
  },
  reviews: {
    label: 'Lo Que Dicen',
    title: 'Amor real de clientes reales.',
  },
  hours: {
    label: 'Visítanos',
    title: 'Horario de Apertura.',
    address: 'Plaza Verón Center, Verón, Punta Cana',
    schedule: [
      { day: 'Lunes – Jueves', hours: '11:00 AM – 11:00 PM' },
      { day: 'Viernes', hours: '11:00 AM – 2:00 AM' },
      { day: 'Sábado', hours: '11:00 AM – 3:00 AM' },
      { day: 'Domingo', hours: '12:00 PM – 10:00 PM' },
    ],
    cta: 'Cómo Llegar por WhatsApp',
  },
  eventsCta: {
    label: 'Calendario Nocturno',
    title: 'Programación que se siente viva.',
    link: 'Ver Eventos',
  },
  cta: {
    label: 'No te Pierdas Nada',
    title: 'La fiesta nunca para.',
    subtitle: 'Ordena ahora, reserva una mesa o simplemente ven — siempre estamos encendidos.',
    cta1: 'Ver Menú',
    cta2: 'Reservar por WhatsApp',
  },
  footer: {
    tagline: 'Pizza, tragos y vida nocturna en Verón. Más fuerte, más intenso, más memorable.',
    explore: 'Explorar',
    visit: 'Visítanos',
    address: 'Plaza Verón Center, Punta Cana',
    hoursShort: '11:00 AM — Madrugada',
    whatsapp: 'Reservas por WhatsApp',
    rights: 'D\'Pavo Urban Pizzeria.',
  },
  menuPage: {
    label: 'Sabores de Alto Octanaje',
    title: 'El Menú.',
    subtitle: 'Pizzas, mariscos, picaderas y bebidas — todo disponible por WhatsApp.',
    categories: ['Todo', 'Pizza', 'Mariscos', 'Picaderas', 'Bebidas'],
    featured: 'Destacado',
    trending: 'Tendencia',
    order: 'Pedir por WhatsApp',
    ask: 'Consultar por WhatsApp',
  },
  eventsPage: {
    label: '¿Qué pasa esta noche?',
    title: 'Eventos y Vida Nocturna.',
    subtitle: 'DJs, karaoke y locura total cada semana en Verón.',
    featuredLabel: 'Evento Principal',
    reserve: 'Reservar Mesa',
    vibeLabel: 'El Ambiente',
    vibeTitle: 'Más que un restaurante.',
    vibes: [
      { title: 'Sets de DJ', copy: 'House, reggaetón y mezclas urbanas todos los viernes y sábados.' },
      { title: 'Música en Vivo', copy: 'Artistas locales y sorpresas a lo largo del mes.' },
      { title: 'Noches de Karaoke', copy: 'Todos los jueves — el público toma el micrófono.' },
    ],
    notifyLabel: 'Mantente Informado',
    notifyTitle: 'Recibe notificaciones de próximos eventos.',
    notifyCta: 'Únete por WhatsApp',
    weeklyLabel: 'Programación Semanal',
    weeklyTitle: 'Calendario Urbano.',
    reserveNow: 'Reservar Ahora',
  },
  aboutPage: {
    label: 'Nuestra Historia',
    title: 'Our Story.',
    subtitle: 'Un lugar nacido en Verón con ambición, sabor y ritmo.',
    storyTitle: 'Cómo Empezó D\'Pavo.',
    storyBody: [
      'D\'Pavo nació de una idea simple: llevar pizza premium y de sabores intensos al corazón de Verón, Punta Cana — un barrio lleno de energía, cultura y gente hambrienta.',
      'Lo que comenzó como una pequeña operación de cocina rápidamente se convirtió en un destino urbano completo. La comida mejoró, las noches se pusieron más intensas y la marca tomó vida propia.',
      'Hoy D\'Pavo es donde los locales comen, los turistas descubren y la vida nocturna comienza.',
    ],
    valuesLabel: 'En Qué Creemos',
    valuesTitle: 'Construido Sobre Tres Pilares.',
    values: [
      { title: 'Raíces Locales', copy: 'Nacidos y criados en Verón. Compramos local, pensamos local y devolvemos localmente.' },
      { title: 'Energía Urbana', copy: 'De día o de noche, D\'Pavo trae la energía — comida, música y ambiente.' },
      { title: 'Ingredientes Premium', copy: 'Cada pizza, cada trago, cada plato está hecho con calidad que se nota.' },
    ],
    visitLabel: 'Ven a Vernos',
    visitTitle: 'Siempre Abiertos.',
    visitCta: 'Cómo Llegar',
  },
  galleryPage: {
    label: 'Galería',
    title: 'El Ambiente.',
    subtitle: 'Comida, noches y la energía de D\'Pavo — capturada.',
    categories: ['Todo', 'Comida', 'Local', 'Eventos'],
  },
};
```

- [ ] **Create `src/content/menu.ts`**

```ts
// src/content/menu.ts
export type MenuCategory = 'Pizza' | 'Mariscos' | 'Picaderas' | 'Drinks';

export interface MenuItem {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  descriptionEs: string;
  price: string;
  category: MenuCategory;
  featured: boolean;
  image?: string; // path in /public — omit to show gradient placeholder
  tone: 'red' | 'yellow' | 'cyan' | 'white';
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'La Pavorosa',
    subtitle: 'Ultimate Mix',
    description: 'Angus beef, artisan pepperoni, caramelized onion and truffle oil.',
    descriptionEs: 'Carne de res angus, pepperoni artesanal, cebolla caramelizada y aceite de trufa.',
    price: '$22.00',
    category: 'Pizza',
    featured: true,
    image: '/d_pavo_visual_menu/code-la-pavorosa.png',
    tone: 'red',
  },
  {
    id: 2,
    name: 'Triple Queso',
    subtitle: 'Triple Cheese',
    description: 'Premium mozzarella, artisanal cheddar and melted gouda with urban herbs.',
    descriptionEs: 'Mozzarella premium, cheddar artesanal y gouda fundido con hierbas urbanas.',
    price: '$18.00',
    category: 'Pizza',
    featured: true,
    image: '/d_pavo_visual_menu/code-triple-queso.png',
    tone: 'yellow',
  },
  {
    id: 3,
    name: 'Maresía Tropical',
    subtitle: 'Seafood Mix',
    description: 'Jumbo shrimp and calamari sautéed with coconut butter and cilantro.',
    descriptionEs: 'Camarones jumbo y calamares salteados con mantequilla de coco y cilantro.',
    price: '$24.50',
    category: 'Mariscos',
    featured: true,
    image: '/d_pavo_visual_menu/code-maresia-tropical.png',
    tone: 'cyan',
  },
  {
    id: 4,
    name: 'Pepperoni Hot Honey',
    subtitle: 'Classic Heat',
    description: 'Pepperoni, mozzarella and a sweet-hot glaze to finish strong.',
    descriptionEs: 'Pepperoni, mozzarella y un glaze picante-dulce para cerrar con fuerza.',
    price: '$20.00',
    category: 'Pizza',
    featured: false,
    tone: 'red',
  },
  {
    id: 5,
    name: 'Alitas Infierno',
    subtitle: 'Hell Wings',
    description: 'Crispy wings with secret ají caballero sauce and Dominican honey.',
    descriptionEs: 'Alitas crujientes con salsa secreta de ají caballero y miel dominicana.',
    price: '$12.00',
    category: 'Picaderas',
    featured: false,
    tone: 'red',
  },
  {
    id: 6,
    name: 'Chinola Sour',
    subtitle: 'Passion Mix',
    description: 'Fresh passionfruit, premium rum and a citrus blend that tastes like Punta Cana.',
    descriptionEs: 'Maracuyá fresco, ron premium y mezcla cítrica que sabe a Punta Cana.',
    price: '$9.50',
    category: 'Drinks',
    featured: false,
    tone: 'yellow',
  },
  {
    id: 7,
    name: 'Tostones Especiales',
    subtitle: 'Dominican Classic',
    description: 'Twice-fried plantain, topped with shrimp and garlic sauce.',
    descriptionEs: 'Tostones dobles fritos, coronados con camarones y salsa de ajo.',
    price: '$11.00',
    category: 'Picaderas',
    featured: false,
    tone: 'yellow',
  },
  {
    id: 8,
    name: 'Pavo Blanco',
    subtitle: 'White Sauce',
    description: 'Ricotta base, roasted garlic, mushrooms and fresh basil.',
    descriptionEs: 'Base de ricotta, ajo asado, champiñones y albahaca fresca.',
    price: '$19.00',
    category: 'Pizza',
    featured: false,
    tone: 'white',
  },
];
```

- [ ] **Create `src/content/events.ts`**

```ts
// src/content/events.ts
export interface DPavoEvent {
  id: number;
  titleEn: string;
  titleEs: string;
  dayEn: string;
  dayEs: string;
  date: string;
  time: string;
  location: string;
  descriptionEn: string;
  descriptionEs: string;
  tag: string;
  featured?: boolean;
}

export const EVENTS: DPavoEvent[] = [
  {
    id: 1,
    titleEn: 'Karaoke Night Out',
    titleEs: 'Noche de Karaoke',
    dayEn: 'Thursday',
    dayEs: 'Jueves',
    date: 'Every Thursday',
    time: '9:00 PM',
    location: 'Main Lounge',
    descriptionEn: 'Crowd energy, singalong moments and the best weekly lower-stakes event that keeps D\'Pavo socially alive.',
    descriptionEs: 'Energía en masa, momentos de karaoke y el mejor evento semanal que mantiene vivo el ambiente de D\'Pavo.',
    tag: 'Karaoke',
  },
  {
    id: 2,
    titleEn: 'Urban Beats Live',
    titleEs: 'Urban Beats en Vivo',
    dayEn: 'Friday',
    dayEs: 'Viernes',
    date: 'Every Friday',
    time: '11:00 PM',
    location: 'DJ Floor',
    descriptionEn: 'The high-impact night concept. DJ sets, lights, premium drinks and Verón\'s best crowd.',
    descriptionEs: 'El concepto de noche de alto impacto. DJs, luces, tragos premium y el mejor ambiente de Verón.',
    tag: 'DJ Set',
    featured: true,
  },
  {
    id: 3,
    titleEn: 'D\'Pavo Madness',
    titleEs: 'D\'Pavo Madness',
    dayEn: 'Saturday',
    dayEs: 'Sábado',
    date: 'Every Saturday',
    time: 'All Night',
    location: 'Full Venue',
    descriptionEn: 'Peak nightlife identity. VIP energy, full venue experience and the biggest night of the week.',
    descriptionEs: 'La identidad nocturna al máximo. Energía VIP, experiencia de local completo y la noche más grande de la semana.',
    tag: 'Main Event',
  },
];
```

- [ ] **Create `src/content/reviews.ts`**

```ts
// src/content/reviews.ts
export interface Review {
  id: number;
  nameEn: string;
  nameEs: string;
  stars: 1 | 2 | 3 | 4 | 5;
  quoteEn: string;
  quoteEs: string;
  location: string;
}

export const REVIEWS: Review[] = [
  {
    id: 1,
    nameEn: 'Carlos M.',
    nameEs: 'Carlos M.',
    stars: 5,
    quoteEn: 'Best pizza I\'ve had in Punta Cana. La Pavorosa is insane. Came back three times in one week.',
    quoteEs: 'La mejor pizza que he comido en Punta Cana. La Pavorosa está brutal. Volví tres veces en una semana.',
    location: 'Verón, Punta Cana',
  },
  {
    id: 2,
    nameEn: 'Melissa R.',
    nameEs: 'Melissa R.',
    stars: 5,
    quoteEn: 'The vibe at night is unreal. Amazing food, great music, and the energy is just different.',
    quoteEs: 'El ambiente de noche es increíble. Excelente comida, buena música y la energía es otra cosa.',
    location: 'Santo Domingo',
  },
  {
    id: 3,
    nameEn: 'Josh T.',
    nameEs: 'Josh T.',
    stars: 5,
    quoteEn: 'Stumbled in on a Friday night. Left two hours later with new friends and a full stomach. Will be back.',
    quoteEs: 'Entré un viernes por la noche. Salí dos horas después con amigos nuevos y la panza llena. Vuelvo seguro.',
    location: 'Tourist, USA',
  },
];
```

- [ ] **Create `src/content/gallery.ts`**

```ts
// src/content/gallery.ts
export type GalleryCategory = 'Food' | 'Venue' | 'Events';

export interface GalleryItem {
  id: number;
  src?: string;       // path in /public — omit to use gradient placeholder
  alt: string;
  altEs: string;
  category: GalleryCategory;
  tone: 'red' | 'yellow' | 'cyan';
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, alt: 'La Pavorosa pizza', altEs: 'Pizza La Pavorosa', category: 'Food', tone: 'red', src: '/d_pavo_visual_menu/code-la-pavorosa.png' },
  { id: 2, alt: 'Triple Queso pizza', altEs: 'Pizza Triple Queso', category: 'Food', tone: 'yellow', src: '/d_pavo_visual_menu/code-triple-queso.png' },
  { id: 3, alt: 'Maresía Tropical', altEs: 'Maresía Tropical', category: 'Food', tone: 'cyan', src: '/d_pavo_visual_menu/code-maresia-tropical.png' },
  { id: 4, alt: 'D\'Pavo venue at night', altEs: 'D\'Pavo de noche', category: 'Venue', tone: 'red' },
  { id: 5, alt: 'DJ set at D\'Pavo', altEs: 'Set de DJ en D\'Pavo', category: 'Events', tone: 'cyan' },
  { id: 6, alt: 'Karaoke night crowd', altEs: 'Multitud en noche de karaoke', category: 'Events', tone: 'yellow' },
  { id: 7, alt: 'D\'Pavo bar area', altEs: 'Área de barra de D\'Pavo', category: 'Venue', tone: 'yellow' },
  { id: 8, alt: 'Urban Beats Live event', altEs: 'Evento Urban Beats Live', category: 'Events', tone: 'red' },
  { id: 9, alt: 'Alitas Infierno', altEs: 'Alitas Infierno', category: 'Food', tone: 'red' },
];
```

- [ ] **Create `src/content/about.ts`**

```ts
// src/content/about.ts
// Static flags to toggle optional sections
export const SHOW_TEAM_SECTION = false; // set to true when real team photos are available

export interface TeamMember {
  name: string;
  role: string;
  roleEs: string;
  image?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Placeholder', role: 'Founder', roleEs: 'Fundador' },
  { name: 'Placeholder', role: 'Head Chef', roleEs: 'Chef Principal' },
  { name: 'Placeholder', role: 'Events Director', roleEs: 'Director de Eventos' },
];
```

- [ ] **Verify TypeScript compiles** — run `npm run build`

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/content/
git commit -m "feat: add typed content files (config, en, es, menu, events, reviews, gallery, about)"
```

---

### Task 3: Custom hooks

**Files:**
- Create: `src/hooks/useInView.ts`
- Create: `src/hooks/useScrolled.ts`

- [ ] **Create `src/hooks/useInView.ts`**

```ts
// src/hooks/useInView.ts
'use client';

import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {}
): [React.RefObject<T | null>, boolean] {
  const { threshold = 0.12, rootMargin = '0px', once = true } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
```

- [ ] **Create `src/hooks/useScrolled.ts`**

```ts
// src/hooks/useScrolled.ts
'use client';

import { useEffect, useState } from 'react';

export function useScrolled(threshold = 40): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
```

- [ ] **Verify TypeScript compiles**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/hooks/
git commit -m "feat: add useInView and useScrolled hooks"
```

---

### Task 4: LanguageContext + Providers

**Files:**
- Create: `src/context/LanguageContext.tsx`
- Create: `src/app/providers.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Create `src/context/LanguageContext.tsx`**

```tsx
// src/context/LanguageContext.tsx
'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { en } from '@/content/en';
import { es } from '@/content/es';
import type { Content } from '@/content/en';

export type Lang = 'en' | 'es';

interface LanguageContextValue {
  lang: Lang;
  t: Content;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  t: es,
  toggle: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');
  const t = lang === 'en' ? en : es;
  const toggle = () => setLang((l) => (l === 'en' ? 'es' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
```

- [ ] **Create `src/app/providers.tsx`**

```tsx
// src/app/providers.tsx
'use client';

import { LanguageProvider } from '@/context/LanguageContext';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
```

- [ ] **Modify `src/app/layout.tsx`** — wrap `{children}` with `<Providers>`

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Epilogue, Manrope, Space_Grotesk } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const epilogue = Epilogue({
  variable: '--font-epilogue',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "D'Pavo Pizza | Urban Tropical Pizzeria — Verón, Punta Cana",
  description: "Pizza, mariscos and nightlife in Verón, Punta Cana. Order on WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${epilogue.variable} ${manrope.variable} ${spaceGrotesk.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/context/ src/app/providers.tsx src/app/layout.tsx
git commit -m "feat: add LanguageContext, Providers wrapper, update layout"
```

---

### Task 5: UI components — Button, SectionHeader, Badge

**Files:**
- Create: `src/components/ui/Button/Button.tsx`
- Create: `src/components/ui/Button/Button.module.css`
- Create: `src/components/ui/SectionHeader/SectionHeader.tsx`
- Create: `src/components/ui/SectionHeader/SectionHeader.module.css`
- Create: `src/components/ui/Badge/Badge.tsx`
- Create: `src/components/ui/Badge/Badge.module.css`

- [ ] **Create `src/components/ui/Button/Button.tsx`**

```tsx
// src/components/ui/Button/Button.tsx
import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  variant?: Variant;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function Button({ variant = 'primary', href, external, children, className = '', ...props }: ButtonProps) {
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();

  if (href) {
    if (external) {
      return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
    }
    return <Link href={href} className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</Link>;
  }

  return <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
```

- [ ] **Create `src/components/ui/Button/Button.module.css`**

```css
/* src/components/ui/Button/Button.module.css */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-headlines), sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 13px 26px;
  border-radius: var(--radius-sm);
  border: none;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
  text-decoration: none;
}

.primary {
  background: var(--primary);
  color: #fff;
}
.primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 28px rgba(var(--primary-rgb), 0.45);
}

.secondary {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  color: var(--secondary);
  border: 1px solid rgba(var(--secondary-rgb), 0.35);
}
.secondary:hover {
  background: rgba(var(--secondary-rgb), 0.12);
  border-color: var(--secondary);
  box-shadow: 0 0 18px rgba(var(--secondary-rgb), 0.22);
  transform: translateY(-2px);
}

.ghost {
  background: transparent;
  color: var(--foreground);
  border: 1px solid rgba(255,255,255,0.15);
}
.ghost:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.3);
}
```

- [ ] **Create `src/components/ui/SectionHeader/SectionHeader.tsx`**

```tsx
// src/components/ui/SectionHeader/SectionHeader.tsx
import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  label?: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}

export function SectionHeader({ label, title, subtitle, align = 'left', action }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${styles[align]}`}>
      <div className={styles.text}>
        {label && <span className="label">{label}</span>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
```

- [ ] **Create `src/components/ui/SectionHeader/SectionHeader.module.css`**

```css
/* src/components/ui/SectionHeader/SectionHeader.module.css */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
  margin-bottom: 48px;
}

.center {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.center .action {
  margin-top: 8px;
}

.title {
  font-size: clamp(2rem, 5vw, 3.2rem);
  margin-top: 4px;
}

.subtitle {
  max-width: 540px;
  color: rgba(255,255,255,0.58);
  margin-top: 12px;
}

.center .subtitle {
  margin: 12px auto 0;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
```

- [ ] **Create `src/components/ui/Badge/Badge.tsx`**

```tsx
// src/components/ui/Badge/Badge.tsx
import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeColor = 'default' | 'red' | 'teal' | 'yellow';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
}

export function Badge({ children, color = 'default' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[color]}`}>{children}</span>;
}
```

- [ ] **Create `src/components/ui/Badge/Badge.module.css`**

```css
/* src/components/ui/Badge/Badge.module.css */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.default {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.72);
}

.red {
  background: rgba(var(--primary-rgb), 0.15);
  color: var(--primary);
}

.teal {
  background: rgba(var(--secondary-rgb), 0.15);
  color: var(--secondary);
}

.yellow {
  background: rgba(var(--tertiary-rgb), 0.15);
  color: var(--tertiary);
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/components/ui/
git commit -m "feat: add Button, SectionHeader, Badge UI components"
```

---

### Task 6: Layout components — PageHero, Marquee

**Files:**
- Create: `src/components/layout/PageHero/PageHero.tsx`
- Create: `src/components/layout/PageHero/PageHero.module.css`
- Create: `src/components/sections/Marquee/Marquee.tsx`
- Create: `src/components/sections/Marquee/Marquee.module.css`

- [ ] **Create `src/components/layout/PageHero/PageHero.tsx`**

```tsx
// src/components/layout/PageHero/PageHero.tsx
import type { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
  label?: string;
  title: ReactNode;
  subtitle?: string;
  tone?: 'default' | 'warm' | 'dark';
  children?: ReactNode;
}

export function PageHero({ label, title, subtitle, tone = 'default', children }: PageHeroProps) {
  return (
    <header className={`${styles.hero} ${styles[tone]}`}>
      <div className={styles.backdrop} />
      <div className="container">
        <div className={styles.content}>
          {label && <span className="label">{label}</span>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Create `src/components/layout/PageHero/PageHero.module.css`**

```css
/* src/components/layout/PageHero/PageHero.module.css */
.hero {
  position: relative;
  padding: 160px 0 90px;
  overflow: hidden;
}

.backdrop {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.default .backdrop {
  background:
    radial-gradient(circle at 20% 30%, rgba(var(--primary-rgb), 0.22), transparent 32%),
    radial-gradient(circle at 80% 20%, rgba(var(--secondary-rgb), 0.16), transparent 28%),
    linear-gradient(135deg, #181818 0%, #101010 100%);
}

.warm .backdrop {
  background:
    radial-gradient(circle at 30% 40%, rgba(var(--tertiary-rgb), 0.18), transparent 35%),
    radial-gradient(circle at 70% 20%, rgba(var(--primary-rgb), 0.12), transparent 30%),
    linear-gradient(135deg, #1a1710 0%, #111111 100%);
}

.dark .backdrop {
  background:
    radial-gradient(circle at 50% 30%, rgba(var(--primary-rgb), 0.15), transparent 40%),
    linear-gradient(180deg, #0e0e0e 0%, #131313 100%);
}

.content {
  position: relative;
  z-index: 1;
  max-width: 760px;
}

.title {
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 0.92;
  letter-spacing: -0.05em;
  margin: 8px 0 18px;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255,255,255,0.65);
  max-width: 560px;
}

@media (max-width: 768px) {
  .hero { padding: 130px 0 70px; }
}
```

- [ ] **Create `src/components/sections/Marquee/Marquee.tsx`**

```tsx
// src/components/sections/Marquee/Marquee.tsx
import styles from './Marquee.module.css';

interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  // Repeat twice for seamless loop
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>{item} <span className={styles.dot}>•</span></span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Create `src/components/sections/Marquee/Marquee.module.css`**

```css
/* src/components/sections/Marquee/Marquee.module.css */
.wrapper {
  padding: 16px 0;
  overflow: hidden;
  background: var(--surface-low);
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.track {
  display: flex;
  gap: 0;
  width: max-content;
  animation: marquee 32s linear infinite;
  font-family: var(--font-headlines), sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2.4rem);
  font-style: italic;
  color: rgba(255,255,255,0.1);
  text-transform: uppercase;
}

.item {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 0 16px;
  white-space: nowrap;
}

.dot {
  color: var(--primary);
  opacity: 0.5;
}

@keyframes marquee {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/components/layout/PageHero/ src/components/sections/Marquee/
git commit -m "feat: add PageHero and Marquee layout components"
```

---

### Task 7: Navbar

**Files:**
- Modify: `src/components/Navbar/Navbar.tsx`
- Modify: `src/components/Navbar/Navbar.module.css`

- [ ] **Replace `src/components/Navbar/Navbar.tsx`**

```tsx
// src/components/Navbar/Navbar.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle, MapPin, X, Menu as MenuIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useScrolled } from '@/hooks/useScrolled';
import { WA_GENERAL } from '@/content/config';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { t, toggle, lang } = useLanguage();
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`${styles.wrapper} ${scrolled ? 'glass' : ''}`}>
          <div className={styles.logo}>
            <Link href="/" onClick={() => setOpen(false)}>D&apos;Pavo</Link>
            <span className={styles.location}><MapPin size={13} /> {t.hero.location}</span>
          </div>

          <ul className={styles.links}>
            <li><Link href="/">{t.nav.home}</Link></li>
            <li><Link href="/menu">{t.nav.menu}</Link></li>
            <li><Link href="/events">{t.nav.events}</Link></li>
            <li><Link href="/about">{t.nav.about}</Link></li>
            <li><Link href="/gallery">{t.nav.gallery}</Link></li>
          </ul>

          <div className={styles.actions}>
            <button className={styles.langBtn} onClick={toggle} aria-label="Toggle language">
              {t.nav.lang}
            </button>
            <a href={WA_GENERAL} className={styles.waBtn} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> {t.nav.order}
            </a>
            <button
              className={`${styles.hamburger} ${open ? styles.open : ''}`}
              aria-label="Open menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <ul className={styles.drawerLinks}>
          {([
            ['/', t.nav.home],
            ['/menu', t.nav.menu],
            ['/events', t.nav.events],
            ['/about', t.nav.about],
            ['/gallery', t.nav.gallery],
          ] as [string, string][]).map(([href, label]) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)}>{label}</Link>
            </li>
          ))}
        </ul>
        <div className={styles.drawerActions}>
          <button className={styles.langBtn} onClick={toggle}>{lang === 'en' ? 'ES' : 'EN'}</button>
          <a href={WA_GENERAL} className={styles.waBtn} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={15} /> {t.nav.order}
          </a>
        </div>
      </div>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  );
}
```

- [ ] **Replace `src/components/Navbar/Navbar.module.css`**

```css
/* src/components/Navbar/Navbar.module.css */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 12px 24px;
  transition: padding 0.3s ease;
}

.scrolled {
  padding: 8px 24px;
}

.wrapper {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 14px 24px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.08);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.scrolled .wrapper {
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
}

.logo a {
  font-family: var(--font-headlines), sans-serif;
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--foreground);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: -0.04em;
}

.location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-labels), sans-serif;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.45);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 2px;
}

.links {
  display: flex;
  list-style: none;
  gap: 32px;
}

.links a {
  font-family: var(--font-labels), sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255,255,255,0.65);
  transition: color 0.2s ease;
}

.links a:hover { color: var(--foreground); }

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.langBtn {
  background: none;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.65);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
}
.langBtn:hover {
  border-color: var(--secondary);
  color: var(--secondary);
}

.waBtn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--primary);
  color: #fff;
  padding: 8px 16px;
  border-radius: var(--radius-sm);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.waBtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.4);
}

.hamburger {
  display: none;
  background: none;
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--foreground);
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}
.hamburger:hover { border-color: rgba(255,255,255,0.3); }

/* Drawer */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: rgba(13,13,13,0.97);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 48px;
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.37, 0, 0.63, 1);
}
.drawerOpen { transform: translateX(0); }

.drawerLinks {
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
}
.drawerLinks a {
  font-family: var(--font-headlines), sans-serif;
  font-size: clamp(2rem, 8vw, 3.5rem);
  font-weight: 800;
  color: rgba(255,255,255,0.8);
  text-transform: uppercase;
  letter-spacing: -0.03em;
  transition: color 0.2s ease;
}
.drawerLinks a:hover { color: var(--primary); }

.drawerActions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.overlay {
  position: fixed;
  inset: 0;
  z-index: 98;
}

@media (max-width: 1024px) {
  .links { display: none; }
  .waBtn span { display: none; }
  .hamburger { display: inline-flex; }
}

@media (max-width: 640px) {
  .nav { padding: 8px 16px; }
  .wrapper { padding: 10px 16px; }
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/components/Navbar/
git commit -m "feat: rebuild Navbar with language toggle, scroll effect and mobile drawer"
```

---

### Task 8: Footer

**Files:**
- Modify: `src/components/Footer/Footer.tsx`
- Modify: `src/components/Footer/Footer.module.css`

- [ ] **Replace `src/components/Footer/Footer.tsx`**

```tsx
// src/components/Footer/Footer.tsx
import Link from 'next/link';
import { Clock3, MapPin, MessageCircle } from 'lucide-react';
import styles from './Footer.module.css';

// Footer is a server component — it reads lang from a prop passed down,
// but since it's used inside client pages that call useLanguage, we keep it
// simple and accept translated strings as props.
interface FooterProps {
  tagline: string;
  explore: string;
  visit: string;
  address: string;
  hoursShort: string;
  whatsapp: string;
  rights: string;
  navLabels: { home: string; menu: string; events: string; about: string; gallery: string };
  waHref: string;
}

export default function Footer({
  tagline, explore, visit, address, hoursShort, whatsapp, rights, navLabels, waHref,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h2 className={styles.logo}>D&apos;Pavo</h2>
            <p className={styles.tagline}>{tagline}</p>
          </div>

          <div className={styles.col}>
            <h4>{explore}</h4>
            <Link href="/">{navLabels.home}</Link>
            <Link href="/menu">{navLabels.menu}</Link>
            <Link href="/events">{navLabels.events}</Link>
            <Link href="/about">{navLabels.about}</Link>
            <Link href="/gallery">{navLabels.gallery}</Link>
          </div>

          <div className={styles.col}>
            <h4>{visit}</h4>
            <p><MapPin size={14} /> {address}</p>
            <p><Clock3 size={14} /> {hoursShort}</p>
            <a href={waHref} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={14} /> {whatsapp}
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {rights}</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Replace `src/components/Footer/Footer.module.css`**

```css
/* src/components/Footer/Footer.module.css */
.footer {
  background: var(--surface-low);
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 70px 0 32px;
  margin-top: auto;
}

.grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr;
  gap: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.logo {
  font-size: 2rem;
  letter-spacing: -0.04em;
  margin-bottom: 12px;
}

.tagline {
  color: rgba(255,255,255,0.5);
  max-width: 36ch;
  font-size: 0.9rem;
}

.col h4 {
  font-family: var(--font-labels), sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(255,255,255,0.4);
  margin-bottom: 18px;
}

.col a, .col p {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  margin-bottom: 10px;
  transition: color 0.2s ease;
}

.col a:hover { color: var(--foreground); }

.bottom {
  padding-top: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom p {
  color: rgba(255,255,255,0.3);
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .brand { grid-column: 1 / -1; }
}

@media (max-width: 480px) {
  .grid { grid-template-columns: 1fr; }
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/components/Footer/
git commit -m "feat: rebuild Footer with translated props interface"
```

---

## Phase 2 — Pages

### Task 9: Home page

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/page.module.css`

- [ ] **Replace `src/app/page.tsx`**

```tsx
// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Clock3, MapPin, MessageCircle, CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { Marquee } from '@/components/sections/Marquee/Marquee';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL, WA_ORDER, WA_RESERVE } from '@/content/config';
import { MENU_ITEMS } from '@/content/menu';
import { EVENTS } from '@/content/events';
import { REVIEWS } from '@/content/reviews';
import styles from './page.module.css';

function AnimSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section ref={ref} className={`${className} animate-in ${inView ? 'visible' : ''}`}>
      {children}
    </section>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const featured = MENU_ITEMS.filter((i) => i.featured);

  return (
    <main className={styles.main}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBackdrop} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.kicker}>{t.hero.kicker}</span>
            <h1 className={styles.heroTitle}>
              <span className={styles.red}>{t.hero.title1}</span>{' '}
              {t.hero.title2}{' '}
              <span className={styles.white}>{t.hero.title3}</span>
            </h1>
            <p className={styles.heroSub}>{t.hero.subtitle}</p>
            <div className={styles.heroCtas}>
              <Link href="/menu" className="btn-primary">{t.hero.cta1}</Link>
              <Link href="/events" className="btn-secondary">{t.hero.cta2}</Link>
            </div>
            <div className={styles.heroMeta}>
              <span><Clock3 size={14} /> {t.hero.hours}</span>
              <span><MapPin size={14} /> {t.hero.location}</span>
            </div>
          </div>
        </div>
        <div className={styles.scrollIndicator} aria-hidden="true">
          <span />
        </div>
      </section>

      {/* Marquee */}
      <Marquee items={t.marquee} />

      {/* Signature Picks */}
      <AnimSection className={styles.signatureSection}>
        <div className="container">
          <SectionHeader label={t.signature.label} title={t.signature.title} subtitle={t.signature.subtitle} />
          <div className={styles.signatureGrid}>
            {featured.map((item, i) => (
              <article
                key={item.id}
                className={`${styles.sigCard} ${styles[item.tone]} animate-scale visible`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.sigGlow} />
                <div className={styles.sigTop}>
                  <Badge>{t.signature.trending}</Badge>
                  <span className={styles.sigPrice}>{item.price}</span>
                </div>
                {item.image && (
                  <img src={item.image} alt={item.name} className={styles.sigImg} />
                )}
                <h3>{item.name}</h3>
                <p>{t.nav.lang === 'EN' ? item.descriptionEs : item.description}</p>
                <a href={WA_ORDER(item.name)} target="_blank" rel="noopener noreferrer" className={styles.sigAction}>
                  {t.signature.order} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* How It Works */}
      <AnimSection className={styles.howSection}>
        <div className="container">
          <SectionHeader label={t.howItWorks.label} title={t.howItWorks.title} align="center" />
          <div className={styles.stepsRow}>
            {t.howItWorks.steps.map((step, i) => (
              <div
                key={i}
                className={`${styles.step} animate-scale ${styles.visible}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* Day / Night */}
      <AnimSection className={styles.dayNightSection}>
        <div className="container">
          <div className={styles.dayNightGrid}>
            <div className={styles.dayPanel}>
              <span className="label">{t.dayNight.day.label}</span>
              <h2>{t.dayNight.day.title}</h2>
              <p>{t.dayNight.day.copy}</p>
            </div>
            <div className={styles.nightPanel}>
              <span className="label">{t.dayNight.night.label}</span>
              <h2>{t.dayNight.night.title}</h2>
              <p>{t.dayNight.night.copy}</p>
            </div>
          </div>
        </div>
      </AnimSection>

      {/* Reviews */}
      <AnimSection className={styles.reviewsSection}>
        <div className="container">
          <SectionHeader label={t.reviews.label} title={t.reviews.title} align="center" />
          <div className={styles.reviewsGrid}>
            {REVIEWS.map((r, i) => (
              <div
                key={r.id}
                className={`${styles.reviewCard} surface-low animate-in visible`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.stars}>{'★'.repeat(r.stars)}</div>
                <p className={styles.reviewQuote}>&ldquo;{t.nav.lang === 'EN' ? r.quoteEs : r.quoteEn}&rdquo;</p>
                <div className={styles.reviewAuthor}>
                  <strong>{r.nameEn}</strong>
                  <span>{r.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* Hours + Location */}
      <AnimSection className={styles.hoursSection}>
        <div className="container">
          <div className={styles.hoursSplit}>
            <div className={styles.hoursInfo}>
              <SectionHeader label={t.hours.label} title={t.hours.title} />
              <ul className={styles.schedule}>
                {t.hours.schedule.map((row) => (
                  <li key={row.day}>
                    <span>{row.day}</span>
                    <span>{row.hours}</span>
                  </li>
                ))}
              </ul>
              <a href={WA_GENERAL} className="btn-primary" target="_blank" rel="noopener noreferrer" style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MapPin size={15} /> {t.hours.cta}
              </a>
            </div>
            <div className={styles.mapPlaceholder}>
              <div className={styles.mapInner}>
                <MapPin size={36} style={{ color: 'var(--primary)', opacity: 0.7 }} />
                <p>{t.hours.address}</p>
              </div>
            </div>
          </div>
        </div>
      </AnimSection>

      {/* Events Preview */}
      <AnimSection className={styles.eventsSection}>
        <div className="container">
          <SectionHeader
            label={t.eventsCta.label}
            title={t.eventsCta.title}
            action={<Link href="/events" className="btn-secondary">{t.eventsCta.link}</Link>}
          />
          <div className={styles.eventsList}>
            {EVENTS.map((ev, i) => (
              <div
                key={ev.id}
                className={`${styles.eventRow} surface-low animate-in visible`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.eventDay}>{t.nav.lang === 'EN' ? ev.dayEs : ev.dayEn}</div>
                <div className={styles.eventInfo}>
                  <h3>{t.nav.lang === 'EN' ? ev.titleEs : ev.titleEn}</h3>
                  <p>{ev.time} · {ev.location}</p>
                </div>
                <Badge color="red">{ev.tag}</Badge>
              </div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* CTA */}
      <AnimSection className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <span className="label" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.cta.label}</span>
            <h2>{t.cta.title}</h2>
            <p>{t.cta.subtitle}</p>
            <div className={styles.ctaActions}>
              <Link href="/menu" className="btn-primary">{t.cta.cta1}</Link>
              <a href={WA_RESERVE('mesa')} className="btn-secondary" target="_blank" rel="noopener noreferrer">
                <MessageCircle size={15} /> {t.cta.cta2}
              </a>
            </div>
          </div>
        </div>
      </AnimSection>

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
```

- [ ] **Replace `src/app/page.module.css`** with the Home page styles

```css
/* src/app/page.module.css */
.main {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── Hero ────────────────────────────────────── */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 180px 0 120px;
  overflow: hidden;
}

.heroBackdrop {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 15% 25%, rgba(var(--primary-rgb), 0.3), transparent 35%),
    radial-gradient(circle at 80% 15%, rgba(var(--secondary-rgb), 0.18), transparent 28%),
    radial-gradient(circle at 60% 80%, rgba(var(--tertiary-rgb), 0.08), transparent 30%),
    linear-gradient(135deg, #0f0f0f 0%, #141414 100%);
}

.heroContent {
  position: relative;
  z-index: 1;
  max-width: 900px;
}

.kicker {
  display: inline-block;
  padding: 7px 16px;
  border: 1px solid rgba(var(--secondary-rgb), 0.4);
  background: rgba(var(--secondary-rgb), 0.08);
  color: var(--secondary);
  border-radius: var(--radius-full);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 22px;
}

.heroTitle {
  font-size: clamp(4rem, 12vw, 9rem);
  line-height: 0.88;
  letter-spacing: -0.06em;
  margin-bottom: 24px;
}

.red { color: var(--primary); text-shadow: 0 0 30px rgba(var(--primary-rgb), 0.4); }
.white { color: #fff; }

.heroSub {
  font-size: 1.15rem;
  color: rgba(255,255,255,0.65);
  max-width: 560px;
  margin-bottom: 32px;
}

.heroCtas {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 28px;
}

.heroMeta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.heroMeta span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(255,255,255,0.45);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scrollIndicator {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
}

.scrollIndicator span {
  display: block;
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.3));
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.15); }
}

/* ── Signature ────────────────────────────────── */
.signatureSection { background: var(--background); }

.signatureGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.sigCard {
  position: relative;
  overflow: hidden;
  min-height: 300px;
  padding: 28px;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.07);
  background: linear-gradient(180deg, rgba(42,42,42,0.6), rgba(16,16,16,0.95));
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sigCard:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

.sigGlow {
  position: absolute;
  width: 220px;
  height: 220px;
  right: -70px;
  top: -70px;
  border-radius: 50%;
  filter: blur(14px);
  opacity: 0.2;
}

.red .sigGlow    { background: var(--primary); }
.yellow .sigGlow { background: var(--tertiary); }
.cyan .sigGlow   { background: var(--secondary); }
.white .sigGlow  { background: #fff; }

.sigTop {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.sigPrice {
  font-family: var(--font-labels), sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--tertiary);
}

.sigImg {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 160px;
  object-fit: contain;
  margin-bottom: 18px;
}

.sigCard h3 {
  position: relative;
  z-index: 1;
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.sigCard p {
  position: relative;
  z-index: 1;
  color: rgba(255,255,255,0.58);
  margin-bottom: 22px;
  max-width: 28ch;
  font-size: 0.9rem;
}

.sigAction {
  position: relative;
  z-index: 1;
  color: var(--secondary);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-weight: 700;
  transition: gap 0.2s ease;
}

/* ── How It Works ─────────────────────────────── */
.howSection { background: var(--surface-low); }

.stepsRow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px;
}

.step {
  padding: 40px 32px;
  border: 1px solid rgba(255,255,255,0.06);
  background: var(--surface-low);
  transition: background 0.3s ease, transform 0.3s ease;
}

.step:hover {
  background: var(--surface-high);
  transform: translateY(-4px);
}

.step:first-child { border-radius: var(--radius-md) 0 0 var(--radius-md); }
.step:last-child  { border-radius: 0 var(--radius-md) var(--radius-md) 0; }

.stepNum {
  font-family: var(--font-headlines), sans-serif;
  font-size: 3.5rem;
  color: rgba(var(--primary-rgb), 0.2);
  letter-spacing: -0.04em;
  margin-bottom: 16px;
  line-height: 1;
}

.step h3 { font-size: 1.3rem; margin-bottom: 10px; }
.step p  { color: rgba(255,255,255,0.55); font-size: 0.9rem; }

/* ── Day / Night ─────────────────────────────── */
.dayNightSection { background: var(--background); }

.dayNightGrid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.07);
}

.dayPanel, .nightPanel {
  min-height: 440px;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: background 0.4s ease;
}

.dayPanel {
  background: linear-gradient(200deg, rgba(var(--tertiary-rgb),0.1), rgba(255,255,255,0.02));
}
.dayPanel:hover { background: linear-gradient(200deg, rgba(var(--tertiary-rgb),0.18), rgba(255,255,255,0.04)); }

.nightPanel {
  border-left: 1px solid rgba(255,255,255,0.07);
  background: linear-gradient(200deg, rgba(var(--primary-rgb),0.12), rgba(0,0,0,0.3));
}
.nightPanel:hover { background: linear-gradient(200deg, rgba(var(--primary-rgb),0.2), rgba(0,0,0,0.4)); }

.dayPanel h2, .nightPanel h2 {
  font-size: clamp(2rem, 4.5vw, 3.6rem);
  margin: 10px 0 14px;
}

.dayPanel p, .nightPanel p {
  max-width: 38ch;
  color: rgba(255,255,255,0.62);
}

/* ── Reviews ─────────────────────────────────── */
.reviewsSection { background: var(--surface-low); }

.reviewsGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 20px;
}

.reviewCard {
  padding: 28px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.reviewCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 40px rgba(0,0,0,0.3);
}

.stars {
  color: var(--tertiary);
  font-size: 1rem;
  letter-spacing: 2px;
  margin-bottom: 14px;
}

.reviewQuote {
  color: rgba(255,255,255,0.8);
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 20px;
}

.reviewAuthor {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reviewAuthor strong {
  font-family: var(--font-labels), sans-serif;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--secondary);
}

.reviewAuthor span {
  color: rgba(255,255,255,0.35);
  font-size: 0.78rem;
}

/* ── Hours ───────────────────────────────────── */
.hoursSection { background: var(--background); }

.hoursSplit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: start;
}

.schedule {
  list-style: none;
  margin-top: 8px;
}

.schedule li {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.75);
  font-size: 0.92rem;
}

.schedule li span:last-child {
  color: var(--secondary);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.8rem;
}

.mapPlaceholder {
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.07);
  background: var(--surface-low);
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mapInner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 32px;
}

.mapInner p { color: rgba(255,255,255,0.45); font-size: 0.9rem; }

/* ── Events preview ──────────────────────────── */
.eventsSection { background: var(--surface-low); }

.eventsList { display: grid; gap: 14px; }

.eventRow {
  display: grid;
  grid-template-columns: 130px 1fr auto;
  gap: 20px;
  align-items: center;
  padding: 20px 24px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.3s ease, box-shadow 0.25s ease;
}

.eventRow:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.eventDay {
  font-family: var(--font-headlines), sans-serif;
  font-size: 1.1rem;
  color: var(--primary);
  font-style: italic;
}

.eventInfo h3 { font-size: 1.2rem; margin-bottom: 4px; }
.eventInfo p  { color: rgba(255,255,255,0.5); font-size: 0.82rem; }

/* ── CTA ─────────────────────────────────────── */
.ctaSection { background: var(--background); }

.ctaBox {
  padding: 64px;
  border-radius: var(--radius-xl);
  text-align: center;
  background:
    radial-gradient(circle at top center, rgba(255,255,255,0.12), transparent 35%),
    linear-gradient(165deg, rgba(var(--primary-rgb),0.88), #8b0000);
  box-shadow: 0 30px 80px rgba(var(--primary-rgb), 0.25);
}

.ctaBox h2 { font-size: clamp(2.4rem, 6vw, 5rem); margin: 12px 0 16px; }
.ctaBox p  { color: rgba(255,255,255,0.82); max-width: 580px; margin: 0 auto 28px; }

.ctaActions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

/* ── Responsive ──────────────────────────────── */
@media (max-width: 1024px) {
  .signatureGrid,
  .stepsRow,
  .reviewsGrid { grid-template-columns: 1fr 1fr; }
  .step:first-child { border-radius: var(--radius-md) var(--radius-md) 0 0; }
  .step:last-child  { border-radius: 0 0 var(--radius-md) var(--radius-md); }
  .hoursSplit { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .signatureGrid,
  .stepsRow,
  .reviewsGrid,
  .dayNightGrid { grid-template-columns: 1fr; }
  .nightPanel { border-left: none; border-top: 1px solid rgba(255,255,255,0.07); }
  .eventRow { grid-template-columns: 1fr; gap: 8px; }
  .ctaBox { padding: 40px 24px; }
  .heroTitle { font-size: clamp(3rem, 14vw, 6rem); }
}
```

- [ ] **Start dev server and visually verify Home page**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run dev
```

Open `http://localhost:3000`. Check: hero renders, marquee scrolls, signature cards show, all sections present. Stop server.

- [ ] **Run build to confirm no errors**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/app/page.tsx src/app/page.module.css
git commit -m "feat: rebuild Home page with all sections and animations"
```

---

### Task 10: Menu page

**Files:**
- Modify: `src/app/menu/page.tsx`
- Modify: `src/app/menu/menu.module.css`

- [ ] **Replace `src/app/menu/page.tsx`**

```tsx
// src/app/menu/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_ORDER, WA_GENERAL } from '@/content/config';
import { MENU_ITEMS, type MenuCategory } from '@/content/menu';
import { MessageCircle, Flame } from 'lucide-react';
import styles from './menu.module.css';

export default function MenuPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>('All');
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

  const cats = ['All', 'Pizza', 'Mariscos', 'Picaderas', 'Drinks'];

  const filtered = active === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((i) => i.category === active);

  const featured = MENU_ITEMS.filter((i) => i.featured);

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.menuPage.label}
        title={<>{t.menuPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.menuPage.subtitle}
        tone="default"
      >
        <div className={styles.cats}>
          {cats.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${active === cat ? styles.active : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </PageHero>

      <section className={styles.featured}>
        <div className="container">
          <SectionHeader label={t.menuPage.featured} title="" />
          <div className={styles.featuredGrid}>
            {featured.map((item, i) => (
              <article
                key={item.id}
                className={`${styles.featCard} animate-in visible`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.featVisual}>
                  {item.image
                    ? <img src={item.image} alt={item.name} className={styles.featImg} />
                    : <div className={`${styles.featPlaceholder} ${styles[item.tone]}`} />
                  }
                  <Badge color="red"><Flame size={12} /> {t.menuPage.trending}</Badge>
                </div>
                <div className={styles.featInfo}>
                  <div className={styles.featHeader}>
                    <div>
                      <h3>{item.name}</h3>
                      <span className={styles.subtitle}>{item.subtitle}</span>
                    </div>
                    <span className={styles.price}>{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                  <a href={WA_ORDER(item.name)} className="btn-primary" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={15} /> {t.menuPage.order}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.allItems}>
        <div className="container">
          <div
            ref={gridRef}
            className={`${styles.listGrid} animate-in ${gridInView ? 'visible' : ''}`}
          >
            {filtered.map((item, i) => (
              <article
                key={item.id}
                className={`${styles.listCard} surface-low animate-in visible`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.listTop}>
                  <Badge>{item.category}</Badge>
                  <span className={styles.price}>{item.price}</span>
                </div>
                <h3>{item.name} <span className={styles.listSubtitle}>{item.subtitle}</span></h3>
                <p>{item.description}</p>
                <a href={WA_ORDER(item.name)} className={styles.askBtn} target="_blank" rel="noopener noreferrer">
                  {t.menuPage.ask} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
```

- [ ] **Replace `src/app/menu/menu.module.css`**

```css
/* src/app/menu/menu.module.css */
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.catBtn {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.65);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.25s ease;
}

.catBtn:hover {
  border-color: rgba(255,255,255,0.3);
  color: #fff;
}

.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 6px 18px rgba(var(--primary-rgb), 0.35);
}

/* Featured */
.featured { padding: 80px 0 40px; }

.featuredGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.featCard {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255,255,255,0.07);
  overflow: hidden;
  background: var(--surface-low);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.featCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
}

.featVisual {
  position: relative;
  min-height: 220px;
  background: var(--surface-high);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.featVisual > span {
  position: absolute;
  top: 14px;
  left: 14px;
}

.featImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featPlaceholder {
  width: 100%;
  height: 100%;
}

.featPlaceholder.red    { background: radial-gradient(circle, rgba(var(--primary-rgb),0.3), transparent 70%); }
.featPlaceholder.yellow { background: radial-gradient(circle, rgba(var(--tertiary-rgb),0.3), transparent 70%); }
.featPlaceholder.cyan   { background: radial-gradient(circle, rgba(var(--secondary-rgb),0.3), transparent 70%); }

.featInfo {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.featHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.featInfo h3 { font-size: 1.6rem; }
.subtitle { color: rgba(255,255,255,0.4); font-size: 0.78rem; display: block; margin-top: 2px; }
.featInfo p { color: rgba(255,255,255,0.6); font-size: 0.9rem; flex: 1; }

.price {
  font-family: var(--font-labels), sans-serif;
  font-weight: 800;
  font-size: 1.1rem;
  color: var(--tertiary);
  white-space: nowrap;
}

/* All items grid */
.allItems { padding: 40px 0 100px; }

.listGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.listCard {
  padding: 24px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: transform 0.3s ease, box-shadow 0.25s ease;
}

.listCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 36px rgba(0,0,0,0.35);
}

.listTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.listCard h3 { font-size: 1.15rem; }
.listSubtitle { color: rgba(255,255,255,0.35); font-size: 0.78rem; font-weight: 400; text-transform: none; letter-spacing: 0; }
.listCard p { color: rgba(255,255,255,0.55); font-size: 0.85rem; flex: 1; }

.askBtn {
  color: var(--secondary);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  transition: opacity 0.2s;
}
.askBtn:hover { opacity: 0.75; }

@media (max-width: 768px) {
  .featCard { grid-template-columns: 1fr; }
  .featVisual { min-height: 180px; }
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/app/menu/
git commit -m "feat: rebuild Menu page with working category filter"
```

---

### Task 11: Events page

**Files:**
- Modify: `src/app/events/page.tsx`
- Modify: `src/app/events/events.module.css`

- [ ] **Replace `src/app/events/page.tsx`**

```tsx
// src/app/events/page.tsx
'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_RESERVE, WA_EVENTS, WA_GENERAL } from '@/content/config';
import { EVENTS } from '@/content/events';
import { Calendar, Clock3, MapPin, Mic2, Music4, MessageCircle } from 'lucide-react';
import styles from './events.module.css';

export default function EventsPage() {
  const { t } = useLanguage();
  const [calRef, calInView] = useInView<HTMLDivElement>();
  const [vibeRef, vibeInView] = useInView<HTMLDivElement>();
  const featured = EVENTS.find((e) => e.featured) ?? EVENTS[1];
  const rest = EVENTS.filter((e) => !e.featured);

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.eventsPage.label}
        title={<>{t.eventsPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.eventsPage.subtitle}
        tone="dark"
      />

      {/* Featured event */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.featCard}>
            <div className={styles.featVisual}>
              <div className={styles.liveBadge}>{t.eventsPage.featuredLabel}</div>
            </div>
            <div className={styles.featInfo}>
              <Badge color="red">{featured.tag}</Badge>
              <h2>{t.nav.lang === 'EN' ? featured.titleEs : featured.titleEn}</h2>
              <p>{t.nav.lang === 'EN' ? featured.descriptionEs : featured.descriptionEn}</p>
              <div className={styles.details}>
                <span><Calendar size={15} /> {featured.date}</span>
                <span><Clock3 size={15} /> {featured.time}</span>
                <span><MapPin size={15} /> {featured.location}</span>
              </div>
              <a href={WA_RESERVE(featured.titleEn)} className="btn-primary" target="_blank" rel="noopener noreferrer">
                {t.eventsPage.reserve}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly calendar */}
      <section className={styles.calSection}>
        <div className="container">
          <SectionHeader label={t.eventsPage.weeklyLabel} title={t.eventsPage.weeklyTitle} />
          <div ref={calRef} className={styles.calGrid}>
            {EVENTS.map((ev, i) => (
              <article
                key={ev.id}
                className={`${styles.calCard} surface-low animate-scale ${calInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.calIcon}>
                  {i === 0 ? <Mic2 size={32} /> : <Music4 size={32} />}
                </div>
                <div className={styles.calBody}>
                  <div className={styles.calMeta}>
                    <Badge>{ev.tag}</Badge>
                    <span className={styles.calDate}>{ev.date}</span>
                  </div>
                  <h3>{t.nav.lang === 'EN' ? ev.dayEs : ev.dayEn} — {t.nav.lang === 'EN' ? ev.titleEs : ev.titleEn}</h3>
                  <p>{t.nav.lang === 'EN' ? ev.descriptionEs : ev.descriptionEn}</p>
                  <div className={styles.calFooter}>
                    <span><Clock3 size={13} /> {ev.time}</span>
                    <a href={WA_RESERVE(ev.titleEn)} className={styles.reserveBtn} target="_blank" rel="noopener noreferrer">
                      {t.eventsPage.reserveNow} →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe section */}
      <section className={styles.vibeSection} ref={vibeRef}>
        <div className="container">
          <SectionHeader label={t.eventsPage.vibeLabel} title={t.eventsPage.vibeTitle} align="center" />
          <div className={styles.vibeGrid}>
            {t.eventsPage.vibes.map((v, i) => (
              <div
                key={i}
                className={`${styles.vibeCard} animate-in ${vibeInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <h3>{v.title}</h3>
                <p>{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp broadcast */}
      <section className={styles.notifySection}>
        <div className="container">
          <div className={styles.notifyBox}>
            <div>
              <span className="label">{t.eventsPage.notifyLabel}</span>
              <h2>{t.eventsPage.notifyTitle}</h2>
            </div>
            <a href={WA_EVENTS} className="btn-primary" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> {t.eventsPage.notifyCta}
            </a>
          </div>
        </div>
      </section>

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
```

- [ ] **Replace `src/app/events/events.module.css`**

```css
/* src/app/events/events.module.css */
/* Featured */
.featuredSection { padding: 80px 0; }

.featCard {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.07);
  background: var(--surface-low);
}

.featVisual {
  position: relative;
  min-height: 420px;
  background:
    radial-gradient(circle at 40% 40%, rgba(var(--primary-rgb),0.25), transparent 50%),
    var(--surface-high);
  display: flex;
  align-items: flex-start;
  padding: 28px;
}

.liveBadge {
  padding: 6px 14px;
  background: var(--primary);
  color: #fff;
  font-family: var(--font-labels), sans-serif;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  border-radius: var(--radius-sm);
}

.featInfo {
  padding: 48px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
}

.featInfo h2 { font-size: clamp(2rem, 4vw, 3rem); }
.featInfo p  { color: rgba(255,255,255,0.65); max-width: 42ch; }

.details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.details span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: rgba(255,255,255,0.55);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Calendar */
.calSection { padding: 80px 0; background: var(--surface-low); }

.calGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 18px;
}

.calCard {
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.calCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 44px rgba(0,0,0,0.4);
}

.calIcon {
  padding: 32px;
  background: var(--surface-high);
  color: var(--primary);
  display: flex;
  align-items: center;
}

.calBody { padding: 24px; flex: 1; display: flex; flex-direction: column; gap: 10px; }

.calMeta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.calDate {
  color: rgba(255,255,255,0.35);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.calBody h3 { font-size: 1.2rem; }
.calBody p  { color: rgba(255,255,255,0.55); font-size: 0.88rem; flex: 1; }

.calFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.calFooter span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.4);
  font-size: 0.78rem;
}

.reserveBtn {
  color: var(--secondary);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  transition: opacity 0.2s;
}

/* Vibe */
.vibeSection { padding: 80px 0; background: var(--background); }

.vibeGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 2px;
  margin-top: 8px;
}

.vibeCard {
  padding: 40px 32px;
  border: 1px solid rgba(255,255,255,0.06);
  background: var(--surface-low);
  transition: background 0.3s ease, transform 0.3s ease;
}

.vibeCard:hover { background: var(--surface-high); transform: translateY(-3px); }
.vibeCard h3 { font-size: 1.4rem; margin-bottom: 12px; }
.vibeCard p  { color: rgba(255,255,255,0.55); font-size: 0.9rem; }

/* Notify */
.notifySection { padding: 60px 0; background: var(--surface-low); border-top: 1px solid rgba(255,255,255,0.05); }

.notifyBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  flex-wrap: wrap;
}

.notifyBox h2 { font-size: clamp(1.6rem, 3vw, 2.4rem); margin-top: 4px; }

@media (max-width: 1024px) {
  .featCard, .calGrid, .vibeGrid { grid-template-columns: 1fr; }
  .featVisual { min-height: 240px; }
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/app/events/
git commit -m "feat: rebuild Events page with vibe section and WhatsApp notify strip"
```

---

### Task 12: About page

**Files:**
- Create: `src/app/about/page.tsx`
- Create: `src/app/about/about.module.css`

- [ ] **Create `src/app/about/page.tsx`**

```tsx
// src/app/about/page.tsx
'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL } from '@/content/config';
import { SHOW_TEAM_SECTION, TEAM_MEMBERS } from '@/content/about';
import { Clock3, MapPin, MessageCircle } from 'lucide-react';
import styles from './about.module.css';

export default function AboutPage() {
  const { t } = useLanguage();
  const [storyRef, storyInView] = useInView<HTMLDivElement>();
  const [valuesRef, valuesInView] = useInView<HTMLDivElement>();

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.aboutPage.label}
        title={<>{t.aboutPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.aboutPage.subtitle}
        tone="warm"
      />

      {/* Origin story */}
      <section className={styles.storySection}>
        <div className="container">
          <div
            ref={storyRef}
            className={`${styles.storySplit} animate-in ${storyInView ? 'visible' : ''}`}
          >
            <div className={styles.storyText}>
              <SectionHeader label={t.aboutPage.storyTitle} title="" />
              {t.aboutPage.storyBody.map((para, i) => (
                <p key={i} className={styles.storyPara}>{para}</p>
              ))}
            </div>
            <div className={styles.storyVisual}>
              <div className={styles.storyPlaceholder}>
                <span className={styles.placeholderLabel}>Venue Photo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <SectionHeader label={t.aboutPage.valuesLabel} title={t.aboutPage.valuesTitle} align="center" />
          <div ref={valuesRef} className={styles.valuesGrid}>
            {t.aboutPage.values.map((v, i) => (
              <div
                key={i}
                className={`${styles.valueCard} surface-low animate-scale ${valuesInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3>{v.title}</h3>
                <p>{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team (hidden by default) */}
      {SHOW_TEAM_SECTION && (
        <section className={styles.teamSection}>
          <div className="container">
            <SectionHeader label="The Team" title="The people behind D'Pavo." align="center" />
            <div className={styles.teamGrid}>
              {TEAM_MEMBERS.map((member, i) => (
                <div key={i} className={`${styles.teamCard} surface-low`}>
                  <div className={styles.teamAvatar} />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Visit */}
      <section className={styles.visitSection}>
        <div className="container">
          <div className={styles.visitBox}>
            <div>
              <SectionHeader label={t.aboutPage.visitLabel} title={t.aboutPage.visitTitle} />
              <div className={styles.visitDetails}>
                <p><MapPin size={16} /> {t.hours.address}</p>
                <p><Clock3 size={16} /> {t.footer.hoursShort}</p>
              </div>
              <a href={WA_GENERAL} className="btn-primary" target="_blank" rel="noopener noreferrer" style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={15} /> {t.aboutPage.visitCta}
              </a>
            </div>
            <div className={styles.visitMapPlaceholder}>
              <MapPin size={40} style={{ color: 'var(--primary)', opacity: 0.6 }} />
              <p>Plaza Verón Center</p>
            </div>
          </div>
        </div>
      </section>

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
```

- [ ] **Create `src/app/about/about.module.css`**

```css
/* src/app/about/about.module.css */
.storySection { padding: 80px 0; }

.storySplit {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.storyText { display: flex; flex-direction: column; gap: 16px; }
.storyPara { color: rgba(255,255,255,0.68); font-size: 1.02rem; line-height: 1.75; }

.storyVisual { }

.storyPlaceholder {
  min-height: 420px;
  border-radius: var(--radius-xl);
  background:
    radial-gradient(circle at 40% 40%, rgba(var(--tertiary-rgb),0.12), transparent 55%),
    var(--surface-high);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: flex-end;
  padding: 24px;
}

.placeholderLabel {
  font-family: var(--font-labels), sans-serif;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.25);
}

/* Values */
.valuesSection { padding: 80px 0; background: var(--surface-low); }

.valuesGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0,1fr));
  gap: 20px;
}

.valueCard {
  padding: 36px 30px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.valueCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 18px 44px rgba(0,0,0,0.35);
}

.valueNum {
  font-family: var(--font-headlines), sans-serif;
  font-size: 3rem;
  color: rgba(var(--primary-rgb),0.2);
  letter-spacing: -0.04em;
  margin-bottom: 14px;
  line-height: 1;
}

.valueCard h3 { font-size: 1.35rem; margin-bottom: 10px; }
.valueCard p  { color: rgba(255,255,255,0.55); font-size: 0.9rem; }

/* Team */
.teamSection { padding: 80px 0; }

.teamGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.teamCard {
  padding: 28px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255,255,255,0.06);
  text-align: center;
}

.teamAvatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--surface-high);
  margin: 0 auto 16px;
}

.teamCard h3 { font-size: 1.1rem; margin-bottom: 4px; }
.teamCard p  { color: rgba(255,255,255,0.45); font-size: 0.82rem; }

/* Visit */
.visitSection { padding: 80px 0; }

.visitBox {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 56px;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255,255,255,0.07);
  background: var(--surface-low);
}

.visitDetails { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
.visitDetails p {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.6);
  font-size: 0.95rem;
}

.visitMapPlaceholder {
  min-height: 280px;
  border-radius: var(--radius-lg);
  background:
    radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb),0.12), transparent 60%),
    var(--surface-high);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.visitMapPlaceholder p { color: rgba(255,255,255,0.35); font-size: 0.85rem; }

@media (max-width: 1024px) {
  .storySplit, .valuesGrid, .visitBox { grid-template-columns: 1fr; }
  .visitBox { padding: 36px 24px; }
}
```

- [ ] **Verify build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/app/about/
git commit -m "feat: add About page with story, values and visit panel"
```

---

### Task 13: Gallery page

**Files:**
- Create: `src/app/gallery/page.tsx`
- Create: `src/app/gallery/gallery.module.css`

- [ ] **Create `src/app/gallery/page.tsx`**

```tsx
// src/app/gallery/page.tsx
'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL } from '@/content/config';
import { GALLERY_ITEMS, type GalleryCategory } from '@/content/gallery';
import { X } from 'lucide-react';
import styles from './gallery.module.css';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

  const cats = ['All', 'Food', 'Venue', 'Events'];

  const filtered = active === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((i) => i.category === active);

  const lightboxItem = lightbox !== null ? GALLERY_ITEMS.find((i) => i.id === lightbox) : null;

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.galleryPage.label}
        title={<>{t.galleryPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.galleryPage.subtitle}
        tone="dark"
      >
        <div className={styles.cats}>
          {cats.map((cat) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${active === cat ? styles.active : ''}`}
              onClick={() => setActive(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </PageHero>

      <section className={styles.gridSection}>
        <div className="container">
          <div ref={gridRef} className={styles.masonry}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`${styles.item} animate-in ${gridInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
                onClick={() => setLightbox(item.id)}
              >
                {item.src
                  ? <img src={item.src} alt={item.alt} className={styles.img} />
                  : <div className={`${styles.placeholder} ${styles[item.tone]}`} />
                }
                <div className={styles.overlay}>
                  <Badge>{item.category}</Badge>
                  <p>{item.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxItem && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.close} onClick={() => setLightbox(null)} aria-label="Close">
            <X size={24} />
          </button>
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            {lightboxItem.src
              ? <img src={lightboxItem.src} alt={lightboxItem.alt} className={styles.lightboxImg} />
              : <div className={`${styles.lightboxPlaceholder} ${styles[lightboxItem.tone]}`} />
            }
            <p className={styles.lightboxCaption}>{lightboxItem.alt}</p>
          </div>
        </div>
      )}

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
```

- [ ] **Create `src/app/gallery/gallery.module.css`**

```css
/* src/app/gallery/gallery.module.css */
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.catBtn {
  padding: 8px 18px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.65);
  font-family: var(--font-labels), sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.25s ease;
}
.catBtn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
.active { background: var(--primary); border-color: var(--primary); color: #fff; }

/* Masonry grid */
.gridSection { padding: 80px 0 100px; }

.masonry {
  columns: 3 280px;
  column-gap: 16px;
}

.item {
  break-inside: avoid;
  margin-bottom: 16px;
  border-radius: var(--radius-md);
  overflow: hidden;
  position: relative;
  cursor: pointer;
  background: var(--surface-high);
}

.item:hover .overlay { opacity: 1; }
.item:hover .img, .item:hover .placeholder { transform: scale(1.04); }

.img {
  width: 100%;
  display: block;
  transition: transform 0.4s ease;
}

.placeholder {
  width: 100%;
  aspect-ratio: 4/3;
  transition: transform 0.4s ease;
}

.placeholder.red    { background: radial-gradient(circle at 40% 40%, rgba(var(--primary-rgb),0.35), rgba(var(--primary-rgb),0.08) 70%); }
.placeholder.yellow { background: radial-gradient(circle at 40% 40%, rgba(var(--tertiary-rgb),0.35), rgba(var(--tertiary-rgb),0.08) 70%); }
.placeholder.cyan   { background: radial-gradient(circle at 40% 40%, rgba(var(--secondary-rgb),0.35), rgba(var(--secondary-rgb),0.08) 70%); }

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 18px;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.overlay p {
  color: rgba(255,255,255,0.85);
  font-size: 0.82rem;
}

/* Lightbox */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0,0,0,0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}
.close:hover { background: rgba(255,255,255,0.2); }

.lightboxInner {
  max-width: 900px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.lightboxImg {
  width: 100%;
  max-height: 80vh;
  object-fit: contain;
  border-radius: var(--radius-md);
}

.lightboxPlaceholder {
  width: 100%;
  height: 60vh;
  border-radius: var(--radius-md);
}

.lightboxCaption {
  color: rgba(255,255,255,0.55);
  font-size: 0.88rem;
}

@media (max-width: 768px) {
  .masonry { columns: 2 160px; }
}

@media (max-width: 480px) {
  .masonry { columns: 1; }
}
```

- [ ] **Verify full site builds cleanly**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1
```

Expected: `Route (app)` table shows `/`, `/menu`, `/events`, `/about`, `/gallery` — no errors.

- [ ] **Start dev server and verify all 5 pages**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run dev
```

Check each route:
- `http://localhost:3000` — Home: hero, marquee, signature, steps, day/night, reviews, hours, events preview, CTA
- `http://localhost:3000/menu` — category filter works, featured cards, list grid
- `http://localhost:3000/events` — featured event, weekly calendar, vibe section, notify strip
- `http://localhost:3000/about` — story, values, visit panel
- `http://localhost:3000/gallery` — masonry grid, filter, lightbox opens on click
- ES/EN toggle in Navbar switches all text across pages
- Scroll animations trigger as you scroll

- [ ] **Commit**

```bash
git add src/app/gallery/
git commit -m "feat: add Gallery page with masonry grid, filter tabs and lightbox"
```

---

## Phase 3 — Cleanup

### Task 14: Remove leftover placeholder files

**Files:**
- Modify: `src/app/page.module.css` — already replaced in Task 9
- Delete stale CSS: remove old `.signatureImage` class references if any remain

- [ ] **Check for any leftover stale imports**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && grep -r "page.module.css\|menu.module.css\|events.module.css" src/ --include="*.tsx" 2>/dev/null
```

Confirm each CSS module is imported exactly once in its corresponding page file.

- [ ] **Run final production build**

```bash
cd "/Users/mrperex/Projects/DPAVO PIZZA WEBSITE" && npm run build 2>&1
```

Expected: clean build, no TypeScript errors, no missing module warnings.

- [ ] **Set real WhatsApp number in `src/content/config.ts`**

Replace `18095550000` on line 2 with the actual D'Pavo WhatsApp number.

- [ ] **Final commit**

```bash
git add -A
git commit -m "chore: final cleanup, set WhatsApp number, production-ready build"
```

---

## Self-Review Notes

- All 5 pages covered ✓
- Language toggle: `useLanguage()` called in every page ✓
- `useInView` applied to every major section ✓
- WhatsApp number is a single constant in `config.ts` ✓
- `'use client'` only on pages with hooks/state ✓
- Footer accepts translated strings as props (server-component-safe pattern) ✓
- Gallery lightbox uses pure `useState` + CSS ✓
- `SHOW_TEAM_SECTION = false` flag controls team section ✓
- `next/image` not used — images use `<img>` for simplicity; swap to `next/image` later if needed ✓
- No new dependencies added ✓
