import type { Metadata, Viewport } from 'next';
import { Inter, Sora, Fira_Code } from 'next/font/google';
import './globals.css';
import { generateStructuredDataGraph, seoKeywords } from '@/lib/seo';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B0C10' },
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://krishna-naik.vercel.app'),
  title: {
    default: 'Krishna Naik | Krishna — Full Stack Developer & AI/ML Engineer Portfolio',
    template: '%s | Krishna Naik (Krishna Umesh Naik)',
  },
  description:
    'Official portfolio of Krishna Naik (Krishna Umesh Naik, Krishna) — Full Stack Developer, Software Engineer & AI/ML Specialist based in Bengaluru. Explore Krishna Naik projects, skills, education, and GitHub intelligence.',
  keywords: seoKeywords,
  authors: [
    { name: 'Krishna Naik', url: 'https://krishna-naik.vercel.app' },
    { name: 'Krishna', url: 'https://krishna-naik.vercel.app' },
    { name: 'Krishna Umesh Naik', url: 'https://krishna-naik.vercel.app' },
    { name: 'KrishnaNaik6', url: 'https://github.com/KrishnaNaik6' },
  ],
  creator: 'Krishna Naik (Krishna Umesh Naik)',
  publisher: 'Krishna Naik',
  applicationName: 'Krishna Naik',
  category: 'technology',
  classification: 'Software Engineering & AI Portfolio',
  icons: {
    icon: [
      { url: '/k.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/k.svg',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://krishna-naik.vercel.app',
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://krishna-naik.vercel.app',
    title: 'Krishna Naik | Krishna — Full Stack Developer & AI/ML Engineer Portfolio',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik, Krishna) — Full Stack Developer & AI/ML Engineer based in Bengaluru, India.',
    siteName: 'Krishna Naik',
    images: [
      {
        url: 'https://krishna-naik.vercel.app/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: 'Krishna Naik Portfolio Logo',
      },
      {
        url: 'https://krishna-naik.vercel.app/k.svg',
        width: 512,
        height: 512,
        alt: 'Krishna Naik Portfolio Logo SVG',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishna Naik | Krishna — Full Stack Developer & AI/ML Engineer Portfolio',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik, Krishna) — Full Stack Developer & AI/ML Engineer.',
    creator: '@KrishnaNaik',
    site: '@KrishnaNaik',
    images: ['https://krishna-naik.vercel.app/android-chrome-512x512.png'],
  },
  verification: {
    google: 'google0ecd0af95524d939',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'profile:first_name': 'Krishna',
    'profile:last_name': 'Naik',
    'profile:username': 'KrishnaNaik6',
    author: 'Krishna Naik, Krishna, Krishna Umesh Naik',
    subject: 'Krishna Naik (Krishna) Portfolio - Full Stack Web Development and Artificial Intelligence',
    owner: 'Krishna Naik',
    designer: 'Krishna Naik',
    copyright: 'Krishna Naik',
    'revisit-after': '3 days',
    coverage: 'Worldwide',
    distribution: 'Global',
    rating: 'General',
    'apple-mobile-web-app-title': 'Krishna Naik',
    'application-name': 'Krishna Naik',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = generateStructuredDataGraph();

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${firaCode.variable}`}>
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="bg-bg-main text-text-primary antialiased selection:bg-neon-cyan/20 selection:text-neon-cyan relative min-h-screen">
        <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
          {/* Ambient Glowing Mesh Background */}
          <div className="bg-ambient-mesh" aria-hidden="true">
            <div className="ambient-blob-1" />
            <div className="ambient-blob-2" />
            <div className="ambient-blob-3" />
          </div>

          {/* Content Body */}
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
