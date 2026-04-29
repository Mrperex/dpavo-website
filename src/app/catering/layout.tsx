import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  title: 'Catering | Servicio para Eventos Privados',
  description:
    "Catering profesional D'Pavo Pizza para bodas, cumpleaños, eventos corporativos y celebraciones privadas en Punta Cana. Menú personalizado, montaje completo y servicio profesional.",
  keywords: ['catering punta cana', 'catering verón', 'catering eventos privados', 'catering bodas punta cana', 'pizza catering'],
  openGraph: {
    title: "Catering D'Pavo Pizza — Eventos Privados en Punta Cana",
    description: 'Servicio de catering profesional. Menú personalizado, montaje completo, staff. Solicita tu cotización por WhatsApp.',
    url: `${SITE_URL}/catering`,
    images: [{ url: '/media/catering-hero.jpg', width: 1200, height: 630, alt: "Catering D'Pavo Pizza" }],
  },
  alternates: { canonical: `${SITE_URL}/catering` },
};

export default function CateringLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
