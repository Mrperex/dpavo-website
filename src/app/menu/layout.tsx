import type { Metadata } from 'next';
import { MENU_ITEMS } from '@/content/menu';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: "Menú | Pizzas, Mariscos y Más",
  description:
    'Explora el menú completo de D\'Pavo Pizza: pizzas artesanales, mariscos frescos, alitas, tostones y bebidas. Ordena por WhatsApp desde Verón, Punta Cana.',
  openGraph: {
    title: "Menú de D'Pavo Pizza — Pizzas & Mariscos en Punta Cana",
    description: 'Pizzas artesanales, mariscos, alitas y más. Ordena por WhatsApp.',
    url: `${SITE_URL}/menu`,
    images: [{ url: '/media/menu-hero-background.webp', width: 1200, height: 630, alt: "Menú D'Pavo Pizza" }],
  },
  alternates: { canonical: `${SITE_URL}/menu` },
};

const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  name: "D'Pavo Pizza — Menú",
  url: `${SITE_URL}/menu`,
  hasMenuSection: [
    {
      '@type': 'MenuSection',
      name: 'Full Menu',
      hasMenuItem: MENU_ITEMS.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description,
        offers: { '@type': 'Offer', price: item.price.replace('RD$', ''), priceCurrency: 'DOP' },
      })),
    },
  ],
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }} />
      {children}
    </>
  );
}
