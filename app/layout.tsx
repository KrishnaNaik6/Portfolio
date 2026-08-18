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
    default: 'Krishna Naik | Krishna Umesh Naik - Creative Developer & AI Engineer',
    template: '%s | Krishna Naik (Krishna Umesh Naik)',
  },
  description:
    'Official portfolio of Krishna Naik (Krishna Umesh Naik), Full-Stack Developer & AI/ML Engineer based in Bengaluru, India. Computer Science student specializing in AI systems, React, Next.js, and Python.',
  keywords: [
    'Krishna Naik',
    'Krishna Umesh Naik',
    'Krishna Naik Portfolio',
    'Krishna Umesh Naik Portfolio',
    'Krishna Naik Developer',
    'Krishna Naik Bengaluru',
    'Krishna Naik AI Engineer',
    'Krishna Naik Vercel',
    'Full Stack Developer',
    'AI Engineer',
    'Ramaiah Institute of Technology',
    'KrishnaNaik6',
  ],
  authors: [
    { name: 'Krishna Naik', url: 'https://krishna-naik.vercel.app' },
    { name: 'Krishna Umesh Naik' },
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
    title: 'Krishna Naik (Krishna Umesh Naik) | Portfolio',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik). Creative Full-Stack Developer & AI/ML Engineer.',
    siteName: 'Krishna Naik Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishna Naik (Krishna Umesh Naik) | Portfolio',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik). Creative Full-Stack Developer & AI/ML Engineer.',
    creator: '@KrishnaNaik',
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
