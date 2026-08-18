export const defaultSEO = {
  title: 'Krishna Naik | Full-Stack & AI/ML Developer Portfolio',
  description:
    'Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. Building full-stack web applications, intelligent systems, and interactive tools.',
  url: 'https://krishanaik.dev', // Default placeholder URL
  siteName: 'Krishna Naik Portfolio',
  author: 'Krishna Naik',
  twitterHandle: '@KrishnaNaik',
};

export function generatePersonJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Krishna Naik',
    jobTitle: 'Full-Stack Developer & AI/ML Engineer',
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Ramaiah Institute of Technology',
    },
    knowsAbout: [
      'Full Stack Development',
      'Artificial Intelligence',
      'Machine Learning',
      'React',
      'Next.js',
      'TypeScript',
      'Python',
      'DevOps',
    ],
    sameAs: [
      'https://github.com/KrishnaNaik6',
      'https://www.linkedin.com/in/krishna-naik-b94723277',
      'https://www.instagram.com/krishna_naik_6/',
    ],
  };
}

export function generateWebSiteJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Krishna Naik Portfolio',
    url: 'https://krishanaik.dev',
    author: {
      '@type': 'Person',
      name: 'Krishna Naik',
    },
  };
}
