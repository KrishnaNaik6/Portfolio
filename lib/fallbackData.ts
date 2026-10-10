import { PortfolioDetails, ProjectItem, SectionConfig } from './types';

export const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: 'hero', label: 'Hero', order: 1, enabled: true },
  { id: 'about', label: 'About Me', order: 2, enabled: true },
  { id: 'education', label: 'Academic Background', order: 3, enabled: true },
  { id: 'experience', label: 'Work Experience', order: 4, enabled: true },
  { id: 'projects', label: 'Featured Projects', order: 5, enabled: true },
  { id: 'skills', label: 'Technical Constellation', order: 6, enabled: true },
  { id: 'interests', label: 'Interests', order: 7, enabled: true },
  { id: 'github', label: 'GitHub Intelligence', order: 8, enabled: true },
  { id: 'contact', label: 'Get In Touch', order: 9, enabled: true },
  { id: 'footer', label: 'Footer', order: 10, enabled: true },
];

export const FALLBACK_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-1',
    name: 'NEXIS OS',
    description:
      'Intelligent Platform & Career Control Plane orchestrating dynamic portfolios, CMS catalogs, and cloud telemetry.',
    link: {
      git: 'https://github.com/KrishnaNaik6/NEXIS',
      live: 'https://nexis.dev',
    },
    collabed: false,
    type: 'Full Stack',
    featured: true,
    displayOrder: 1,
    highlightLabel: 'FLAGSHIP',
  },
  {
    id: 'proj-2',
    name: 'Portfolio 3D Platform',
    description:
      'Interactive personal web platform with 3D WebGL scenes, real-time GitHub telemetry, and published resume integration.',
    link: {
      git: 'https://github.com/KrishnaNaik6/Portfolio',
      live: 'https://krishna-naik.vercel.app',
    },
    collabed: false,
    type: 'Frontend & 3D',
    featured: true,
    displayOrder: 2,
    highlightLabel: 'FEATURED',
  },
  {
    id: 'proj-3',
    name: 'Sprentzo WebApp',
    description:
      'High-concurrency collaborative sports reservation and venue management web application.',
    link: {
      git: 'https://github.com/Canara-Tech-Labs/sprentzo-webapp',
      live: null,
    },
    collabed: true,
    type: 'Collaborative',
    featured: false,
    displayOrder: 3,
  },
  {
    id: 'proj-4',
    name: 'Distributed AI Agent Engine',
    description:
      'Autonomous multi-agent orchestration framework for high-throughput semantic analysis and reasoning.',
    link: {
      git: 'https://github.com/KrishnaNaik6',
      live: null,
    },
    collabed: false,
    type: 'AI & ML',
    featured: false,
    displayOrder: 4,
  },
];

