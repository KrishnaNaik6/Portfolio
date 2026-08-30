import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

describe('HeroClient Component Section Visibility Verification', () => {
  it('renders 8 active sections and does NOT render disabled GitHub Intelligence or Contact when disabled', () => {
    const customConfig: SectionConfig[] = [
      { id: 'hero', label: 'Hero', order: 1, enabled: true },
      { id: 'about', label: 'About Me', order: 2, enabled: true },
      { id: 'education', label: 'Academic Background', order: 3, enabled: true },
      { id: 'experience', label: 'Work Experience', order: 4, enabled: true },
      { id: 'projects', label: 'Featured Projects', order: 5, enabled: true },
      { id: 'skills', label: 'Technical Constellation', order: 6, enabled: true },
      { id: 'interests', label: 'Interests', order: 7, enabled: true },
      { id: 'footer', label: 'Footer', order: 10, enabled: true },
    ];

    const { container } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[{ name: 'MehendiAura', description: 'test', link: { git: '', live: '' } }]}
        initialSections={customConfig}
      />
    );

    // Active Sections MUST BE RENDERED
    expect(screen.getByText(/01 \/ FULL - STACK DEVELOPER/i)).toBeInTheDocument();
    expect(container.querySelector('#about')).toBeInTheDocument();
    expect(container.querySelector('#education')).toBeInTheDocument();
    expect(container.querySelector('#experience')).toBeInTheDocument();
    expect(container.querySelector('#projects')).toBeInTheDocument();
    expect(container.querySelector('#skills')).toBeInTheDocument();
    expect(container.querySelector('#interest')).toBeInTheDocument();
    expect(container.querySelector('#footer')).toBeInTheDocument();

    // Disabled Sections MUST NOT BE RENDERED
    expect(container.querySelector('#git-stats')).not.toBeInTheDocument();
    expect(container.querySelector('#github')).not.toBeInTheDocument();
    expect(container.querySelector('#contact')).not.toBeInTheDocument();
  });

  it('renders ONLY Hero, About, and Footer when only those 3 sections are enabled in NEXIS', () => {
    const onlyHeroAboutFooterSections: SectionConfig[] = [
      { id: 'hero', label: 'Hero', enabled: true, order: 1 },
      { id: 'about', label: 'About Me', enabled: true, order: 2 },
      { id: 'education', label: 'Academic Background', enabled: false, order: 3 },
      { id: 'experience', label: 'Work Experience', enabled: false, order: 4 },
      { id: 'projects', label: 'Featured Projects', enabled: false, order: 5 },
      { id: 'skills', label: 'Technical Constellation', enabled: false, order: 6 },
      { id: 'interests', label: 'Interests', enabled: false, order: 7 },
      { id: 'github', label: 'GitHub Intelligence', enabled: false, order: 8 },
      { id: 'contact', label: 'Get In Touch', enabled: false, order: 9 },
      { id: 'footer', label: 'Footer', enabled: true, order: 10 },
    ];

    const { container } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[{ name: 'MehendiAura', description: 'test', link: { git: '', live: '' } }]}
        initialSections={onlyHeroAboutFooterSections}
      />
    );

    // 1. MUST RENDER: Hero, About Section, and Footer
    expect(screen.getByText(/01 \/ FULL - STACK DEVELOPER/i)).toBeInTheDocument();
    expect(container.querySelector('#about')).toBeInTheDocument();
    expect(container.querySelector('#footer')).toBeInTheDocument();

    // 2. MUST NOT RENDER: Disabled Sections
    expect(container.querySelector('#education')).not.toBeInTheDocument();
    expect(container.querySelector('#experience')).not.toBeInTheDocument();
    expect(container.querySelector('#projects')).not.toBeInTheDocument();
    expect(container.querySelector('#skills')).not.toBeInTheDocument();
    expect(container.querySelector('#interest')).not.toBeInTheDocument();
    expect(container.querySelector('#interests')).not.toBeInTheDocument();
    expect(container.querySelector('#git-stats')).not.toBeInTheDocument();
    expect(container.querySelector('#github')).not.toBeInTheDocument();
    expect(container.querySelector('#contact')).not.toBeInTheDocument();
  });

  it('renders all sections when all sections are enabled in sections array', () => {
    const allEnabledSections: SectionConfig[] = [
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

    const { container } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[{ name: 'MehendiAura', description: 'test', link: { git: '', live: '' } }]}
        initialStats={{ user: { login: 'KrishnaNaik6' } as any, repos: [], extraStats: { commits: 0, prs: 0, issues: 0 } }}
        initialSections={allEnabledSections}
      />
    );

    expect(container.querySelector('#about')).toBeInTheDocument();
    expect(container.querySelector('#education')).toBeInTheDocument();
    expect(container.querySelector('#experience')).toBeInTheDocument();
    expect(container.querySelector('#projects')).toBeInTheDocument();
    expect(container.querySelector('#skills')).toBeInTheDocument();
    expect(container.querySelector('#interest')).toBeInTheDocument();
    expect(container.querySelector('#git-stats')).toBeInTheDocument();
    expect(container.querySelector('#contact')).toBeInTheDocument();
    expect(container.querySelector('#footer')).toBeInTheDocument();
  });

  it('does not render Hero when hero section is disabled', () => {
    const noHeroSections: SectionConfig[] = [
      { id: 'hero', label: 'Hero', enabled: false, order: 1 },
      { id: 'about', label: 'About Me', enabled: true, order: 2 },
      { id: 'footer', label: 'Footer', enabled: true, order: 3 },
    ];

    const { container } = render(
      <HeroClient
        initialDetails={mockDetails}
        initialProjects={[]}
        initialSections={noHeroSections}
      />
    );

    expect(screen.queryByText(/01 \/ FULL - STACK DEVELOPER/i)).not.toBeInTheDocument();
    expect(container.querySelector('#about')).toBeInTheDocument();
    expect(container.querySelector('#footer')).toBeInTheDocument();
  });
});
