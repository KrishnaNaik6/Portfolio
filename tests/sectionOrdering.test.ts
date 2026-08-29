import { describe, it, expect } from 'vitest';
import { normalizeNexisPortfolio } from '../lib/nexisSchema';

describe('CMS Section Ordering & Visibility Control', () => {
  it('filters out disabled sections (enabled: false)', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'education', enabled: false, order: 3 }, // DISABLED
        { id: 'experience', enabled: true, order: 4 },
        { id: 'skills', enabled: false, order: 5 }, // DISABLED
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    const enabledSectionIds = normalized.sections.map((s) => s.id);

    expect(enabledSectionIds).toContain('hero');
    expect(enabledSectionIds).toContain('about');
    expect(enabledSectionIds).toContain('experience');
    expect(enabledSectionIds).not.toContain('education');
    expect(enabledSectionIds).not.toContain('skills');
  });

  it('orders sections strictly according to the order field', () => {
    const rawData = {
      sections: [
        { id: 'contact', enabled: true, order: 10 },
        { id: 'skills', enabled: true, order: 2 },
        { id: 'about', enabled: true, order: 1 },
        { id: 'projects', enabled: true, order: 5 },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    const orderedIds = normalized.sections.map((s) => s.id);

    expect(orderedIds).toEqual(['about', 'skills', 'projects', 'contact']);
  });
});
