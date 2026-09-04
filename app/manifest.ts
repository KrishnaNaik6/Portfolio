import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Krishna Naik | Krishna Umesh Naik — Full Stack Developer & AI/ML Portfolio',
    short_name: 'Krishna Naik',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik, Krishna) — Full-Stack Web Developer, Software Engineer & AI/ML Specialist.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0C10',
    theme_color: '#0B0C10',
    icons: [
      {
        src: '/k.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
