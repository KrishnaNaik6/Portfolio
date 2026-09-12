import {
  NexisPortfolioResponseSchema,
  normalizeNexisPortfolio,
  NormalizedNexisData,
} from './nexisSchema';

let cachedPortfolioSnapshot: NormalizedNexisData | null = null;
let cachedPortfolioTimestamp = 0;
const CACHE_TTL_MS = 30 * 1000;
const REQUEST_TIMEOUT_MS = 3500;

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
  const apiUrl = (process.env.NEXIS_API_URL || '').trim();
  const apiKey = (process.env.NEXIS_API_KEY || '').trim();
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
    headers.Authorization = apiKey.startsWith('Bearer ') ? apiKey : `Bearer ${apiKey}`;
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

  const candidateEndpoints = [
    `${apiUrl}/api/v1/public/portfolio`,
    `${apiUrl}/api/v1/portfolio/published`,
    `${apiUrl}/api/v1/portfolio`,
  ];
  const headers = getNexisHeaders(apiKey);

  for (const endpoint of candidateEndpoints) {
    try {
      const res = await fetchWithTimeout(endpoint, {
        headers,
        next: { revalidate: 30 },
      });

      if (!res.ok) {
        console.warn(`[NEXIS Client] ${endpoint} returned HTTP ${res.status}`);
        continue;
      }

      const rawJson = await res.json();
      const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);
      if (!parseResult.success) {
        console.error(`[NEXIS Client] Validation failed on ${endpoint}`);
        continue;
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
  }

  if (cachedPortfolioSnapshot) {
    console.log('[NEXIS Client] Serving last known cached snapshot');
  }
  return cachedPortfolioSnapshot;
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
