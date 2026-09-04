export const defaultSEO = {
  title: 'Krishna Naik | Krishna — Full Stack Developer & AI/ML Engineer Portfolio',
  description:
    'Official portfolio of Krishna Naik (Krishna Umesh Naik, Krishna) — Full-Stack Developer, Software Engineer & AI/ML Specialist based in Bengaluru. Explore Krishna Naik projects, skills, education, and GitHub intelligence.',
  url: 'https://krishna-naik.vercel.app',
  siteName: 'Krishna Naik Portfolio',
  author: 'Krishna Naik (Krishna Umesh Naik)',
  twitterHandle: '@KrishnaNaik',
};

export const seoKeywords = [
  // Primary Exact Match Variations
  'Krishna',
  'krishna',
  'KRISHNA',
  'Krishna Naik',
  'krishna naik',
  'KRISHNA NAIK',
  'Krishna Umesh Naik',
  'krishna umesh naik',
  'KRISHNA UMESH NAIK',
  'Krishna U Naik',
  'krishna u naik',
  'KrishnaNaik',
  'krishnanaik',
  'KrishnaNaik6',
  'krishnanaik6',
  'Krishna_Naik',

  // Portfolio & Identity Queries
  'Krishna Naik portfolio',
  'krishna naik portfolio',
  'KRISHNA NAIK PORTFOLIO',
  'Krishna portfolio',
  'krishna portfolio',
  'KRISHNA PORTFOLIO',
  'Krishna Umesh Naik portfolio',
  'krishna umesh naik portfolio',
  'Krishna Naik website',
  'Krishna Naik official website',
  'Krishna Naik official portfolio',
  'Krishna Naik personal website',
  'Krishna Naik developer portfolio',
  'Portfolio of Krishna Naik',
  'Portfolio of Krishna',

  // Roles & Professions
  'Krishna Naik developer',
  'krishna naik developer',
  'Krishna developer',
  'krishna developer',
  'KRISHNA DEVELOPER',
  'Krishna Naik software developer',
  'Krishna software developer',
  'Krishna Naik software engineer',
  'Krishna software engineer',
  'Krishna Naik full stack developer',
  'Krishna full stack developer',
  'Krishna Naik full stack',
  'Krishna full stack',
  'Krishna Naik frontend developer',
  'Krishna Naik backend developer',
  'Krishna Naik AI engineer',
  'Krishna AI engineer',
  'Krishna Naik AI ML developer',
  'Krishna Naik AI ML engineer',
  'Krishna Naik machine learning engineer',
  'Krishna machine learning',
  'Krishna Naik web developer',
  'Krishna web developer',
  'Krishna Naik programmer',
  'Krishna programmer',
  'Krishna Naik coder',

  // Tech Stack & Engineering
  'Krishna Naik Next.js',
  'Krishna Naik Next.js developer',
  'Krishna Naik React',
  'Krishna Naik React developer',
  'Krishna Naik TypeScript',
  'Krishna Naik TypeScript developer',
  'Krishna Naik JavaScript',
  'Krishna Naik Python',
  'Krishna Naik Python developer',
  'Krishna Naik MERN stack',
  'Krishna Naik Three.js',
  'Krishna Naik AI projects',
  'Krishna Naik ML projects',
  'Krishna Naik intelligent systems',
  'Krishna Naik computer science',

  // Social & Community
  'Krishna Naik GitHub',
  'Krishna GitHub',
  'Krishna Naik LinkedIn',
  'Krishna LinkedIn',
  'Krishna Naik Instagram',
  'Krishna Naik open source',
  'Krishna Naik NEXIS',
  'Krishna Naik projects',

  // Location & Education
  'Krishna Naik Bengaluru',
  'Krishna Bengaluru',
  'Krishna Naik Bangalore',
  'Krishna Bangalore',
  'Krishna Naik Karnataka',
  'Krishna Naik India',
  'Krishna Naik Ramaiah Institute of Technology',
  'Krishna Naik Ramaiah',
  'Krishna Naik RIT',
  'Krishna Naik MSRIT',
  'Full Stack Developer Bengaluru',
  'AI ML Engineer Bengaluru',
  'Software Engineer Bengaluru',
  'Next.js Developer India',
  'React Developer Bengaluru',
];

