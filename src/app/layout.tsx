import type { Metadata } from 'next';
import { Antonio, Schibsted_Grotesk, Dancing_Script } from 'next/font/google';
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

export const metadata: Metadata = {
  title: "D'Pavo Pizza | Pizzería Urbana Tropical — Verón, Punta Cana",
  description: 'Pizza, mariscos y vida nocturna en Verón, Punta Cana. Ordena por WhatsApp.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${antonio.variable} ${schibsted.variable} ${dancing.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
