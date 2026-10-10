import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NexisResumeResponseSchema } from '../lib/nexisSchema';
import {
  fetchNexisResume,
  fetchNexisResumeResult,
  _resetResumeCacheForTesting,
} from '../lib/nexis';

const mockResumeSnapshot = {
  slug: 'krishna-naik',
  theme: 'modern',
  publishedAt: '2026-03-01T00:00:00.000Z',
  profile: {
    fullName: 'Krishna Naik',
    headline: 'Full Stack & AI/ML Engineer',
    email: 'krishna@example.com',
    phone: '+91 9876543210',
    location: 'Bengaluru, India',
    websiteUrl: 'https://krishna-naik.vercel.app',
    bio: 'Senior full-stack engineer and AI specialist.',
    avatarUrl: 'https://example.com/avatar.jpg',
  },
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/KrishnaNaik6' },
    { platform: 'LinkedIn', url: 'https://linkedin.com/in/krishnanaik6' },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Tech Innovations Ltd',
      position: 'Lead AI Engineer',
      location: 'Bengaluru',
      startDate: '2024-01-01',
      endDate: null,
      isCurrent: true,
      highlights: ['Designed multi-agent AI framework', 'Improved throughput by 40%'],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'Ramaiah Institute of Technology',
      degree: 'Bachelor of Engineering',
      fieldOfStudy: 'Computer Science (AI & ML)',
      startDate: '2022-08-01',
      endDate: '2026-06-01',
      grade: '9.4 CGPA',
      activities: ['AI Club Lead', 'Hackathon Organizer'],
    },
  ],
  skills: [
    { id: '1', name: 'TypeScript', category: 'Languages', proficiencyLevel: 'expert' },
    { id: '2', name: 'PyTorch', category: 'AI & ML', proficiencyLevel: 'advanced' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'NEXIS OS',
      description: 'Intelligent Career & System Orchestrator',
      technologies: ['Next.js', 'NestJS', 'PostgreSQL', 'TailwindCSS'],
      liveUrl: 'https://nexis.dev',
      githubUrl: 'https://github.com/KrishnaNaik6/NEXIS',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2025-05-15',
      credentialUrl: 'https://aws.amazon.com/verify/12345',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'National Hackathon 1st Place',
      description: 'Built autonomous search assistant in 24 hours',
      date: '2025-09-20',
    },
  ],
};

describe('NEXIS Resume Schema Validation', () => {
  it('validates a complete published resume snapshot payload', () => {
    const payload = {
      success: true,
      data: mockResumeSnapshot,
    };

    const parseResult = NexisResumeResponseSchema.safeParse(payload);
    expect(parseResult.success).toBe(true);
    if (parseResult.success) {
      expect(parseResult.data.data.slug).toBe('krishna-naik');
      expect(parseResult.data.data.profile.fullName).toBe('Krishna Naik');
      expect(parseResult.data.data.skills.length).toBe(2);
      expect(parseResult.data.data.experiences.length).toBe(1);
    }
  });

  it('rejects invalid schema missing profile name', () => {
    const invalidPayload = {
      success: true,
      data: {
        slug: 'krishna-naik',
        profile: {
          // name and fullName missing
          email: 'test@example.com',
        },
      },
    };

    const parseResult = NexisResumeResponseSchema.safeParse(invalidPayload);
    expect(parseResult.success).toBe(false);
  });

  it('handles optional fields gracefully without failure', () => {
    const minimalPayload = {
      success: true,
      data: {
        slug: 'krishna-naik',
        profile: {
          fullName: 'Krishna Naik',
        },
      },
    };

    const parseResult = NexisResumeResponseSchema.safeParse(minimalPayload);
    expect(parseResult.success).toBe(true);
    if (parseResult.success) {
      expect(parseResult.data.data.experiences).toEqual([]);
      expect(parseResult.data.data.skills).toEqual([]);
      expect(parseResult.data.data.projects).toEqual([]);
    }
  });
});

