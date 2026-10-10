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
    // Verified contract for NEXIS AppAuthGuard
    headers['X-Nexus-Api-Key'] = apiKey;
  }

  return headers;
}

export type PortfolioFetchStatus =
  | 'published'
  | 'unauthorized'
  | 'forbidden'
  | 'not-found'
  | 'error'
  | 'not-configured';

export type PortfolioFetchSource = 'cache' | 'network';

export interface PortfolioFetchResult {
  status: PortfolioFetchStatus;
  data: NormalizedNexisData | null;
  source?: PortfolioFetchSource;
  statusCode?: number;
  correlationId?: string | null;
  errorCategory?: string;
  errorMessage?: string;
  schemaSuccess?: boolean;
  envelopeType?: 'wrapped' | 'direct' | 'unknown';
  rawSectionCount?: number;
  rawEnabledSectionCount?: number;
  hasRawSectionsField?: boolean;
  normalizedSectionCount?: number;
  hasDetails?: boolean;
}

export async function fetchNexisPortfolioResult(): Promise<PortfolioFetchResult> {
  const now = Date.now();
  if (cachedPortfolioSnapshot && now - cachedPortfolioTimestamp < CACHE_TTL_MS) {
    const enabledSections = cachedPortfolioSnapshot.sections?.filter((s) => s.enabled) ?? [];
    return {
      status: 'published',
      data: cachedPortfolioSnapshot,
      source: 'cache',
      statusCode: 200,
      schemaSuccess: true,
      envelopeType: 'wrapped',
      rawSectionCount: cachedPortfolioSnapshot.sections?.length ?? 0,
      rawEnabledSectionCount: enabledSections.length,
      hasRawSectionsField: true,
      normalizedSectionCount: enabledSections.length,
      hasDetails: Boolean(cachedPortfolioSnapshot.details && cachedPortfolioSnapshot.details.profile),
    };
  }

  const { apiUrl, apiKey } = getNexisConfig();
  if (!apiUrl) {
    console.warn('[NEXIS Client] NEXIS_API_URL is not configured.');
    cachedPortfolioSnapshot = null;
    cachedPortfolioTimestamp = 0;
    return {
      status: 'not-configured',
      data: null,
      source: 'network',
      errorCategory: 'missing_configuration',
      errorMessage: 'NEXIS_API_URL is not configured',
      schemaSuccess: false,
      hasDetails: false,
      normalizedSectionCount: 0,
    };
  }

  const endpoint = `${apiUrl}/api/v1/public/portfolio`;
  const headers = getNexisHeaders(apiKey);

  try {
    const res = await fetchWithTimeout(endpoint, {
      headers,
      next: { revalidate: 30 },
    });

    const correlationId =
      typeof res.headers?.get === 'function'
        ? res.headers.get('x-correlation-id') || res.headers.get('x-request-id')
        : null;

    if (!res.ok) {
      let category = 'upstream_error';
      let statusType: PortfolioFetchStatus = 'error';

      if (res.status === 401) {
        category = 'unauthorized';
        statusType = 'unauthorized';
      } else if (res.status === 403) {
        category = 'forbidden';
        statusType = 'forbidden';
      } else if (res.status === 404) {
        category = 'not_found';
        statusType = 'not-found';
      }

      console.warn(
        `[NEXIS Client] Upstream portfolio fetch failed: status=${res.status}, correlationId=${correlationId || 'none'}, category=${category}`
      );

      // Invalidate cache immediately on 401/403/404/5xx so stale data is never served
      cachedPortfolioSnapshot = null;
      cachedPortfolioTimestamp = 0;

      return {
        status: statusType,
        data: null,
        source: 'network',
        statusCode: res.status,
        correlationId,
        errorCategory: category,
        errorMessage: `Upstream HTTP ${res.status}`,
        schemaSuccess: false,
        hasDetails: false,
        normalizedSectionCount: 0,
      };
    }

    const rawJson = await res.json();

    // Inspect raw structure for diagnostics
    let envelopeType: 'wrapped' | 'direct' | 'unknown' = 'unknown';
    let rawSectionCount = 0;
    let rawEnabledSectionCount = 0;
    let hasRawSectionsField = false;

    if (typeof rawJson === 'object' && rawJson !== null) {
      if ('data' in rawJson && typeof (rawJson as any).data === 'object' && (rawJson as any).data !== null) {
        envelopeType = 'wrapped';
        const inner = (rawJson as any).data;
        if (Array.isArray(inner.sections)) {
          hasRawSectionsField = true;
          rawSectionCount = inner.sections.length;
          rawEnabledSectionCount = inner.sections.filter((s: any) => s && s.enabled !== false).length;
        }
      } else {
        envelopeType = 'direct';
        const direct = rawJson as any;
        if (Array.isArray(direct.sections)) {
          hasRawSectionsField = true;
          rawSectionCount = direct.sections.length;
          rawEnabledSectionCount = direct.sections.filter((s: any) => s && s.enabled !== false).length;
        }
      }
    }

    if (typeof rawJson === 'object' && rawJson !== null && (rawJson as any).success === false) {
      console.warn(
        `[NEXIS Client] Upstream returned explicit failure envelope on ${endpoint} (correlationId=${correlationId || 'none'}):`,
        (rawJson as any).error || 'success: false'
      );
      cachedPortfolioSnapshot = null;
      cachedPortfolioTimestamp = 0;
      return {
        status: 'error',
        data: null,
        source: 'network',
        statusCode: res.status,
        correlationId,
        errorCategory: 'upstream_error',
        errorMessage:
          typeof (rawJson as any).error === 'string'
            ? (rawJson as any).error
            : (rawJson as any).error?.message || 'Upstream returned failure envelope',
        schemaSuccess: false,
        envelopeType,
        rawSectionCount,
        rawEnabledSectionCount,
        hasRawSectionsField,
        normalizedSectionCount: 0,
        hasDetails: false,
      };
    }

    const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);
    if (!parseResult.success) {
      console.error(
        `[NEXIS Client] Portfolio schema validation failed on ${endpoint} (correlationId=${correlationId || 'none'}):`,
        parseResult.error
      );
      cachedPortfolioSnapshot = null;
      cachedPortfolioTimestamp = 0;
      return {
        status: 'error',
        data: null,
        source: 'network',
        statusCode: res.status,
        correlationId,
        errorCategory: 'schema_validation_failed',
        errorMessage: 'Validation failed on upstream payload',
        schemaSuccess: false,
        envelopeType,
        rawSectionCount,
        rawEnabledSectionCount,
        hasRawSectionsField,
        normalizedSectionCount: 0,
        hasDetails: false,
      };
    }

    const normalized = normalizeNexisPortfolio(parseResult.data);
    const hasDetails = Boolean(normalized.details && normalized.details.profile);
    const enabledSections = normalized.sections?.filter((s) => s.enabled) ?? [];
    const normalizedSectionCount = enabledSections.length;

    // Validate usability before caching: must have details and at least one enabled section
    if (hasDetails && normalizedSectionCount > 0) {
      cachedPortfolioSnapshot = normalized;
      cachedPortfolioTimestamp = Date.now();
      return {
        status: 'published',
        data: normalized,
        source: 'network',
        statusCode: res.status,
        correlationId,
        schemaSuccess: true,
        envelopeType,
        rawSectionCount,
        rawEnabledSectionCount,
        hasRawSectionsField,
        normalizedSectionCount,
        hasDetails,
      };
    }

    // Do NOT cache invalid or empty snapshots
    cachedPortfolioSnapshot = null;
    cachedPortfolioTimestamp = 0;

    let errorCategory = 'empty_sections';
    if (!hasRawSectionsField) {
      errorCategory = 'missing_sections';
    } else if (!hasDetails) {
      errorCategory = 'missing_details';
    }

    return {
      status: 'published',
      data: normalized,
      source: 'network',
      statusCode: res.status,
      correlationId,
      errorCategory,
      errorMessage: 'Portfolio snapshot contains zero usable sections or missing details',
      schemaSuccess: true,
      envelopeType,
      rawSectionCount,
      rawEnabledSectionCount,
      hasRawSectionsField,
      normalizedSectionCount,
      hasDetails,
    };
  } catch (err) {
    console.warn(
      `[NEXIS Client] Portfolio fetch connection failed on ${endpoint}:`,
      err instanceof Error ? err.message : 'Unknown error'
    );
    cachedPortfolioSnapshot = null;
    cachedPortfolioTimestamp = 0;
    return {
      status: 'error',
      data: null,
      source: 'network',
      errorCategory: 'network_or_timeout_error',
      errorMessage: err instanceof Error ? err.message : 'Network error',
      schemaSuccess: false,
      hasDetails: false,
      normalizedSectionCount: 0,
    };
  }
}

export async function fetchNexisPortfolio(): Promise<NormalizedNexisData | null> {
  const result = await fetchNexisPortfolioResult();
  return result.data;
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
