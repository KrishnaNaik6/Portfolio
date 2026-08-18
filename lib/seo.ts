export const defaultSEO = {
  title: 'Krishna Naik (Krishna Umesh Naik) | Creative Developer & AI Engineer Portfolio',
  description:
    'Official portfolio of Krishna Naik (Krishna Umesh Naik), Full-Stack Developer & AI/ML Engineer based in Bengaluru. Computer Science student specializing in AI systems, React, Next.js, and Python.',
  url: 'https://krishna-naik.vercel.app',
  siteName: 'Krishna Naik Portfolio',
  author: 'Krishna Naik',
  twitterHandle: '@KrishnaNaik',
};

export function generatePersonJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Krishna Naik',
    alternateName: ['Krishna Umesh Naik', 'Krishna Naik Portfolio', 'Krishna Umesh Naik Portfolio', 'Krishna Naik Bengaluru'],
    url: 'https://krishna-naik.vercel.app',
    jobTitle: 'Full-Stack Developer & AI/ML Engineer',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressCountry: 'India',
    },
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
      'https://krishna-naik.vercel.app',
    ],
  };
}

export function generateWebSiteJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Krishna Naik (Krishna Umesh Naik) Portfolio',
    url: 'https://krishna-naik.vercel.app',
    author: {
      '@type': 'Person',
      name: 'Krishna Naik',
    },
  };
}

