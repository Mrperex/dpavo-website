import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: 'Nuestra Historia | Quiénes Somos',
  description:
    "Conoce la historia detrás de D'Pavo Pizza — una pizzería urbana tropical nacida en Verón, Punta Cana con pasión por la pizza artesanal y la buena vibra.",
  openGraph: {
    title: "Sobre D'Pavo Pizza — Nuestra Historia en Punta Cana",
    description: 'Pizza artesanal con alma caribeña. Conoce el equipo y los valores de D\'Pavo.',
    url: `${SITE_URL}/about`,
    images: [{ url: '/media/dpavo-food-1.jpg', width: 1200, height: 630, alt: "D'Pavo Pizza — Nuestra Historia" }],
  },
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
