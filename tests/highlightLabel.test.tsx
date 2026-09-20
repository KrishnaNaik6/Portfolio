import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProjectCard from '../components/cards/ProjectCard';
import { ProjectItem } from '../lib/types';
import { NexisPortfolioResponseSchema, normalizeNexisPortfolio } from '../lib/nexisSchema';

// Mock framer-motion with simple proxy
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_, prop: string) => {
          const Tag = prop as any;
          return ({ children, className, style, ...props }: any) => {
            const {
              whileHover,
              whileTap,
              variants,
              ...validProps
            } = props;
            return (
              <Tag className={className} style={style} {...validProps}>
                {children}
              </Tag>
            );
          };
        },
      }
    ),
    useMotionValue: () => ({ set: vi.fn() }),
    useSpring: () => 0,
    useTransform: () => 0,
  };
});

describe('ProjectCard Highlight Label', () => {
  const baseProject: ProjectItem = {
    id: 'p-1',
    name: 'NEXIS Platform',
    type: 'Fullstack',
    description: 'Autonomous portfolio system.',
    link: {
      git: 'https://github.com/test/nexis',
      live: 'https://nexis.example.com',
    },
    featured: false,
    displayOrder: 1,
  };

  it('renders the highlight badge when highlightLabel is provided', () => {
    const project: ProjectItem = {
      ...baseProject,
      highlightLabel: 'FLAGSHIP',
    };

    render(<ProjectCard project={project} index={0} featured={false} />);

    const badge = screen.getByTestId('project-highlight-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe('FLAGSHIP');
    expect(badge.tagName.toLowerCase()).toBe('span'); // Plain text, not interactive
  });

  it('does not render a badge when highlightLabel is null', () => {
    const project: ProjectItem = {
      ...baseProject,
      highlightLabel: null,
    };

    render(<ProjectCard project={project} index={0} featured={false} />);
    expect(screen.queryByTestId('project-highlight-badge')).not.toBeInTheDocument();
  });

  it('does not render a badge when highlightLabel is undefined', () => {
    const project: ProjectItem = {
      ...baseProject,
      highlightLabel: undefined,
    };

    render(<ProjectCard project={project} index={0} featured={false} />);
    expect(screen.queryByTestId('project-highlight-badge')).not.toBeInTheDocument();
  });

  it('does not render a badge when highlightLabel is empty or whitespace-only', () => {
    const projectEmpty: ProjectItem = {
      ...baseProject,
      highlightLabel: '',
    };
    const { unmount } = render(<ProjectCard project={projectEmpty} index={0} featured={false} />);
    expect(screen.queryByTestId('project-highlight-badge')).not.toBeInTheDocument();
    unmount();

    const projectWhitespace: ProjectItem = {
      ...baseProject,
      highlightLabel: '   ',
    };
    render(<ProjectCard project={projectWhitespace} index={0} featured={false} />);
    expect(screen.queryByTestId('project-highlight-badge')).not.toBeInTheDocument();
  });

  it('coexists with the featured badge without altering featured behavior', () => {
    const project: ProjectItem = {
      ...baseProject,
      featured: true,
      highlightLabel: 'AI',
    };

    render(<ProjectCard project={project} index={0} featured={true} />);

    const highlightBadge = screen.getByTestId('project-highlight-badge');
    expect(highlightBadge).toBeInTheDocument();
    expect(highlightBadge.textContent).toBe('AI');

    expect(screen.getByText('Featured Project')).toBeInTheDocument();
  });

  it('safely handles and truncates extremely long labels without throwing', () => {
    const longLabel = 'VERY_LONG_ENTERPRISE_FLAGSHIP_AI_SYSTEM_LABEL_2026';
    const project: ProjectItem = {
      ...baseProject,
      highlightLabel: longLabel,
    };

    render(<ProjectCard project={project} index={0} featured={false} />);

    const badge = screen.getByTestId('project-highlight-badge');
    expect(badge).toBeInTheDocument();
    expect(badge.textContent).toBe(longLabel);
    expect(badge.className).toContain('truncate');
    expect(badge.className).toContain('max-w-full');
  });
});

describe('NEXIS Schema & Normalization for highlightLabel', () => {
  it('preserves highlightLabel from NEXIS API response during normalization', () => {
    const payload = {
      projects: [
        {
          id: 'proj-1',
          name: 'Airport Companion',
          type: 'mobile',
          description: 'AI-assisted travel companion',
          repoUrl: 'https://github.com/test/airport',
          liveUrl: 'https://airport.app',
          featured: true,
          displayOrder: 1,
          highlightLabel: 'AI',
        },
        {
          id: 'proj-2',
          name: 'Standard Project',
          type: 'web',
          description: 'Standard description',
          repoUrl: 'https://github.com/test/std',
          liveUrl: null,
          featured: false,
          displayOrder: 2,
          highlightLabel: null,
        },
        {
          id: 'proj-3',
          name: 'Legacy Project Without Field',
          type: 'tools',
          repoUrl: 'https://github.com/test/legacy',
          displayOrder: 3,
        },
      ],
    };

    const parsed = NexisPortfolioResponseSchema.safeParse(payload);
    expect(parsed.success).toBe(true);

    if (parsed.success) {
      const normalized = normalizeNexisPortfolio(parsed.data);
      expect(normalized.projects[0].highlightLabel).toBe('AI');
      expect(normalized.projects[1].highlightLabel).toBeNull();
      expect(normalized.projects[2].highlightLabel).toBeNull();
    }
  });
});
