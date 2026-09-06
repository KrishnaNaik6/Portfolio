import { describe, it, expect } from 'vitest';
import {
  NexisPortfolioResponseSchema,
  normalizeNexisPortfolio,
  formatTenurePeriod,
} from '../lib/nexisSchema';

const fullSnapshot = {
  publishedAt: '2026-08-29T07:32:03.855Z',
  profile: {
    fullName: 'Krishna Umesh Naik',
    headline: 'Full - Stack developer',
    bio: 'I am Krishna Naik (Krishna Umesh Naik), a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. Crafting intelligent systems, full-stack web applications, and immersive digital experiences.',
    location: 'Bengaluru, Karnataka',
    email: 'kn670423@gmail.com',
  },
  sections: [
    { id: 'hero', label: 'Hero', enabled: true, order: 1 },
    { id: 'about', label: 'About Me', enabled: true, order: 2 },
    { id: 'education', label: 'Academic Background', enabled: true, order: 3 },
    { id: 'experience', label: 'Work Experience', enabled: true, order: 4 },
    { id: 'projects', label: 'Featured Projects', enabled: true, order: 5 },
    { id: 'skills', label: 'Technical Constellation', enabled: true, order: 6 },
    { id: 'interests', label: 'Interests', enabled: true, order: 7 },
    { id: 'github', label: 'GitHub Intelligence', enabled: true, order: 8 },
    { id: 'contact', label: 'Get In Touch', enabled: true, order: 9 },
    { id: 'footer', label: 'Footer', enabled: true, order: 10 },
  ],
  projects: [
    {
      id: '7428fe36-67a8-4e99-a2f8-2c3121191013',
      name: 'MehendiAura',
      type: 'web',
      description: 'A responsive Mehendi & rental jewellery business website...',
      repoUrl: 'https://github.com/KrishnaNaik6/MehendiAura',
      liveUrl: 'https://mhendi-by-mamatha.vercel.app',
      featured: false,
      displayOrder: 0,
    },
    {
      id: '29d5798d-4714-41c8-9e32-d2dae5dc1adb',
      name: 'Portfolio',
      type: 'web',
      description: 'Personal developer portfolio showcasing projects, skills, and experience.',
      repoUrl: 'https://github.com/KrishnaNaik6/Portfolio',
      liveUrl: 'https://portfolio-xi-six-p62hcze01w.vercel.app',
      featured: false,
      displayOrder: 1,
    },
    {
      id: 'f9c53c8f-82ec-4818-8e9b-2d9958d200d2',
      name: 'intern-ecommerce-Krishna',
      type: 'web',
      description: null,
      repoUrl: 'https://github.com/KrishnaNaik6/intern-ecommerce-Krishna',
      liveUrl: null,
      featured: false,
      displayOrder: 2,
    },
    {
      id: 'b089acc1-9cd5-4597-ab06-4f3cae18a1e6',
      name: 'intern-ecommerce',
      type: 'web',
      description: 'A small e-commerce web app...',
      repoUrl: 'https://github.com/KrishnaNaik6/intern-ecommerce',
      liveUrl: null,
      featured: false,
      displayOrder: 3,
    },
    {
      id: 'd90c634e-1630-4147-a51e-34ccbc63fc17',
      name: 'TaskManager',
      type: 'web',
      description: 'A full-stack Task Manager application built using the MERN stack...',
      repoUrl: 'https://github.com/KrishnaNaik6/TaskManager',
      liveUrl: 'https://task-manager-app24.vercel.app',
      featured: false,
      displayOrder: 4,
    },
  ],
  experience: [
    {
      id: '294b1379-15b3-4d4a-a9b6-7ee8c7fe8af0',
      company: 'Intelligent Development and Programming Pvt. Ltd.',
      position: 'Software Engineer Intern',
      startDate: '2026-07-06',
      endDate: '2026-08-20',
      isCurrent: true,
      description: 'Support development team.\nCollaborate on group projects.\nPractical exposure.',
      companyUrl: 'https://indpro.se/',
      displayOrder: 0,
    },
    {
      id: '0c47d68c-da1d-44ea-8ca4-8f1d39b450ee',
      company: 'CanaraTechLabs Pvt Ltd',
      position: 'Software Engineer Intern',
      startDate: '2024-01-01',
      endDate: '2024-04-30',
      isCurrent: false,
      description: 'Built full-stack applications using React.js, Node.js.\nDeveloped multilingual news app.\nCreated sports engagement platform.',
      companyUrl: 'https://canaratechlabs.com/',
      displayOrder: 1,
    },
  ],
  education: [
    {
      id: 'd505ec90-93fb-4d21-b369-590158efbf8b',
      institution: 'M S Ramaiah Institute Of Technology',
      degree: 'Bachelor of Engineering',
      fieldOfStudy: 'Computer Science and Engineering (AI/ML)',
      status: 'Pursuing',
      completionYear: '2027',
      grade: 'First Class',
      displayOrder: 0,
    },
    {
      id: '769c5920-d620-4bcc-aaca-818cc1f5952f',
      institution: 'Govt. Polytechnic Siddapur',
      degree: 'Diploma in Computer Science',
      fieldOfStudy: 'Computer Science and Engineering',
      status: 'Completed',
      completionYear: '2024',
      grade: '9.43',
      displayOrder: 1,
    },
    {
      id: '767d1b55-c64c-47a5-b907-f2dce56bee1d',
      institution: 'Govt. Mohan K Shetty P.U College',
      degree: 'Pre University Education',
      fieldOfStudy: 'Science (PCMB)',
      status: 'Completed',
      completionYear: '2022',
      grade: 'First Class',
      displayOrder: 2,
    },
  ],
  skills: [
    {
      id: '82beba59-1475-46de-851b-aef0f2721e07',
      name: 'MERN Stack (MongoDB, Express.js, React.js, Node.js)',
      category: 'Programming & Development',
      proficiencyLevel: 'expert',
      displayOrder: 1,
    },
    {
      id: 'b12a084a-8d6b-44ac-a8a7-8773b7dd1252',
      name: 'Python',
      category: 'Programming & Development',
      proficiencyLevel: 'advanced',
      displayOrder: 2,
    },
    {
      id: '17013e9c-8d4a-4669-bf01-a7021a470eb5',
      name: 'SQL',
      category: 'Databases & Tools',
      proficiencyLevel: 'advanced',
      displayOrder: 6,
    },
    {
      id: '598d475b-8288-40f5-89a8-a62cc418b727',
      name: 'AWS S3',
      category: 'DevOps',
      proficiencyLevel: 'intermediate',
      displayOrder: 10,
    },
    {
      id: 'ac05ff86-52bf-4abb-8a34-974f774c3f76',
      name: 'Problem-Solving',
      category: 'Soft Skills',
      proficiencyLevel: 'expert',
      displayOrder: 12,
    },
  ],
  achievements: [
    {
      id: 'e4581e6f-2f35-43b0-97c2-514636055cbf',
      title: 'Hadoop–Spark Large-Scale Data Cluster',
      description: 'Implemented a Hadoop–Spark cluster processing large-scale datasets efficiently.',
      displayOrder: 1,
    },
  ],
  socialLinks: [
    {
      id: '77a2374f-8dcf-4c39-afa8-918e96aa9ba7',
      platform: 'GitHub',
      url: 'https://github.com/KrishnaNaik6',
      username: 'KrishnaNaik6',
      displayOrder: 1,
    },
    {
      id: 'c9613bd1-5dc7-4397-8bdf-d495a9540e6f',
      platform: 'LinkedIn',
      url: 'https://www.linkedin.com/in/krishnaunaik/',
      username: 'krishnaunaik',
      displayOrder: 2,
    },
    {
      id: '0ac22ee3-ed8e-48bb-978b-3c67f0c5463d',
      platform: 'Instagram',
      url: 'https://www.instagram.com/krishna_nk08/',
      username: 'krishna_nk08',
      displayOrder: 3,
    },
  ],
};

