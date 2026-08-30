import { describe, it, expect } from 'vitest';
import { NexisPortfolioResponseSchema, normalizeNexisPortfolio, isSectionIdEnabled, getOrderedInnerSections } from '../lib/nexisSchema';

describe('Live Render NEXIS Snapshot Audit', () => {
  it('parses and normalizes the live Render snapshot with 8 sections', async () => {
    const res = await fetch('https://nexis-02is.onrender.com/api/v1/public/portfolio', {
      headers: {
        'X-Nexus-Api-Key': 'nx_app_ea6a9af6_a125bd4ce953cd697c052f03918a4e69ea3a9f515f3001f2',
      },
    });

    expect(res.ok).toBe(true);
    const rawJson = await res.json();
    const parseResult = NexisPortfolioResponseSchema.safeParse(rawJson);
    expect(parseResult.success).toBe(true);

    if (parseResult.success) {
      const normalized = normalizeNexisPortfolio(parseResult.data);

      console.log('Normalized Sections from Live API:', normalized.sections.map(s => `${s.id} (order: ${s.order}, enabled: ${s.enabled})`));

      // 1. Check Hero & Footer
      expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(true);
      expect(isSectionIdEnabled(normalized.sections, 'footer')).toBe(true);

      // 2. Check About, Education, Experience, Projects, Skills, Interests
      expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(true);
      expect(isSectionIdEnabled(normalized.sections, 'education')).toBe(true);
      expect(isSectionIdEnabled(normalized.sections, 'experience')).toBe(true);
      expect(isSectionIdEnabled(normalized.sections, 'projects')).toBe(true);
      expect(isSectionIdEnabled(normalized.sections, 'skills')).toBe(true);
      expect(isSectionIdEnabled(normalized.sections, 'interests')).toBe(true);

      // 3. Specifically verify that GitHub Intelligence and Contact MUST BE DISABLED
      expect(isSectionIdEnabled(normalized.sections, 'github')).toBe(false);
      expect(isSectionIdEnabled(normalized.sections, 'contact')).toBe(false);

      const inner = getOrderedInnerSections(normalized.sections);
      expect(inner.map(s => s.id)).toEqual([
        'about',
        'education',
        'experience',
        'projects',
        'skills',
        'interests',
      ]);
      expect(inner.map(s => s.id)).not.toContain('github');
      expect(inner.map(s => s.id)).not.toContain('contact');
    }
  });
});
