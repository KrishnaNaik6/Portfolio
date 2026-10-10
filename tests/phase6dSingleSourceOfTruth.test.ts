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

  it('15. Valid snapshot with 10 enabled sections returns HTTP 200 and all sections normalized', async () => {
    const mock10SectionPayload = {
      success: true,
      data: {
        ...mockValidNexisPortfolio.data,
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
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-10sec' }),
      json: async () => mock10SectionPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(body.sections).toHaveLength(10);
    expect(body.sections[0].id).toBe('hero');
    expect(body.sections[9].id).toBe('footer');
  });

  it('16. Valid direct snapshot (unwrapped) normalizes correctly and returns HTTP 200', async () => {
    const directPayload = {
      ...mockValidNexisPortfolio.data,
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-direct' }),
      json: async () => directPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(body.sections).toHaveLength(3);
  });

  it('17. Missing sections field returns 503 with missing_sections category', async () => {
    const missingSectionsPayload = {
      success: true,
      data: {
        profile: mockValidNexisPortfolio.data.profile,
        projects: mockValidNexisPortfolio.data.projects,
        // sections field completely omitted
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-missing-sec' }),
      json: async () => missingSectionsPayload,
    });
    vi.stubGlobal('fetch', fetchMock);

    const res = await portfolioRouteHandler();
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.category).toBe('missing_sections');
  });

  it('18. An invalid / empty_sections result is NOT cached as published, and a later valid response succeeds', async () => {
    const emptyPayload = {
      success: true,
      data: {
        ...mockValidNexisPortfolio.data,
        sections: [],
      },
    };

    const validPayload = {
      success: true,
      data: {
        ...mockValidNexisPortfolio.data,
      },
    };

    // First call returns empty sections -> 503
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-correlation-id': 'corr-first-fail' }),
        json: async () => emptyPayload,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-correlation-id': 'corr-second-success' }),
        json: async () => validPayload,
      });
    vi.stubGlobal('fetch', fetchMock);

    const res1 = await portfolioRouteHandler();
    expect(res1.status).toBe(503);
    const body1 = await res1.json();
    expect(body1.category).toBe('empty_sections');

    // Second call without cache reset MUST make a network request and succeed
    const res2 = await portfolioRouteHandler();
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('19. Accurately identifies cache hits in diagnostics on subsequent valid requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-cache-test' }),
      json: async () => mockValidNexisPortfolio,
    });
    vi.stubGlobal('fetch', fetchMock);

    // Initial fetch -> network
    const result1 = await fetchNexisPortfolioResult();
    expect(result1.source).toBe('network');
    expect(result1.status).toBe('published');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // Second fetch -> cache hit
    const result2 = await fetchNexisPortfolioResult();
    expect(result2.source).toBe('cache');
    expect(result2.status).toBe('published');
    expect(fetchMock).toHaveBeenCalledTimes(1); // No new network call
  });

  it('20. Wrapped response with invalid inner profile field fails closed with schema_validation_failed and does not cache', async () => {
    const invalidWrappedPayload = {
      success: true,
      data: {
        profile: {
          fullName: 12345, // Invalid type! Must be string
          headline: 'Full-Stack Developer',
        },
        sections: [
          { id: 'hero', label: 'Hero', enabled: true, order: 1 },
          { id: 'about', label: 'About Me', enabled: true, order: 2 },
          { id: 'projects', label: 'Featured Projects', enabled: true, order: 3 },
        ],
        projects: [
          { id: 'p1', name: 'NEXIS OS' },
        ],
      },
    };

    const validWrappedPayload = {
      success: true,
      data: {
        profile: {
          fullName: 'Krishna Umesh Naik',
          headline: 'Full-Stack Developer',
        },
        sections: [
          { id: 'hero', label: 'Hero', enabled: true, order: 1 },
          { id: 'about', label: 'About Me', enabled: true, order: 2 },
        ],
        projects: [
          { id: 'p1', name: 'NEXIS OS' },
        ],
      },
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-correlation-id': 'corr-bad-wrapped' }),
        json: async () => invalidWrappedPayload,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-correlation-id': 'corr-good-wrapped' }),
        json: async () => validWrappedPayload,
      });
    vi.stubGlobal('fetch', fetchMock);

    // 1. Initial invalid wrapped request: fails closed with schema_validation_failed (503)
    const res1 = await portfolioRouteHandler();
    expect(res1.status).toBe(503);
    const body1 = await res1.json();
    expect(body1.success).toBe(false);
    expect(body1.category).toBe('schema_validation_failed');
    expect(body1.correlationId).toBe('corr-bad-wrapped');

    // 2. Subsequent valid request succeeds without resetting cache (proving invalid was NOT cached)
    const res2 = await portfolioRouteHandler();
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('21. Explicit failure envelope (success: false with data and top-level valid fields) is rejected, fails closed, and does not cache', async () => {
    const failedEnvelopeWithTopLevelFields = {
      success: false,
      error: 'Upstream account suspended or internal failure',
      data: {
        somePayload: true,
      },
      profile: {
        fullName: 'Krishna Umesh Naik',
        headline: 'Full-Stack Developer',
      },
      sections: [
        { id: 'hero', label: 'Hero', enabled: true, order: 1 },
        { id: 'about', label: 'About Me', enabled: true, order: 2 },
      ],
      projects: [
        { id: 'p1', name: 'NEXIS OS' },
      ],
    };

    const validWrappedPayload = {
      success: true,
      data: {
        profile: {
          fullName: 'Krishna Umesh Naik',
          headline: 'Full-Stack Developer',
        },
        sections: [
          { id: 'hero', label: 'Hero', enabled: true, order: 1 },
          { id: 'about', label: 'About Me', enabled: true, order: 2 },
        ],
        projects: [
          { id: 'p1', name: 'NEXIS OS' },
        ],
      },
    };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-correlation-id': 'corr-explicit-fail' }),
        json: async () => failedEnvelopeWithTopLevelFields,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'x-correlation-id': 'corr-valid-after-fail' }),
        json: async () => validWrappedPayload,
      });
    vi.stubGlobal('fetch', fetchMock);

    // 1. Initial explicit failure envelope request: must NOT parse top-level fields as direct snapshot
    const res1 = await portfolioRouteHandler();
    expect(res1.status).toBe(503);
    const body1 = await res1.json();
    expect(body1.success).toBe(false);
    expect(body1.correlationId).toBe('corr-explicit-fail');

    // 2. Subsequent valid request succeeds without resetting cache (proving failure was NOT cached)
    const res2 = await portfolioRouteHandler();
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('22. Accepts valid wrapped response with null education/experience startDates, returns HTTP 200 with 10 sections, and caches cleanly', async () => {
    const realisticPayloadWithNullStartDates = {
      success: true,
      data: {
        publishedAt: '2026-08-29T07:32:03.855Z',
        profile: {
          fullName: 'Krishna Umesh Naik',
          headline: 'Full-Stack Developer',
          bio: 'AI & ML Engineer and Full-Stack Developer.',
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
        education: [
          {
            id: 'edu-1',
            institution: 'M S Ramaiah Institute Of Technology',
            degree: 'Bachelor of Engineering',
            fieldOfStudy: 'Computer Science and Engineering (AI/ML)',
            startDate: null,
            endDate: '2027',
            status: 'Pursuing',
            grade: 'First Class',
            displayOrder: 0,
          },
          {
            id: 'edu-2',
            institution: 'Govt. Polytechnic Siddapur',
            degree: 'Diploma in Computer Science',
            fieldOfStudy: 'Computer Science and Engineering',
            startDate: null,
            endDate: '2024',
            status: 'Completed',
            grade: '9.43',
            displayOrder: 1,
          },
          {
            id: 'edu-3',
            institution: 'Govt. Mohan K Shetty P.U College',
            degree: 'Pre University Education',
            fieldOfStudy: 'Science (PCMB)',
            startDate: null,
            endDate: '2022',
            status: 'Completed',
            grade: 'First Class',
            displayOrder: 2,
          },
        ],
        experience: [
          {
            id: 'exp-1',
            company: 'Intelligent Development and Programming Pvt. Ltd.',
            position: 'Software Engineer Intern',
            startDate: null,
            endDate: '2026-08-20',
            isCurrent: true,
            description: 'Support development team.',
            displayOrder: 0,
          },
          {
            id: 'exp-2',
            company: 'CanaraTechLabs Pvt Ltd',
            position: 'Software Engineer Intern',
            startDate: null,
            endDate: '2024-04-30',
            isCurrent: false,
            description: 'Built full-stack applications.',
            displayOrder: 1,
          },
        ],
        projects: [
          { id: 'p1', name: 'NEXIS OS', displayOrder: 1 },
        ],
        skills: [
          { name: 'TypeScript', category: 'Programming & Development', displayOrder: 1 },
        ],
      },
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'x-correlation-id': 'corr-null-start-dates' }),
      json: async () => realisticPayloadWithNullStartDates,
    });
    vi.stubGlobal('fetch', fetchMock);

    // 1. Initial request successfully validates, normalizes, and returns HTTP 200
    const res1 = await portfolioRouteHandler();
    expect(res1.status).toBe(200);
    const body1 = await res1.json();
    expect(body1.sections).toHaveLength(10);
    expect(body1.details.education).toHaveLength(3);
    expect(body1.details.education[0].year).toBe('2027');
    expect(body1.details.education[1].year).toBe('2024');
    expect(body1.details.education[2].year).toBe('2022');
    expect(body1.details.experience[0].tenure_period).toBe('Present');
    expect(body1.details.experience[1].tenure_period).toBe('Apr 2024');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    // 2. Subsequent request is served from memory cache within TTL without extra fetch
    const res2 = await portfolioRouteHandler();
    expect(res2.status).toBe(200);
    const body2 = await res2.json();
    expect(body2.details.profile.fullName).toBe('Krishna Umesh Naik');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