describe('NEXIS Schema Validation & Normalization', () => {
  it('successfully validates the live NEXIS API snapshot', () => {
    const result = NexisPortfolioResponseSchema.safeParse(fullSnapshot);
    expect(result.success).toBe(true);
    if (!result.success) return;

    const validatedData = result.data as any;
    expect(validatedData.profile?.fullName).toBe('Krishna Umesh Naik');
    expect(validatedData.sections?.length).toBe(10);
    expect(validatedData.projects?.length).toBe(5);
    expect(validatedData.skills?.length).toBe(5);
  });

  it('rejects invalid API response structures', () => {
    const invalidData = {
      profile: 'not an object',
      sections: [{ id: 123, enabled: 'yes' }],
      projects: [{ repoUrl: 12345 }],
    };

    const result = NexisPortfolioResponseSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('normalizes full snapshot into comprehensive portfolio structures', () => {
    const parsed = NexisPortfolioResponseSchema.parse(fullSnapshot);
    const normalized = normalizeNexisPortfolio(parsed);

    // Profile
    expect(normalized.details.profile?.fullName).toBe('Krishna Umesh Naik');
    expect(normalized.details.profile?.headline).toBe('Full - Stack developer');
    expect(normalized.details.profile?.location).toBe('Bengaluru, Karnataka');
    expect(normalized.details.profile?.email).toBe('kn670423@gmail.com');

    // Education (3 items sorted)
    expect(normalized.details.education.length).toBe(3);
    expect(normalized.details.education[0].college).toBe('M S Ramaiah Institute Of Technology');
    expect(normalized.details.education[1].college).toBe('Govt. Polytechnic Siddapur');
    expect(normalized.details.education[2].college).toBe('Govt. Mohan K Shetty P.U College');

    // Experience (2 items)
    expect(normalized.details.experience.length).toBe(2);
    expect(normalized.details.experience[0].company).toBe(
      'Intelligent Development and Programming Pvt. Ltd.'
    );
    expect(normalized.details.experience[1].company).toBe('CanaraTechLabs Pvt Ltd');

    // Skills Categorization
    expect(
      normalized.details.skills.Technical['Programming & Development']['Python']
    ).toBeDefined();
    expect(
      normalized.details.skills.Technical['Databases & Tools']['SQL']
    ).toBeDefined();
    expect(
      normalized.details.skills.Technical['DevOps']['AWS S3']
    ).toBeDefined();
    expect(normalized.details.skills['Soft Skills']).toContain('Problem-Solving');

    // Social Links
    expect(normalized.details.contact.follow.Github).toBe('https://github.com/KrishnaNaik6');
    expect(normalized.details.contact.follow.Linkedin).toBe(
      'https://www.linkedin.com/in/krishnaunaik/'
    );
    expect(normalized.details.contact.follow.Instagram).toBe(
      'https://www.instagram.com/krishna_nk08/'
    );

    // Projects mapping
    expect(normalized.projects.length).toBe(5);
    expect(normalized.projects[0].name).toBe('MehendiAura');
    expect(normalized.projects[0].link.live).toBe('https://mhendi-by-mamatha.vercel.app');
    expect(normalized.projects[2].description).toBeNull();
  });

  it('handles missing optional fields safely without dummy data', () => {
    const minimalData = {
      profile: {
        fullName: 'Krishna Naik',
      },
    };

    const parsed = NexisPortfolioResponseSchema.parse(minimalData);
    const normalized = normalizeNexisPortfolio(parsed);

    expect(normalized.details.profile?.fullName).toBe('Krishna Naik');
    expect(normalized.details.profile?.email).toBeUndefined();
    expect(normalized.details.profile?.phone).toBeUndefined();
    expect(normalized.details.profile?.resumeUrl).toBeUndefined();
    expect(normalized.details.education).toEqual([]);
    expect(normalized.details.experience).toEqual([]);
    expect(normalized.projects).toEqual([]);
    expect(normalized.details.interest).toEqual([]);
  });

  it('formats tenure periods correctly', () => {
    expect(formatTenurePeriod('2024-01-01', '2024-04-30', false)).toBe('Jan 2024 - Apr 2024');
    expect(formatTenurePeriod('2026-07-06', null, true)).toBe('Jul 2026 - Present');
    expect(formatTenurePeriod(null, null, false)).toBe('');
  });
});
