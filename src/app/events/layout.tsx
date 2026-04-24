import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: 'Eventos & Vida Nocturna',
  description:
    "Descubre los eventos semanales de D'Pavo Pizza en Verón, Punta Cana — noches de DJ, eventos especiales y la mejor vibra tropical. Reserva tu lugar por WhatsApp.",
  openGraph: {
    title: "Eventos en D'Pavo Pizza — Vida Nocturna Punta Cana",
    description: 'DJ nights, eventos especiales y la mejor vibra en Verón, Punta Cana.',
    url: `${SITE_URL}/events`,
    images: [{ url: '/media/dj-events.jpg', width: 1200, height: 630, alt: "Eventos D'Pavo Pizza" }],
  },
  alternates: { canonical: `${SITE_URL}/events` },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
