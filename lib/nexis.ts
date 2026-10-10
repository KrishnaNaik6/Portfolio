import {
  NexisPortfolioResponseSchema,
  normalizeNexisPortfolio,
  NormalizedNexisData,
  NexisResumeResponseSchema,
} from './nexisSchema';
import type { ResumeSnapshot } from './types';

let cachedPortfolioSnapshot: NormalizedNexisData | null = null;
let cachedPortfolioTimestamp = 0;
interface CachedResumeEntry {
  snapshot: ResumeSnapshot & { slug?: string };
  timestamp: number;
}

const resumeCache = new Map<string, CachedResumeEntry>();

const CACHE_TTL_MS = 30 * 1000;
const REQUEST_TIMEOUT_MS = 6000;

export function _resetResumeCacheForTesting(): void {
  resumeCache.clear();
  cachedPortfolioSnapshot = null;
  cachedPortfolioTimestamp = 0;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = REQUEST_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(id);
  }
}

function getNexisConfig() {
  const apiUrl = (process.env.NEXIS_API_URL ?? '').trim();
  const apiKey = (process.env.NEXIS_API_KEY ?? '').trim();
  return { apiUrl: apiUrl.replace(/\/$/, ''), apiKey };
}

function getNexisHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'Krishna-Naik-Portfolio/1.0',
  };

  if (apiKey) {
    headers['X-Nexus-Api-Key'] = apiKey;
    headers['X-Nexis-Api-Key'] = apiKey;
    headers['x-api-key'] = apiKey;
    if (apiKey.startsWith('Bearer ') || apiKey.startsWith('ey')) {
      headers.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
    }
  }

  return headers;
}

export async function fetchNexisPortfolio(): Promise<NormalizedNexisData | null> {
  const now = Date.now();
  if (cachedPortfolioSnapshot && now - cachedPortfolioTimestamp < CACHE_TTL_MS) {
    return cachedPortfolioSnapshot;
  }

  const { apiUrl, apiKey } = getNexisConfig();
  if (!apiUrl) {
    console.warn('[NEXIS Client] NEXIS_API_URL is not configured; using fallback data source.');
    return cachedPortfolioSnapshot;
  }

  const endpoint = `${apiUrl}/api/v1/public/portfolio`;
  const headers = getNexisHeaders(apiKey);

  try {
    const res = await fetchWithTimeout(endpoint, {
      headers,
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.warn(`[NEXIS Client] ${endpoint} returned HTTP ${res.status}`);
      return cachedPortfolioSnapshot;
    }

    const rawJson = await res.json();
    const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);
    if (!parseResult.success) {
      console.error(`[NEXIS Client] Validation failed on ${endpoint}`);
      return cachedPortfolioSnapshot;
    }

    const normalized = normalizeNexisPortfolio(parseResult.data);
    cachedPortfolioSnapshot = normalized;
    cachedPortfolioTimestamp = Date.now();
    return normalized;
  } catch (err) {
    console.warn(
      `[NEXIS Client] Fetch failed on ${endpoint}:`,
      err instanceof Error ? err.message : 'Unknown error'
    );
  }

  if (cachedPortfolioSnapshot) {
    console.log('[NEXIS Client] Serving last known cached snapshot');
  }
  return cachedPortfolioSnapshot;
}

export type ResumeFetchStatus = 'published' | 'unpublished' | 'error' | 'not-configured';

export interface ResumeFetchResult {
  status: ResumeFetchStatus;
  data: (ResumeSnapshot & { slug?: string }) | null;
  statusCode?: number;
  errorMessage?: string;
}

export async function fetchNexisResumeResult(
  customSlug?: string
): Promise<ResumeFetchResult> {
  const rawSlug = customSlug || process.env.NEXIS_RESUME_SLUG || 'krishna-naik';
  const normalizedSlug = rawSlug.trim().toLowerCase();
  const slug = encodeURIComponent(normalizedSlug);

  const now = Date.now();
  const cached = resumeCache.get(normalizedSlug);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      status: 'published',
      data: cached.snapshot,
    };
  }

  const { apiUrl } = getNexisConfig();
  if (!apiUrl) {
    console.warn('[NEXIS Client] NEXIS_API_URL is not configured; cannot fetch resume.');
    return {
      status: 'not-configured',
      data: null,
      errorMessage: 'NEXIS_API_URL is not configured',
    };
  }

  const endpoint = `${apiUrl}/api/v1/public/resume/${slug}`;
  // Public resume endpoint is unauthenticated; do not transmit private API keys or auth headers
  const publicHeaders: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'Krishna-Naik-Portfolio/1.0',
  };

  try {
    const res = await fetchWithTimeout(
      endpoint,
      {
        headers: publicHeaders,
        next: { revalidate: 30 },
      },
      REQUEST_TIMEOUT_MS
    );

    // 404 explicitly signifies unpublished or withdrawn resume snapshot
    if (res.status === 404) {
      console.warn(`[NEXIS Client] Published resume not found on ${endpoint} (404 Not Found)`);
      // Evict any stale cache entry for this slug so unpublish takes immediate effect
      resumeCache.delete(normalizedSlug);
      return {
        status: 'unpublished',
        data: null,
        statusCode: 404,
        errorMessage: 'Resume is unpublished or does not exist',
      };
    }

    if (!res.ok) {
      console.warn(`[NEXIS Client] Resume fetch returned HTTP ${res.status} on ${endpoint}`);
      return {
        status: 'error',
        data: null,
        statusCode: res.status,
        errorMessage: `HTTP ${res.status}`,
      };
    }

    const rawJson = await res.json();
    const parseResult = NexisResumeResponseSchema.safeParse(rawJson);
    if (!parseResult.success) {
      console.error(`[NEXIS Client] Resume validation failed on ${endpoint}:`, parseResult.error);
      return {
        status: 'error',
        data: null,
        errorMessage: 'Resume schema validation failed',
      };
    }

    const parsed = parseResult.data as any;
    const snapshot: ResumeSnapshot & { slug?: string } = 'data' in parsed && parsed.data
      ? parsed.data
      : parsed;

    snapshot.slug = rawSlug;
    resumeCache.set(normalizedSlug, {
      snapshot,
      timestamp: Date.now(),
    });
    return {
      status: 'published',
      data: snapshot,
    };
  } catch (err) {
    console.warn(
      `[NEXIS Client] Resume fetch failed on ${endpoint}:`,
      err instanceof Error ? err.message : 'Unknown error'
    );
    return {
      status: 'error',
      data: null,
      errorMessage: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export async function fetchNexisResume(
  customSlug?: string
): Promise<(ResumeSnapshot & { slug?: string }) | null> {
  const result = await fetchNexisResumeResult(customSlug);
  return result.data;
}

export async function fetchNexisGitHubIntelligence(year?: number | string): Promise<any | null> {
  const { apiUrl, apiKey } = getNexisConfig();
  if (!apiUrl) return null;

  const query = year ? `?year=${encodeURIComponent(String(year))}` : '';
  const candidateEndpoints = [
    `${apiUrl}/api/v1/public/portfolio/github-intelligence${query}`,
    `${apiUrl}/api/v1/public/github/intelligence${query}`,
    `${apiUrl}/api/v1/github/intelligence${query}`,
  ];
  const headers = getNexisHeaders(apiKey);

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetchWithTimeout(endpoint, {
        headers,
        next: { revalidate: 60 },
      }, 3000);
      if (res.ok) return await res.json();
    } catch {
      // Optional enhancement; continue without it.
    }
  }

  return null;
}
