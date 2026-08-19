export const defaultSEO = {
  title: 'Krishna Naik | Krishna Umesh Naik - Full Stack Developer, AI/ML Engineer & Portfolio',
  description:
    'Official developer portfolio of Krishna Naik (Krishna Umesh Naik). Full-Stack Web Developer, Software Engineer & AI/ML Specialist building intelligent applications with Next.js, React, TypeScript, Python, and modern cloud architectures.',
  url: 'https://krishna-naik.vercel.app',
  siteName: 'Krishna Naik Portfolio',
  author: 'Krishna Naik (Krishna Umesh Naik)',
  twitterHandle: '@KrishnaNaik',
};

export function generatePersonJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Krishna Naik',
    givenName: 'Krishna',
    familyName: 'Naik',
    additionalName: 'Umesh',
    alternateName: [
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
      'KrishnaNaik6',
    ],
    url: 'https://krishna-naik.vercel.app',
    image: 'https://krishna-naik.vercel.app/k.svg',
    jobTitle: [
      'Full Stack Developer',
      'Software Developer',
      'AI & ML Engineer',
      'Web Developer',
      'React Developer',
      'Next.js Developer',
      'TypeScript Developer',
      'Python Developer',
    ],
    description:
      'Krishna Naik (Krishna Umesh Naik) is a Full-Stack Developer, AI/ML Engineer, and Software Developer specializing in Next.js, React, Python, TypeScript, and AI applications.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bengaluru',
      addressRegion: 'Karnataka',
      addressCountry: 'India',
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'M S Ramaiah Institute Of Technology',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Govt. Polytechnic Siddapur',
      },
    ],
    knowsAbout: [
      'Full Stack Development',
      'Software Development',
      'Artificial Intelligence',
      'Machine Learning',
      'AI Projects',
      'React',
      'Next.js',
      'TypeScript',
      'JavaScript',
      'Python',
      'MERN Stack',
      'Node.js',
      'Express.js',
      'MongoDB',
      'SQL',
      'Git & GitHub',
      'Cloud & Scalable Systems',
    ],
    sameAs: [
      'https://github.com/KrishnaNaik6',
      'https://www.linkedin.com/in/krishnaunaik/',
      'https://www.instagram.com/krishna_nk08/',
      'https://krishna-naik.vercel.app',
    ],
  };
}

export function generateWebSiteJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Krishna Naik Portfolio',
    alternateName: [
      'Krishna Naik (Krishna Umesh Naik) Developer Portfolio',
      'Krishna Umesh Naik Portfolio',
      'Krishna Naik Official Website',
    ],
    url: 'https://krishna-naik.vercel.app',
    description:
      'Official portfolio of Krishna Naik (Krishna Umesh Naik) — Full Stack Developer, Software Developer & AI/ML Engineer.',
    author: {
      '@type': 'Person',
      name: 'Krishna Naik',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://krishna-naik.vercel.app/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };
}


