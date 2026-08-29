import { describe, it, expect } from 'vitest';
import { normalizeNexisPortfolio } from '../lib/nexisSchema';

describe('Project Ordering & Featured State', () => {
  it('orders projects strictly by displayOrder ascending', () => {
    const rawData = {
      projects: [
        { name: 'Project C', displayOrder: 3, repoUrl: 'https://github.com/test/c' },
        { name: 'Project A', displayOrder: 1, repoUrl: 'https://github.com/test/a' },
        { name: 'Project B', displayOrder: 2, repoUrl: 'https://github.com/test/b' },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    const names = normalized.projects.map((p) => p.name);

    expect(names).toEqual(['Project A', 'Project B', 'Project C']);
  });

  it('respects featured flag accurately', () => {
    const rawData = {
      projects: [
        { name: 'Project 1', displayOrder: 0, featured: false, repoUrl: 'https://github.com/test/1' },
        { name: 'Project 2', displayOrder: 1, featured: true, repoUrl: 'https://github.com/test/2' },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    expect(normalized.projects[0].featured).toBe(false);
    expect(normalized.projects[1].featured).toBe(true);
  });

  it('maps liveUrl and repoUrl correctly', () => {
    const rawData = {
      projects: [
        {
          name: 'MehendiAura',
          repoUrl: 'https://github.com/KrishnaNaik6/MehendiAura',
          liveUrl: 'https://mhendi-by-mamatha.vercel.app',
        },
        {
          name: 'backend-service',
          repoUrl: 'https://github.com/KrishnaNaik6/backend-service',
          liveUrl: null,
        },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    expect(normalized.projects[0].link.git).toBe('https://github.com/KrishnaNaik6/MehendiAura');
    expect(normalized.projects[0].link.live).toBe('https://mhendi-by-mamatha.vercel.app');
    expect(normalized.projects[1].link.live).toBeNull();
  });
});
