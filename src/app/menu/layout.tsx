import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: "Menú | Pizzas, Mariscos y Más",
  description:
    'Explora el menú completo de D\'Pavo Pizza: pizzas artesanales, mariscos frescos, alitas, tostones y bebidas. Ordena por WhatsApp desde Verón, Punta Cana.',
  openGraph: {
    title: "Menú de D'Pavo Pizza — Pizzas & Mariscos en Punta Cana",
    description: 'Pizzas artesanales, mariscos, alitas y más. Ordena por WhatsApp.',
    url: `${SITE_URL}/menu`,
    images: [{ url: '/media/menu-hero-background.jpg', width: 1200, height: 630, alt: "Menú D'Pavo Pizza" }],
  },
  alternates: { canonical: `${SITE_URL}/menu` },
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