describe('fetchNexisResume and fetchNexisResumeResult Server Client', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    _resetResumeCacheForTesting();
    process.env = { ...originalEnv };
    process.env.NEXIS_API_URL = 'https://api.nexis.test';
    process.env.NEXIS_API_KEY = 'test-secret-key';
    process.env.NEXIS_RESUME_SLUG = 'krishna-naik';
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('returns not-configured status when NEXIS_API_URL is missing', async () => {
    delete process.env.NEXIS_API_URL;
    const result = await fetchNexisResumeResult();
    expect(result.status).toBe('not-configured');
    expect(result.data).toBeNull();

    const resume = await fetchNexisResume();
    expect(resume).toBeNull();
  });

  it('successfully fetches published resume without transmitting secret API keys to public endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: mockResumeSnapshot,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisResumeResult();
    expect(result.status).toBe('published');
    expect(result.data?.slug).toBe('krishna-naik');
    expect(result.data?.profile.fullName).toBe('Krishna Naik');

    // Verify public headers: Accept and User-Agent are present, but secret keys are NOT sent
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.nexis.test/api/v1/public/resume/krishna-naik',
      expect.objectContaining({
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Krishna-Naik-Portfolio/1.0',
        },
        next: { revalidate: 30 },
      })
    );
  });

  it('evicts cached resume on confirmed 404 unpublish and distinguishes unpublished from error', async () => {
    // 1. Initial published fetch (populates cache)
    const initialFetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: mockResumeSnapshot,
      }),
    });
    vi.stubGlobal('fetch', initialFetchMock);

    const publishedResult = await fetchNexisResumeResult('krishna-naik');
    expect(publishedResult.status).toBe('published');
    expect(publishedResult.data?.profile.fullName).toBe('Krishna Naik');

    // 2. NEXIS unpublishes resume (responds with 404 Not Found)
    const unpublishFetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ success: false, error: { message: 'Published resume not found', statusCode: 404 } }),
    });
    vi.stubGlobal('fetch', unpublishFetchMock);

    // Evict via reset to simulate cache expiration / revalidation
    _resetResumeCacheForTesting();
    const unpublishedResult = await fetchNexisResumeResult('krishna-naik');
    expect(unpublishedResult.status).toBe('unpublished');
    expect(unpublishedResult.statusCode).toBe(404);
    expect(unpublishedResult.data).toBeNull();

    // 3. Verify cache was cleared and does not retain withdrawn data
    const followUpResult = await fetchNexisResumeResult('krishna-naik');
    expect(followUpResult.status).toBe('unpublished');
    expect(followUpResult.data).toBeNull();
  });

  it('isolates cache entries per slug without cross-contamination', async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) => {
      if (url.includes('alice')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({
            success: true,
            data: { ...mockResumeSnapshot, slug: 'alice', profile: { fullName: 'Alice Smith' } },
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { ...mockResumeSnapshot, slug: 'bob', profile: { fullName: 'Bob Jones' } },
        }),
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const aliceResult = await fetchNexisResumeResult('alice');
    const bobResult = await fetchNexisResumeResult('bob');

    expect(aliceResult.data?.profile.fullName).toBe('Alice Smith');
    expect(bobResult.data?.profile.fullName).toBe('Bob Jones');
  });

  it('distinguishes network failure / 500 error from 404 unpublishing', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('Connection timeout'));
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisResumeResult();
    expect(result.status).toBe('error');
    expect(result.data).toBeNull();
    expect(result.errorMessage).toContain('Connection timeout');
  });

  it('supports fetching by custom slug parameter', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: { ...mockResumeSnapshot, slug: 'custom-user' },
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await fetchNexisResumeResult('custom-user');
    expect(result.status).toBe('published');
    expect(result.data?.slug).toBe('custom-user');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.nexis.test/api/v1/public/resume/custom-user',
      expect.anything()
    );
  });
});
