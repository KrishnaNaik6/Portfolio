import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Krishna Naik | Krishna Umesh Naik Portfolio',
    short_name: 'Krishna Naik',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik). Full-Stack Web Developer, Software Engineer & AI/ML Specialist.',
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
        src: '/k.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      {
        src: '/k.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
