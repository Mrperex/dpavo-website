import type { Metadata } from 'next';
import { Antonio, Schibsted_Grotesk, Dancing_Script, Anton } from 'next/font/google';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { WAFab } from '@/components/ui/WAFab/WAFab';
import { Cursor } from '@/components/ui/Cursor/Cursor';
import { PageTransition } from '@/components/layout/PageTransition/PageTransition';
import { ScrollProgress } from '@/components/ui/ScrollProgress/ScrollProgress';
import { CookieConsent } from '@/components/ui/CookieConsent/CookieConsent';
import { Providers } from './providers';
import { CartProvider } from '@/context/CartContext';
import { restaurantJsonLd, menuJsonLd } from '@/lib/schema';
import { WebVitals } from '@/components/analytics/WebVitals';
import { PWAInstallPrompt } from '@/components/ui/PWAInstallPrompt/PWAInstallPrompt';
import './globals.css';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? 'G-R8WQJE9BKW';

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
        url: '/media/og-image.jpg',
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
    images: ['/media/og-image.jpg'],
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: "D'Pavo Pizza",
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#BD1F17',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href="/media/red-hero-background.webp" />
        <Script
          id="ld-restaurant"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(restaurantJsonLd)}
        </Script>
        <Script
          id="ld-menu"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify(menuJsonLd)}
        </Script>
      </head>
      <body className={`${antonio.variable} ${schibsted.variable} ${dancing.variable} ${anton.variable}`}>
        <a href="#main-content" className="skip-link">Saltar al contenido</a>
        <CartProvider><Providers>{children}</Providers></CartProvider>
        <PageTransition />
        <WAFab />
        <Cursor />
        <ScrollProgress />
        <CookieConsent />
        <PWAInstallPrompt />
        <WebVitals />
        <Analytics />
        <SpeedInsights />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            functionality_storage: 'granted',
            personalization_storage: 'denied',
            security_storage: 'granted',
            wait_for_update: 500,
          });
          try {
            var raw = localStorage.getItem('dpavo-cookie-consent-v2');
            if (raw) {
              var prefs = JSON.parse(raw);
              gtag('consent', 'update', {
                analytics_storage: prefs.analytics ? 'granted' : 'denied',
                ad_storage: prefs.marketing ? 'granted' : 'denied',
                ad_user_data: prefs.marketing ? 'granted' : 'denied',
                ad_personalization: prefs.marketing ? 'granted' : 'denied',
                personalization_storage: prefs.preferences ? 'granted' : 'denied',
              });
            } else if (localStorage.getItem('dpavo-cookie-consent') === 'accepted') {
              gtag('consent', 'update', { analytics_storage: 'granted' });
            }
          } catch(e) {}
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}</Script>
      </body>
    </html>
  );
}
