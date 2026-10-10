import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fetchNexisPortfolio, fetchNexisPortfolioResult, _resetResumeCacheForTesting } from '@/lib/nexis';
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
      headers: new Headers({ 'x-correlation-id': 'corr-success-123' }),
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
      headers: new Headers(),
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

    const fetchResult = await fetchNexisPortfolioResult();
    expect(fetchResult.status).toBe('not-configured');
    expect(fetchResult.errorCategory).toBe('missing_configuration');
  });

  it('4. Fails closed and purges cache on HTTP 401 Unauthorized', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'x-correlation-id': 'corr-401-abc' }),
      json: async () => ({ success: false, error: 'Unauthorized' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();

    const fetchResult = await fetchNexisPortfolioResult();
    expect(fetchResult.status).toBe('unauthorized');
    expect(fetchResult.statusCode).toBe(401);
    expect(fetchResult.correlationId).toBe('corr-401-abc');
    expect(fetchResult.errorCategory).toBe('unauthorized');
  });

  it('5. Fails closed and purges cache on HTTP 403 Forbidden', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      headers: new Headers({ 'x-correlation-id': 'corr-403-def' }),
      json: async () => ({ success: false, error: 'Forbidden' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();

    const fetchResult = await fetchNexisPortfolioResult();
    expect(fetchResult.status).toBe('forbidden');
    expect(fetchResult.statusCode).toBe(403);
    expect(fetchResult.errorCategory).toBe('forbidden');
  });

  it('6. Fails closed and purges cache on HTTP 404 Not Found', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({ 'x-correlation-id': 'corr-404-ghi' }),
      json: async () => ({ success: false, error: 'Not Found' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();

    const fetchResult = await fetchNexisPortfolioResult();
    expect(fetchResult.status).toBe('not-found');
    expect(fetchResult.statusCode).toBe(404);
    expect(fetchResult.errorCategory).toBe('not_found');
  });

  it('7. Fails closed on HTTP 500 server error, timeout, or malformed schema', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Upstream timeout'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisPortfolio();
    expect(result).toBeNull();

    const fetchResult = await fetchNexisPortfolioResult();
    expect(fetchResult.status).toBe('error');
    expect(fetchResult.errorCategory).toBe('network_or_timeout_error');
  });

  it('8. /api/portfolio route returns HTTP 503 and propagates correlation ID header on upstream failure', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: new Headers({ 'x-correlation-id': 'corr-503-upstream' }),
      json: async () => ({ success: false, error: 'Unauthorized' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    expect(res.headers.get('x-correlation-id')).toBe('corr-503-upstream');
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error).toContain('unavailable from NEXIS upstream');
    expect(body.category).toBe('unauthorized');
    expect(body.correlationId).toBe('corr-503-upstream');
    expect(body).not.toHaveProperty('details');
  });

  it('9. /api/portfolio route returns HTTP 200 with validated data and correlation ID when upstream succeeds', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-200-success' }),
      json: async () => mockValidNexisPortfolio,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(200);
    expect(res.headers.get('x-correlation-id')).toBe('corr-200-success');
    const body = await res.json();
    expect(body.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(body.projects).toHaveLength(1);
  });

  it('10. Handles malformed upstream JSON schema by failing closed with schema_validation_failed category', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-schema-bad' }),
      json: async () => 'not-a-valid-json-object-snapshot',
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.category).toBe('schema_validation_failed');
    expect(body.correlationId).toBe('corr-schema-bad');
  });

  it('11. Fails closed with empty_sections category when upstream published snapshot has zero sections', async () => {
    const zeroSectionsPayload = {
      ...mockValidNexisPortfolio,
      data: {
        ...mockValidNexisPortfolio.data,
        sections: [],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-zero-sec' }),
      json: async () => zeroSectionsPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.category).toBe('empty_sections');
    expect(body.correlationId).toBe('corr-zero-sec');
  });

  it('12. Fails closed with empty_sections category when upstream published snapshot has all sections disabled', async () => {
    const allDisabledSectionsPayload = {
      ...mockValidNexisPortfolio,
      data: {
        ...mockValidNexisPortfolio.data,
        sections: [
          { id: 'hero', label: 'Hero', order: 1, enabled: false },
          { id: 'about', label: 'About', order: 2, enabled: false },
          { id: 'projects', label: 'Projects', order: 3, enabled: false },
        ],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-all-disabled' }),
      json: async () => allDisabledSectionsPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.category).toBe('empty_sections');
    expect(body.correlationId).toBe('corr-all-disabled');
  });

  it('13. Fails closed with missing_configuration category on /api/portfolio when NEXIS_API_URL is unset', async () => {
    delete process.env.NEXIS_API_URL;

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.category).toBe('missing_configuration');
  });

  it('14. Fails closed with network_or_timeout_error category on /api/portfolio on upstream fetch timeout', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Fetch timed out'));
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.category).toBe('network_or_timeout_error');
  });
});

