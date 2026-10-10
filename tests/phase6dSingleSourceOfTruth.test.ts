import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchNexisPortfolio, _resetResumeCacheForTesting } from '@/lib/nexis';
import { GET as portfolioRouteHandler } from '@/app/api/portfolio/route';

const mockValidNexisPortfolio = {
  success: true,
  data: {
    profile: {
      fullName: 'Krishna Umesh Naik',
      headline: 'Full-Stack Developer & AI/ML Engineer',
      bio: 'Computer Science student specializing in AI & ML at Ramaiah Institute of Technology.',
      location: 'Bengaluru, India',
      email: 'kn670423@gmail.com',
      phone: '+91 9876543210',
      resumeUrl: '/resume',
      welcomeGreeting: 'Welcome to my portfolio',
      typewriterTexts: ['Full-Stack Developer', 'AI/ML Engineer'],
      pillars: [],
    },
    education: [
      {
        id: 'edu-1',
        edu: 'B.E. in Computer Science',
        college: 'Ramaiah Institute of Technology',
        status: 'Pursuing',
        year: '2023 - 2027',
        grade: '9.4 CGPA',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Lead AI Engineer',
        company: 'NEXIS Core Lab',
        tenure: '2024 - Present',
        works: ['Engineered multi-agent pipeline'],
      },
    ],
    skills: [
      { name: 'TypeScript', category: 'Languages & Frameworks', proficiencyLevel: 'expert' },
      { name: 'Python', category: 'Languages & Frameworks', proficiencyLevel: 'expert' },
    ],
    interests: ['AI', 'Distributed Systems'],
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com/KrishnaNaik6' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/krishnanaik6' },
    ],
    achievements: [
      { id: 'ach-1', title: 'Grand Prize Winner Hackathon' },
    ],
    projects: [
      {
        id: 'proj-1',
        name: 'NEXIS OS',
        description: 'Intelligent Control Plane',
        githubUrl: 'https://github.com/KrishnaNaik6/NEXIS',
        liveUrl: 'https://nexis.dev',
        collabed: false,
        type: 'Full Stack',
        featured: true,
        displayOrder: 1,
      },
    ],
    sections: [
      { id: 'hero', label: 'Hero', order: 1, enabled: true },
      { id: 'about', label: 'About', order: 2, enabled: true },
      { id: 'projects', label: 'Projects', order: 3, enabled: true },
    ],
  },
};

describe('NEXIS Phase 6D — Single Source of Truth & Dummy Data Elimination', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    _resetResumeCacheForTesting();
    process.env = { ...originalEnv };
    process.env.NEXIS_API_URL = 'https://api.nexis.test';
    process.env.NEXIS_API_KEY = 'test-nexus-api-key';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('1. Accurately normalizes and returns valid NEXIS data without fabricating fields', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockValidNexisPortfolio,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).not.toBeNull();
    expect(result?.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(result?.projects).toHaveLength(1);
    expect(result?.projects[0].name).toBe('NEXIS OS');
    expect(result?.sections).toHaveLength(3);

    // Verify verified X-Nexus-Api-Key header format
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.nexis.test/api/v1/public/portfolio',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Nexus-Api-Key': 'test-nexus-api-key',
          Accept: 'application/json',
        }),
      })
    );
  });

  it('2. Keeps legitimately empty project array empty without injecting fake projects', async () => {
    const emptyProjectsPayload = {
      ...mockValidNexisPortfolio,
      data: {
        ...mockValidNexisPortfolio.data,
        projects: [],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => emptyProjectsPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).not.toBeNull();
    expect(result?.projects).toEqual([]);
    expect(result?.projects).toHaveLength(0);
  });

  it('3. Fails closed and returns null when NEXIS_API_URL is unconfigured', async () => {
    delete process.env.NEXIS_API_URL;
    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();
  });

  it('4. Fails closed and purges cache on HTTP 401 Unauthorized', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: 'Unauthorized' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();
  });

  it('5. Fails closed and purges cache on HTTP 403 Forbidden', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ success: false, error: 'Forbidden' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();
  });

  it('6. Fails closed and purges cache on HTTP 404 Not Found', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ success: false, error: 'Not Found' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();
  });

  it('7. Fails closed on HTTP 500 server error, timeout, or malformed schema', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Upstream timeout'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();
  });

  it('8. /api/portfolio route returns HTTP 503 and never returns 200 or dummy data on upstream failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ success: false, error: 'Unauthorized' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('unavailable from NEXIS upstream');
    expect(body).not.toHaveProperty('details');
  });

  it('9. /api/portfolio route returns HTTP 200 with validated data when upstream succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockValidNexisPortfolio,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(body.projects).toHaveLength(1);
  });
});
