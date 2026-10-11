import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Cap Collective — Live Impact Dashboard',
    template: '%s | Cap Collective',
  },
  description: 'Real-time dashboard for Cap Collective school circular economy program. Track bottle cap collection, product manufacturing, student engagement, and environmental impact.',
  keywords: ['circular economy', 'plastic recycling', 'bottle caps', 'STEM education', 'sustainability', 'student-led', 'HDPE', 'maker education'],
  authors: [{ name: 'Cap Collective' }],
  creator: 'Cap Collective',
  publisher: 'Cap Collective',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://capcollective.vercel.app',
    siteName: 'Cap Collective',
    title: 'Cap Collective — Live Impact Dashboard',
    description: 'Real-time dashboard for Cap Collective school circular economy program.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cap Collective Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cap Collective — Live Impact Dashboard',
    description: 'Real-time dashboard for Cap Collective school circular economy program.',
    images: ['/og-image.png'],
    creator: '@capcollective',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-cap-600 text-white rounded-lg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="pt-16 min-h-screen" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}