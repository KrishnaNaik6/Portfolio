import type { Metadata, Viewport } from 'next';
import { Inter, Sora, Fira_Code } from 'next/font/google';
import './globals.css';
import { generatePersonJSONLD, generateWebSiteJSONLD } from '@/lib/seo';

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
    { media: '(prefers-color-scheme: dark)', color: '#121217' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Krishna Naik | Full-Stack & AI/ML Developer Portfolio',
  description:
    'Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. Building full-stack web applications, intelligent systems, and interactive tools.',
  keywords: [
    'Krishna Naik',
    'Portfolio',
    'Full Stack Developer',
    'AI Engineer',
    'Machine Learning',
    'Ramaiah Institute of Technology',
    'React',
    'Next.js',
    'TypeScript',
    'Python',
    'Bengaluru Developer',
  ],
  authors: [{ name: 'Krishna Naik', url: 'https://github.com/KrishnaNaik6' }],
  creator: 'Krishna Naik',
  icons: {
    icon: '/k.svg',
    shortcut: '/k.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Krishna Naik | Full-Stack & AI/ML Developer Portfolio',
    description:
      'Computer Science student specializing in AI & ML. Interactive portfolio showcasing projects, GitHub stats, experience, and skills.',
    siteName: 'Krishna Naik Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Krishna Naik | Full-Stack & AI/ML Developer Portfolio',
    description:
      'Computer Science student specializing in AI & ML. Interactive portfolio showcasing projects, GitHub stats, experience, and skills.',
    creator: '@KrishnaNaik',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personJSONLD = generatePersonJSONLD();
  const websiteJSONLD = generateWebSiteJSONLD();

  return (
    <html lang="en" data-theme="dark" className={`${inter.variable} ${sora.variable} ${firaCode.variable}`}>
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
      <body className="bg-bg-main text-text-primary antialiased selection:bg-neon-cyan/20 selection:text-neon-cyan">
        {children}
      </body>
    </html>
  );
}
