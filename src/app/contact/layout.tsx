import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: 'Contacto | Ubicación y Horarios',
  description:
    "Visita D'Pavo Pizza en Plaza Verón Center, Verón, Punta Cana. Horarios de apertura, teléfono y cómo llegar. Ordena por WhatsApp.",
  openGraph: {
    title: "Contacto D'Pavo Pizza — Ubicación en Verón, Punta Cana",
    description: 'Encuéntranos en Plaza Verón Center. Abiertos todos los días desde las 11 AM.',
    url: `${SITE_URL}/contact`,
    images: [{ url: '/media/pizza-venue.webp', width: 1200, height: 630, alt: "D'Pavo Pizza — Verón, Punta Cana" }],
  },
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
