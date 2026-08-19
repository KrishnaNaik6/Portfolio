import type { Metadata, Viewport } from 'next';
import { Inter, Sora, Fira_Code } from 'next/font/google';
import './globals.css';
import { generatePersonJSONLD, generateWebSiteJSONLD } from '@/lib/seo';
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
    default: 'Krishna Naik | Krishna Umesh Naik - Full Stack Developer & AI/ML Engineer Portfolio',
    template: '%s | Krishna Naik (Krishna Umesh Naik)',
  },
  description:
    'Official portfolio of Krishna Naik (Krishna Umesh Naik) — Full Stack Developer, Software Developer & AI/ML Engineer. Explore AI projects, React, Next.js, TypeScript, Python, and open-source intelligence.',
  keywords: [
    'Krishna',
    'krishna',
    'KRISHNA',
    'Krishna Naik',
    'krishna naik',
    'KRISHNA NAIK',
    'Krishna Umesh Naik',
    'krishna umesh naik',
    'KRISHNA UMESH NAIK',
    'Krishna Naik portfolio',
    'Krishna Umesh Naik portfolio',
    'Krishna Naik developer',
    'Krishna Naik software developer',
    'Krishna Naik full stack developer',
    'Krishna Naik AI engineer',
    'Krishna Naik AI ML developer',
    'Krishna Naik web developer',
    'Krishna Naik React developer',
    'Krishna Naik Next.js developer',
    'Krishna Naik TypeScript developer',
    'Krishna Naik Python developer',
    'Krishna Naik AI projects',
    'Krishna Naik developer portfolio',
    'Krishna Naik Bengaluru',
    'Krishna Naik Ramaiah Institute of Technology',
    'KrishnaNaik6',
  ],
  authors: [
    { name: 'Krishna Naik', url: 'https://krishna-naik.vercel.app' },
    { name: 'Krishna Umesh Naik', url: 'https://krishna-naik.vercel.app' },
  ],
  creator: 'Krishna Naik',
  publisher: 'Krishna Naik',
  icons: {
    icon: '/k.svg',
    shortcut: '/k.svg',
  },
  alternates: {
    canonical: 'https://krishna-naik.vercel.app',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://krishna-naik.vercel.app',
    title: 'Krishna Naik | Krishna Umesh Naik - Portfolio',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik) — Full Stack Developer, Software Developer & AI/ML Engineer.',
    siteName: 'Krishna Naik Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishna Naik | Krishna Umesh Naik - Portfolio',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik) — Full Stack Developer, Software Developer & AI/ML Engineer.',
    creator: '@KrishnaNaik',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJSONLD = generatePersonJSONLD();
  const websiteJSONLD = generateWebSiteJSONLD();

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${sora.variable} ${firaCode.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJSONLD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJSONLD) }}
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
