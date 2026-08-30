import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import HeroClient from '../components/hero/HeroClient';
import { SectionConfig, PortfolioDetails } from '../lib/types';

// Mock 3D Canvas components
vi.mock('../components/3d/Background3DParticles', () => ({
  default: () => <div data-testid="3d-particles" />,
}));
vi.mock('../components/hero/Hero3DCanvas', () => ({
  default: () => <div data-testid="3d-hero-canvas" />,
}));
vi.mock('../components/3d/Skills3DConstellation', () => ({
  default: () => <div data-testid="3d-skills" />,
}));
vi.mock('../components/3d/Contact3DGlobe', () => ({
  default: () => <div data-testid="3d-globe" />,
}));
vi.mock('../components/3d/Experience3DNode', () => ({
  default: () => <div data-testid="3d-exp-node" />,
}));
vi.mock('../components/ui/CustomCursor', () => ({
  default: () => <div data-testid="custom-cursor" />,
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Bar: () => <div data-testid="chart-bar" />,
  Line: () => <div data-testid="chart-line" />,
  Doughnut: () => <div data-testid="chart-doughnut" />,
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    resolvedTheme: 'dark',
    setTheme: vi.fn(),
  }),
}));

// Mock framer-motion with Proxy
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: new Proxy(
      {},
      {
        get: (_, prop: string) => {
          const Tag = prop as any;
          return ({ children, className, style, ...props }: any) => {
            const {
              layoutId,
              whileHover,
              whileTap,
              whileInView,
              viewport,
              animate,
              initial,
              transition,
              exit,
              ...rest
            } = props;
            return (
              <Tag className={className} style={style} {...rest}>
                {children}
              </Tag>
            );
          };
        },
      }
    ),
  };
});

class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

beforeEach(() => {
  window.IntersectionObserver = MockIntersectionObserver as any;
});

const mockDetails: PortfolioDetails = {
  profile: {
    fullName: 'Krishna Umesh Naik',
    headline: 'Full - Stack developer',
    bio: 'Crafting intelligent systems, full-stack web applications, and immersive digital experiences.',
    location: 'Bengaluru, Karnataka',
    email: 'kn670423@gmail.com',
  },
  education: [
    {
      id: '1',
      college: 'M S Ramaiah Institute Of Technology',
      edu: 'Bachelor of Engineering',
      status: 'Pursuing',
      year: '2027',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'Intelligent Development',
      role: 'Intern',
      tenure_period: 'Jul 2026 - Aug 2026',
      works: ['Engineered web apps'],
    },
  ],
  skills: {
    Technical: {
      'Programming & Development': {
        Python: { proficiency: 'expert' },
      },
    },
  },
  interest: ['Artificial Intelligence', 'Distributed Systems'],
  contact: {
    msg: { Mail: 'kn670423@gmail.com', Phone: '' },
    follow: {
      Github: 'https://github.com/KrishnaNaik6',
      Linkedin: 'https://linkedin.com',
      Instagram: '',
    },
  },
  achievements: ['Hadoop–Spark Cluster'],
  about: 'Crafting intelligent systems...',
  sections: [],
};

const allSections: SectionConfig[] = [
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
];

describe('NEXIS Section Dynamic Synchronization Test Sequence', () => {
  it('handles disabling and re-enabling GitHub and Contact dynamically', () => {
    // 1. Initial State: All sections enabled
    const { container, rerender } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[{ name: 'MehendiAura', description: 'test', link: { git: '', live: '' } }]}
        initialStats={{ user: { login: 'KrishnaNaik6' } as any, repos: [], extraStats: { commits: 0, prs: 0, issues: 0 } }}
        initialSections={allSections}
      />
    );

    expect(container.querySelector('#git-stats')).toBeInTheDocument();
    expect(container.querySelector('#contact')).toBeInTheDocument();

    // 2. Step 1: Disable GitHub + Contact in NEXIS
    const disabledGhContact: SectionConfig[] = allSections.map((s) =>
      s.id === 'github' || s.id === 'contact' ? { ...s, enabled: false } : s
    );

    rerender(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[{ name: 'MehendiAura', description: 'test', link: { git: '', live: '' } }]}
        initialStats={{ user: { login: 'KrishnaNaik6' } as any, repos: [], extraStats: { commits: 0, prs: 0, issues: 0 } }}
        initialSections={disabledGhContact}
      />
    );

    expect(container.querySelector('#git-stats')).not.toBeInTheDocument();
    expect(container.querySelector('#github')).not.toBeInTheDocument();
    expect(container.querySelector('#contact')).not.toBeInTheDocument();

    // 3. Step 2: Re-enable GitHub + Contact in NEXIS
    const reenabledGhContact: SectionConfig[] = allSections.map((s) => ({ ...s, enabled: true }));

    rerender(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[{ name: 'MehendiAura', description: 'test', link: { git: '', live: '' } }]}
        initialStats={{ user: { login: 'KrishnaNaik6' } as any, repos: [], extraStats: { commits: 0, prs: 0, issues: 0 } }}
        initialSections={reenabledGhContact}
      />
    );

    expect(container.querySelector('#git-stats')).toBeInTheDocument();
    expect(container.querySelector('#contact')).toBeInTheDocument();
  });

  it('handles disabling and re-enabling Education and Experience dynamically', () => {
    const disabledEduExp: SectionConfig[] = allSections.map((s) =>
      s.id === 'education' || s.id === 'experience' ? { ...s, enabled: false } : s
    );

    const { container, rerender } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[]}
        initialSections={disabledEduExp}
      />
    );

    expect(container.querySelector('#education')).not.toBeInTheDocument();
    expect(container.querySelector('#experience')).not.toBeInTheDocument();
    expect(container.querySelector('#about')).toBeInTheDocument();

    // Re-enable Education + Experience
    rerender(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[]}
        initialSections={allSections}
      />
    );

    expect(container.querySelector('#education')).toBeInTheDocument();
    expect(container.querySelector('#experience')).toBeInTheDocument();
  });

  it('updates rendering order when section orders are modified in NEXIS', () => {
    const customOrderSections: SectionConfig[] = [
      { id: 'hero', enabled: true, order: 1 },
      { id: 'skills', label: 'Technical Constellation', enabled: true, order: 2 },
      { id: 'about', label: 'About Me', enabled: true, order: 3 },
      { id: 'projects', label: 'Featured Projects', enabled: true, order: 4 },
      { id: 'footer', enabled: true, order: 5 },
    ];

    const { container } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[]}
        initialSections={customOrderSections}
      />
    );

    const mainSections = Array.from(
      container.querySelectorAll('main > div > section, main > div > div > section, main section')
    ).map((el) => el.id).filter(Boolean);

    // Skills should appear before About in the DOM
    const skillsIdx = mainSections.indexOf('skills');
    const aboutIdx = mainSections.indexOf('about');
    expect(skillsIdx).toBeLessThan(aboutIdx);
  });
});