export function generatePersonJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': 'https://krishna-naik.vercel.app/#person',
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
      'Krishna U Naik',
      'KrishnaNaik',
      'krishnanaik',
      'KrishnaNaik6',
      'krishnanaik6',
      'Krishna Naik Portfolio',
      'Krishna Portfolio',
      'Krishna Naik Developer',
      'Krishna Developer',
      'Krishna Naik Full Stack Developer',
      'Krishna Naik AI Engineer',
      'Krishna Naik Software Engineer',
      'Krishna Naik Web Developer',
    ],
    url: 'https://krishna-naik.vercel.app',
    image: 'https://krishna-naik.vercel.app/k.svg',
    jobTitle: [
      'Full Stack Developer',
      'Software Developer',
      'AI & ML Engineer',
      'Software Engineer',
      'Web Developer',
      'React Developer',
      'Next.js Developer',
      'TypeScript Developer',
      'Python Developer',
    ],
    description:
      'Krishna Naik (Krishna Umesh Naik, Krishna) is a Full-Stack Developer, AI/ML Engineer, and Software Developer based in Bengaluru, Karnataka, India specializing in Next.js, React, Python, TypeScript, and AI applications.',
    gender: 'Male',
    nationality: {
      '@type': 'Country',
      name: 'India',
    },
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
        alternateName: ['Ramaiah Institute of Technology', 'MSRIT', 'RIT Bengaluru'],
        url: 'https://www.msrit.edu/',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Govt. Polytechnic Siddapur',
        alternateName: ['GPT Siddapur'],
      },
    ],
    knowsAbout: [
      'Krishna Naik',
      'Full Stack Development',
      'Software Engineering',
      'Artificial Intelligence',
      'Machine Learning',
      'Deep Learning',
      'AI Projects',
      'React',
      'React 19',
      'Next.js',
      'Next.js 15',
      'TypeScript',
      'JavaScript',
      'Python',
      'MERN Stack',
      'Node.js',
      'Express.js',
      'MongoDB',
      'PostgreSQL',
      'SQL',
      'Three.js',
      'Tailwind CSS',
      'Git & GitHub',
      'Cloud & Scalable Systems',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Full-Stack Developer & AI/ML Engineer',
      occupationLocation: {
        '@type': 'City',
        name: 'Bengaluru',
      },
      skills: 'Full Stack Web Development, AI/ML Engineering, Next.js, React, Python, TypeScript',
    },
    sameAs: [
      'https://github.com/KrishnaNaik6',
      'https://www.linkedin.com/in/krishnaunaik/',
      'https://www.instagram.com/krishna_nk08/',
      'https://krishna-naik.vercel.app',
    ],
    mainEntityOfPage: 'https://krishna-naik.vercel.app',
  };
}

export function generateWebSiteJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://krishna-naik.vercel.app/#website',
    name: 'Krishna Naik Portfolio',
    alternateName: [
      'Krishna Naik (Krishna Umesh Naik) Developer Portfolio',
      'Krishna Portfolio',
      'Krishna Naik Official Website',
      'Portfolio of Krishna Naik',
      'Krishna Naik Website',
      'Krishna Naik',
    ],
    url: 'https://krishna-naik.vercel.app',
    description:
      'Official portfolio website of Krishna Naik (Krishna Umesh Naik, Krishna) — Full Stack Developer, Software Developer & AI/ML Engineer.',
    publisher: {
      '@id': 'https://krishna-naik.vercel.app/#person',
    },
    author: {
      '@id': 'https://krishna-naik.vercel.app/#person',
    },
    inLanguage: 'en-US',
    keywords: seoKeywords.join(', '),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://krishna-naik.vercel.app/?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateProfilePageJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': 'https://krishna-naik.vercel.app/#profilepage',
    url: 'https://krishna-naik.vercel.app',
    name: 'Krishna Naik (Krishna) — Full Stack Developer & AI/ML Engineer Profile',
    isPartOf: {
      '@id': 'https://krishna-naik.vercel.app/#website',
    },
    mainEntity: {
      '@id': 'https://krishna-naik.vercel.app/#person',
    },
    description:
      'Official developer profile and portfolio of Krishna Naik (Krishna Umesh Naik, Krishna) featuring intelligent systems, full-stack web applications, and open-source intelligence.',
    breadcrumb: {
      '@id': 'https://krishna-naik.vercel.app/#breadcrumb',
    },
  };
}

export function generateBreadcrumbJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': 'https://krishna-naik.vercel.app/#breadcrumb',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://krishna-naik.vercel.app',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Krishna Naik Portfolio',
        item: 'https://krishna-naik.vercel.app',
      },
    ],
  };
}

export function generateStructuredDataGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      generatePersonJSONLD(),
      generateWebSiteJSONLD(),
      generateProfilePageJSONLD(),
      generateBreadcrumbJSONLD(),
    ],
  };
}
