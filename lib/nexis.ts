import {
  NexisPortfolioResponseSchema,
  normalizeNexisPortfolio,
  NormalizedNexisData,
} from './nexisSchema';

/**
 * Server-Side NEXIS API Client
 *
 * Fetches published portfolio data from the NEXIS API.
 * Uses cache: 'no-store' so newly enabled/disabled sections are reflected immediately after publication.
 * The API key is strictly accessed via server-side process.env and never exposed to the client.
 */
export async function fetchNexisPortfolio(): Promise<NormalizedNexisData | null> {
  const apiUrl = process.env.NEXIS_API_URL || 'https://nexis-02is.onrender.com';
  const apiKey = process.env.NEXIS_API_KEY;

  const baseUrl = apiUrl.replace(/\/$/, '');
  const candidateEndpoints = [
    `${baseUrl}/api/v1/public/portfolio`,
    `${baseUrl}/api/v1/portfolio/published`,
    `${baseUrl}/api/v1/portfolio`,
    `${baseUrl}/api/public/portfolio`,
    `${baseUrl}/api/portfolio`,
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
      const res = await fetch(endpoint, {
        headers,
        cache: 'no-store',
      });

      if (!res.ok) {
        console.warn(`[NEXIS Client] ${endpoint} returned HTTP status ${res.status}`);
        continue;
      }

      const rawJson = await res.json();
      const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);

      if (!parseResult.success) {
        console.error(`[NEXIS Client] Validation failed on ${endpoint}:`, parseResult.error.format());
        return null;
      }

      console.log(`[NEXIS Client] Successfully fetched live portfolio data from ${endpoint}`);
      return normalizeNexisPortfolio(parseResult.data);
    } catch (err: any) {
      console.warn(`[NEXIS Client] Connection failed on ${endpoint}:`, err?.message || 'Network error');
    }
  }

  console.warn('[NEXIS Client] All candidate portfolio endpoints returned non-200 or could not be reached.');
  return null;
}

/**
 * Fetches GitHub Intelligence and contribution analytics from NEXIS API
 */
export async function fetchNexisGitHubIntelligence(year?: number | string): Promise<any | null> {
  const apiUrl = process.env.NEXIS_API_URL || 'https://nexis-02is.onrender.com';
  const apiKey = process.env.NEXIS_API_KEY;

  const baseUrl = apiUrl.replace(/\/$/, '');
  const query = year ? `?year=${year}` : '';
  const candidateEndpoints = [
    `${baseUrl}/api/v1/public/portfolio/github-intelligence${query}`,
    `${baseUrl}/api/v1/public/github/intelligence${query}`,
    `${baseUrl}/api/v1/github/intelligence${query}`,
    `${baseUrl}/api/github/intelligence${query}`,
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
      const res = await fetch(endpoint, {
        headers,
        cache: 'no-store',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Continue to next candidate
    }
  }

  return null;
}
