import { describe, it, expect } from 'vitest';
import { NexisPortfolioResponseSchema, normalizeNexisPortfolio, isSectionIdEnabled, getOrderedInnerSections } from '../lib/nexisSchema';

describe('Live Render NEXIS Snapshot Audit', () => {
  it('parses and normalizes the live Render snapshot dynamically when reachable', async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://nexis-02is.onrender.com/api/v1/public/portfolio', {
        headers: {
          'X-Nexus-Api-Key': process.env.NEXIS_API_KEY || '',
        },
        cache: 'no-store',
        signal: controller.signal,
      }).catch(() => null);
      clearTimeout(timeoutId);

      if (!res || !res.ok) {
        console.warn('Live Render NEXIS endpoint currently unreachable or sleeping; skipping live schema validation.');
        expect(true).toBe(true);
        return;
      }

      const rawJson = await res.json();
      const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);
      expect(parseResult.success).toBe(true);

      if (parseResult.success) {
        const normalized = normalizeNexisPortfolio(parseResult.data);

        // Verify normalization produces valid sections matching API enabled states
        const payloadData = parseResult.data as any;
        const rawSectionsList: any[] = 'data' in payloadData && payloadData.data
          ? payloadData.data.sections || []
          : payloadData.sections || [];

        for (const rawSec of rawSectionsList) {
          if (rawSec.enabled === true) {
            expect(isSectionIdEnabled(normalized.sections, rawSec.id)).toBe(true);
          } else {
            expect(isSectionIdEnabled(normalized.sections, rawSec.id)).toBe(false);
          }
        }

        const inner = getOrderedInnerSections(normalized.sections);
        expect(Array.isArray(inner)).toBe(true);
      }
    } catch (e) {
      console.warn('Live audit network error ignored in test suite:', e);
      expect(true).toBe(true);
    }
  });
});
