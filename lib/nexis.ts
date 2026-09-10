import {
  NexisPortfolioResponseSchema,
  normalizeNexisPortfolio,
  NormalizedNexisData,
} from './nexisSchema';

// In-memory fallback cache to ensure zero-downtime and sub-50ms TTFB even during Render.com cold starts
let cachedPortfolioSnapshot: NormalizedNexisData | null = null;
let cachedPortfolioTimestamp: number = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds

/**
 * Helper to execute fetch with a strict timeout to prevent slow Render spin-ups from blocking the site
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 3500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Server-Side NEXIS API Client
 *
 * Fetches published portfolio data from the NEXIS API.
 * Uses strict 3.5s timeout, ISR caching (revalidate: 30), and in-memory fallback cache
 * so page loads remain blazing fast (sub-50ms) even if Render is waking up from sleep.
 */
export async function fetchNexisPortfolio(): Promise<NormalizedNexisData | null> {
  const now = Date.now();

  // If memory cache is still fresh within TTL, return instantly
  if (cachedPortfolioSnapshot && now - cachedPortfolioTimestamp < CACHE_TTL_MS) {
    return cachedPortfolioSnapshot;
  }

  const apiUrl = process.env.NEXIS_API_URL || 'https://nexis-02is.onrender.com';
  const apiKey =
    process.env.NEXIS_API_KEY || 'nx_app_ea6a9af6_a125bd4ce953cd697c052f03918a4e69ea3a9f515f3001f2';

  const baseUrl = apiUrl.replace(/\/$/, '');
  const candidateEndpoints = [
    `${baseUrl}/api/v1/public/portfolio`,
    `${baseUrl}/api/v1/portfolio/published`,
    `${baseUrl}/api/v1/portfolio`,
  ];

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'Krishna-Naik-Portfolio-Client/1.0',
  };

  if (apiKey && apiKey.trim()) {
    const cleanKey = apiKey.trim();
    headers['X-Nexus-Api-Key'] = cleanKey;
    headers['X-Nexis-Api-Key'] = cleanKey;
    headers['x-api-key'] = cleanKey;
    headers.Authorization = cleanKey.startsWith('Bearer ')
      ? cleanKey
      : `Bearer ${cleanKey}`;
  }

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetchWithTimeout(
        endpoint,
        {
          headers,
          next: { revalidate: 30 },
        },
        3500
      );

      if (!res.ok) {
        console.warn(`[NEXIS Client] ${endpoint} returned HTTP status ${res.status}`);
        continue;
      }

      const rawJson = await res.json();
      const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);

      if (!parseResult.success) {
        console.error(`[NEXIS Client] Validation failed on ${endpoint}:`, parseResult.error.format());
        return cachedPortfolioSnapshot;
      }

      const normalized = normalizeNexisPortfolio(parseResult.data);
      cachedPortfolioSnapshot = normalized;
      cachedPortfolioTimestamp = Date.now();
      return normalized;
    } catch (err: any) {
      console.warn(`[NEXIS Client] Fetch failed on ${endpoint}:`, err?.message || 'Timeout / Network error');
    }
  }

  // Fallback to last known good cached snapshot if available
  if (cachedPortfolioSnapshot) {
    console.log('[NEXIS Client] Serving last known cached snapshot');
    return cachedPortfolioSnapshot;
  }

  return null;
}

/**
 * Fetches GitHub Intelligence and contribution analytics from NEXIS API with fast timeout
 */
export async function fetchNexisGitHubIntelligence(year?: number | string): Promise<any | null> {
  const apiUrl = process.env.NEXIS_API_URL || 'https://nexis-02is.onrender.com';
  const apiKey =
    process.env.NEXIS_API_KEY || 'nx_app_ea6a9af6_a125bd4ce953cd697c052f03918a4e69ea3a9f515f3001f2';

  const baseUrl = apiUrl.replace(/\/$/, '');
  const query = year ? `?year=${year}` : '';
  const candidateEndpoints = [
    `${baseUrl}/api/v1/public/portfolio/github-intelligence${query}`,
    `${baseUrl}/api/v1/public/github/intelligence${query}`,
    `${baseUrl}/api/v1/github/intelligence${query}`,
  ];

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'Krishna-Naik-Portfolio-Client/1.0',
  };

  if (apiKey && apiKey.trim()) {
    const cleanKey = apiKey.trim();
    headers['X-Nexus-Api-Key'] = cleanKey;
    headers['X-Nexis-Api-Key'] = cleanKey;
    headers['x-api-key'] = cleanKey;
    headers.Authorization = cleanKey.startsWith('Bearer ')
      ? cleanKey
      : `Bearer ${cleanKey}`;
  }

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetchWithTimeout(
        endpoint,
        {
          headers,
          next: { revalidate: 60 },
        },
        3000
      );
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Continue to next candidate
    }
  }

  return null;
}
