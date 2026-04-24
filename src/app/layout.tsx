import type { Metadata } from 'next';
import { Antonio, Schibsted_Grotesk, Dancing_Script, Anton } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Providers } from './providers';
import './globals.css';

const antonio = Antonio({
  variable: '--font-antonio',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

const schibsted = Schibsted_Grotesk({
  variable: '--font-schibsted',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const dancing = Dancing_Script({
  variable: '--font-dancing',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const anton = Anton({
  variable: '--font-anton',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "D'Pavo Pizza | Pizzería Urbana Tropical — Verón, Punta Cana",
    template: "%s | D'Pavo Pizza",
  },
  description:
    'Pizza artesanal, mariscos frescos y vida nocturna en Verón, Punta Cana. Ordena por WhatsApp y recógela o pide delivery.',
  keywords: ['pizza punta cana', 'pizzería verón', 'mariscos punta cana', 'dpavo pizza', 'restaurante verón'],
  authors: [{ name: "D'Pavo Pizza" }],
  creator: "D'Pavo Pizza",
  openGraph: {
    type: 'website',
    locale: 'es_DO',
    alternateLocale: 'en_US',
    url: SITE_URL,
    siteName: "D'Pavo Pizza",
    title: "D'Pavo Pizza | Pizzería Urbana Tropical — Verón, Punta Cana",
    description:
      'Pizza artesanal, mariscos frescos y vida nocturna en Verón, Punta Cana. Ordena por WhatsApp.',
    images: [
      {
        url: '/media/red-hero-background.jpg',
        width: 1200,
        height: 630,
        alt: "D'Pavo Pizza — Pizzería Urbana Tropical Verón Punta Cana",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "D'Pavo Pizza | Pizzería Urbana Tropical",
    description: 'Pizza artesanal, mariscos frescos y vida nocturna en Verón, Punta Cana.',
    images: ['/media/red-hero-background.jpg'],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'es-DO': SITE_URL,
      'en-US': `${SITE_URL}?lang=en`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  verification: {
    google: 'qWdXRzi12vtr10rDDrUtdwxBgzfleEDlNWhVGsl59Jw',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FoodEstablishment',
  name: "D'Pavo Pizza",
  description: 'Pizzería artesanal urbana tropical en Verón, Punta Cana.',
  url: SITE_URL,
  telephone: '+18096090000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plaza Verón Center',
    addressLocality: 'Verón',
    addressRegion: 'La Altagracia',
    addressCountry: 'DO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 18.7073,
    longitude: -68.4538,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'], opens: '11:00', closes: '00:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '11:00', closes: '02:00' },
  ],
  servesCuisine: ['Pizza', 'Seafood', 'Dominican'],
  priceRange: '$$',
  image: `${SITE_URL}/media/red-hero-background.jpg`,
  sameAs: ['https://www.instagram.com/dpavo_pizzeria_y_restaurante'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/media/red-hero-background.jpg" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${antonio.variable} ${schibsted.variable} ${dancing.variable} ${anton.variable}`}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
