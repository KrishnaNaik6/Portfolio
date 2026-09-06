import { describe, it, expect } from 'vitest';
import { NexisPortfolioResponseSchema, normalizeNexisPortfolio, isSectionIdEnabled, getOrderedInnerSections } from '../lib/nexisSchema';

describe('Live Render NEXIS Snapshot Audit', () => {
  it('parses and normalizes the live Render snapshot dynamically', async () => {
    const res = await fetch('https://nexis-02is.onrender.com/api/v1/public/portfolio', {
      headers: {
        'X-Nexus-Api-Key': 'nx_app_ea6a9af6_a125bd4ce953cd697c052f03918a4e69ea3a9f515f3001f2',
      },
      cache: 'no-store',
    });

    expect(res.ok).toBe(true);
    const rawJson = await res.json();
    const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);
    expect(parseResult.success).toBe(true);

    if (parseResult.success) {
      const normalized = normalizeNexisPortfolio(parseResult.data);

      console.log(
        'Live NEXIS Sections from Render CMS:',
        normalized.sections.map((s) => `${s.id} (order: ${s.order}, enabled: ${s.enabled})`)
      );

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
  });
});
