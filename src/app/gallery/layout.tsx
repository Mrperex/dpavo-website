import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: 'Galería | Fotos de Comida y Ambiente',
  description:
    "Mira las mejores fotos de D'Pavo Pizza: pizzas artesanales, el ambiente del local, eventos y más. Una pizzería urbana tropical en Verón, Punta Cana.",
  openGraph: {
    title: "Galería D'Pavo Pizza — Fotos de Comida y Ambiente",
    description: 'Las mejores fotos de D\'Pavo Pizza: comida, venue y eventos en Punta Cana.',
    url: `${SITE_URL}/gallery`,
    images: [{ url: '/media/pizza-venue.webp', width: 1200, height: 630, alt: "Galería D'Pavo Pizza" }],
  },
  alternates: { canonical: `${SITE_URL}/gallery` },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