export const FALLBACK_PORTFOLIO_DETAILS: PortfolioDetails = {
  profile: {
    fullName: 'Krishna Umesh Naik',
    headline: 'Full-Stack Developer & AI/ML Engineer',
    bio: 'Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. Crafting intelligent systems, full-stack web applications, and immersive digital experiences.',
    location: 'Bengaluru, India',
    email: 'kn670423@gmail.com',
    phone: '+91 9999999999',
    resumeUrl: '/resume',
    websiteUrl: 'https://krishna-naik.vercel.app',
    welcomeGreeting: 'Hey there! Welcome to my digital workspace',
    typewriterTexts: [
      'Full-Stack Developer',
      'AI/ML Engineer',
      'Systems Architect',
      'Creative Technologist',
    ],
    pillars: [
      {
        title: 'Full-Stack Architecture',
        subtitle: 'Scalable & Interactive',
        description:
          'Architecting resilient, production-ready web applications with modern Next.js 15, TypeScript, and microservices.',
        icon: 'layers',
        highlights: ['Next.js 15 & React 19', 'NestJS Microservices', 'Tailwind & Three.js 3D'],
      },
      {
        title: 'Artificial Intelligence',
        subtitle: 'Intelligent & Autonomous',
        description:
          'Designing deep learning models, autonomous agent frameworks, and high-performance inference pipelines.',
        icon: 'brain',
        highlights: ['PyTorch & TensorFlow', 'Autonomous Agents & LLMs', 'Computer Vision & NLP'],
      },
      {
        title: 'Distributed Systems & Cloud',
        subtitle: 'High-Throughput & Resilient',
        description:
          'Deploying distributed containers, PostgreSQL/Redis databases, and automated CI/CD infrastructure.',
        icon: 'server',
        highlights: ['Docker & Cloud Architecture', 'PostgreSQL & Redis', 'CI/CD Pipelines'],
      },
    ],
  },
  education: [
    {
      id: 'edu-1',
      edu: 'Bachelor of Engineering in Computer Science (AI & ML)',
      college: 'Ramaiah Institute of Technology',
      status: 'Pursuing',
      year: '2023 - 2027',
      grade: '9.4 CGPA',
    },
  ],
  experience: [
    {
      id: 'exp-1',
      role: 'Full Stack & AI Engineer Intern',
      company: 'Tech Innovations',
      tenure_period: 'Jul 2024 - Present',
      works: [
        'Engineered scalable microservices and intelligent backend pipelines',
        'Optimized database query latency and integrated real-time state synchronization',
        'Built interactive 3D interfaces using Three.js and React',
      ],
    },
  ],
  skills: {
    Technical: {
      'Frontend Development': {
        React: { level: 'expert' },
        'Next.js': { level: 'expert' },
        TypeScript: { level: 'expert' },
        'Tailwind CSS': { level: 'expert' },
        'Three.js': { level: 'advanced' },
      },
      'Backend & Cloud': {
        'Node.js': { level: 'expert' },
        NestJS: { level: 'expert' },
        Python: { level: 'expert' },
        PostgreSQL: { level: 'advanced' },
        Docker: { level: 'advanced' },
      },
      'AI & Machine Learning': {
        PyTorch: { level: 'advanced' },
        TensorFlow: { level: 'advanced' },
        'Hugging Face': { level: 'advanced' },
        OpenCV: { level: 'advanced' },
      },
    },
    'Soft Skills': [
      'System Architecture',
      'Problem Solving',
      'Team Leadership',
      'Agile Collaboration',
    ],
  },
  interest: [
    'Artificial Intelligence',
    'Distributed Systems',
    '3D Web Experiences',
    'Cloud Architecture',
    'Autonomous Agents',
  ],
  contact: {
    msg: {
      Mail: 'kn670423@gmail.com',
      Phone: '+91 9999999999',
    },
    follow: {
      Github: 'https://github.com/KrishnaNaik6',
      Linkedin: 'https://linkedin.com/in/krishnanaik6',
      Instagram: '',
    },
  },
  achievements: [
    'National Level Hackathon Finalist & Innovation Award',
    'Top Performer in AI & Machine Learning Specialization at Ramaiah Institute of Technology',
    'Built Distributed Intelligence System with Multi-Agent Orchestration',
  ],
  about:
    'Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. Crafting intelligent systems, full-stack web applications, and immersive digital experiences.',
  aboutPillars: [
    {
      title: 'Full-Stack Architecture',
      subtitle: 'Scalable & Interactive',
      description:
        'Architecting resilient, production-ready web applications with modern Next.js 15, TypeScript, and microservices.',
      icon: 'layers',
      highlights: ['Next.js 15 & React 19', 'NestJS Microservices', 'Tailwind & Three.js 3D'],
    },
    {
      title: 'Artificial Intelligence',
      subtitle: 'Intelligent & Autonomous',
      description:
        'Designing deep learning models, autonomous agent frameworks, and high-performance inference pipelines.',
      icon: 'brain',
      highlights: ['PyTorch & TensorFlow', 'Autonomous Agents & LLMs', 'Computer Vision & NLP'],
    },
    {
      title: 'Distributed Systems & Cloud',
      subtitle: 'High-Throughput & Resilient',
      description:
        'Deploying distributed containers, PostgreSQL/Redis databases, and automated CI/CD infrastructure.',
      icon: 'server',
      highlights: ['Docker & Cloud Architecture', 'PostgreSQL & Redis', 'CI/CD Pipelines'],
    },
  ],
  constellationMeshConfig: {
    enabled: true,
    nodeDensity: 12,
    interactive: true,
  },
  sections: DEFAULT_SECTIONS,
};

export const FALLBACK_PORTFOLIO_DATA = {
  details: FALLBACK_PORTFOLIO_DETAILS,
  projects: FALLBACK_PROJECTS,
  sections: DEFAULT_SECTIONS,
};
