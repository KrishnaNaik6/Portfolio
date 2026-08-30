import { describe, it, expect } from 'vitest';
import {
  normalizeNexisPortfolio,
  normalizeSectionId,
  isSectionIdEnabled,
  getOrderedInnerSections,
} from '../lib/nexisSchema';

describe('Authoritative Section Visibility & Ordering Test Suite', () => {
  // 1. All sections enabled
  it('handles all 10 canonical sections enabled in custom order', () => {
    const rawData = {
      sections: [
        { id: 'hero', label: 'Hero', enabled: true, order: 1 },
        { id: 'about', label: 'About Me', enabled: true, order: 2 },
        { id: 'education', label: 'Academic Background', enabled: true, order: 3 },
        { id: 'experience', label: 'Work Experience', enabled: true, order: 4 },
        { id: 'projects', label: 'Featured Projects', enabled: true, order: 5 },
        { id: 'skills', label: 'Technical Constellation', enabled: true, order: 6 },
        { id: 'interests', label: 'Interests', enabled: true, order: 7 },
        { id: 'github', label: 'GitHub Intelligence', enabled: true, order: 8 },
        { id: 'contact', label: 'Get In Touch', enabled: true, order: 9 },
        { id: 'footer', label: 'Footer', enabled: true, order: 10 },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    expect(normalized.sections.length).toBe(10);

    expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'education')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'experience')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'projects')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'skills')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'interests')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'github')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'contact')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'footer')).toBe(true);

    const inner = getOrderedInnerSections(normalized.sections);
    expect(inner.map((s) => s.id)).toEqual([
      'about',
      'education',
      'experience',
      'projects',
      'skills',
      'interests',
      'github',
      'contact',
    ]);
  });

  // 2. Individual sections disabled
  it('omits individual sections when enabled is false', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'education', enabled: false, order: 3 }, // DISABLED
        { id: 'experience', enabled: true, order: 4 },
        { id: 'projects', enabled: false, order: 5 }, // DISABLED
        { id: 'skills', enabled: true, order: 6 },
        { id: 'interests', enabled: false, order: 7 }, // DISABLED
        { id: 'github', enabled: false, order: 8 }, // DISABLED
        { id: 'contact', enabled: true, order: 9 },
        { id: 'footer', enabled: true, order: 10 },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    expect(isSectionIdEnabled(normalized.sections, 'education')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'projects')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'interests')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'github')).toBe(false);

    expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'experience')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'skills')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'contact')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'footer')).toBe(true);

    const inner = getOrderedInnerSections(normalized.sections);
    expect(inner.map((s) => s.id)).toEqual(['about', 'experience', 'skills', 'contact']);
  });

  // 3. Current Live NEXIS Response: ONLY Hero, About, Footer enabled
  it('strictly displays ONLY Hero, About Me, and Footer when only those 3 are enabled in NEXIS', () => {
    const currentNexisResponse = {
      publishedAt: '2026-08-30T10:00:00.000Z',
      profile: {
        fullName: 'Krishna Umesh Naik',
        headline: 'Full - Stack developer',
        bio: 'Crafting intelligent systems, full-stack web applications, and immersive digital experiences.',
      },
      sections: [
        { id: 'hero', label: 'Hero', enabled: true, order: 1 },
        { id: 'about', label: 'About Me', enabled: true, order: 2 },
        { id: 'education', label: 'Academic Background', enabled: false, order: 3 },
        { id: 'experience', label: 'Work Experience', enabled: false, order: 4 },
        { id: 'projects', label: 'Featured Projects', enabled: false, order: 5 },
        { id: 'skills', label: 'Technical Constellation', enabled: false, order: 6 },
        { id: 'interests', label: 'Interests', enabled: false, order: 7 },
        { id: 'github', label: 'GitHub Intelligence', enabled: false, order: 8 },
        { id: 'contact', label: 'Get In Touch', enabled: false, order: 9 },
        { id: 'footer', label: 'Footer', enabled: true, order: 10 },
      ],
      // Even if NEXIS payload contains records for other components, they MUST NOT be displayed
      education: [{ institution: 'Ramaiah', degree: 'B.E' }],
      experience: [{ company: 'Intelligent Development', position: 'Intern' }],
      projects: [{ name: 'MehendiAura' }],
      skills: [{ name: 'Python', category: 'Programming & Development' }],
    };

    const normalized = normalizeNexisPortfolio(currentNexisResponse);

    // Hero and Footer should be enabled
    expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'footer')).toBe(true);

    // About should be enabled
    expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(true);

    // ALL OTHER SECTIONS MUST BE DISABLED
    expect(isSectionIdEnabled(normalized.sections, 'education')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'experience')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'projects')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'skills')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'interests')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'github')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'contact')).toBe(false);

    // Inner rendered list contains ONLY 'about'
    const inner = getOrderedInnerSections(normalized.sections);
    expect(inner.length).toBe(1);
    expect(inner[0].id).toBe('about');
  });

  // 4. Multiple sections omitted from sections array entirely
  it('omits sections that are completely absent from the sections array', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'footer', enabled: true, order: 3 },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    expect(normalized.sections.length).toBe(3);

    expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'footer')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'projects')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'skills')).toBe(false);

    const inner = getOrderedInnerSections(normalized.sections);
    expect(inner.map((s) => s.id)).toEqual(['about']);
  });

  // 5. Section ordering
  it('orders inner sections strictly according to their order property regardless of input order', () => {
    const rawData = {
      sections: [
        { id: 'contact', enabled: true, order: 20 },
        { id: 'skills', enabled: true, order: 10 },
        { id: 'about', enabled: true, order: 5 },
        { id: 'projects', enabled: true, order: 15 },
        { id: 'experience', enabled: true, order: 8 },
      ],
    };

    const normalized = normalizeNexisPortfolio(rawData);
    const inner = getOrderedInnerSections(normalized.sections);
    expect(inner.map((s) => s.id)).toEqual(['about', 'experience', 'skills', 'projects', 'contact']);
  });

  // 6. Missing optional data safely handled
  it('safely normalizes payloads missing optional fields without crashing', () => {
    const minimalData = {
      publishedAt: '2026-08-30T00:00:00Z',
      profile: { fullName: 'Krishna Naik' },
      sections: [{ id: 'hero', enabled: true, order: 1 }],
    };

    const normalized = normalizeNexisPortfolio(minimalData);
    expect(normalized.details.profile?.fullName).toBe('Krishna Naik');
    expect(normalized.details.education).toEqual([]);
    expect(normalized.details.experience).toEqual([]);
    expect(normalized.projects).toEqual([]);
    expect(normalized.details.skills.Technical).toEqual({});
    expect(normalized.details.skills['Soft Skills']).toBeUndefined();
    expect(normalized.details.achievements).toEqual([]);
    expect(normalized.sections.length).toBe(1);
    expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(true);
    expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(false);
  });

  // 7. API Failure / empty object handling
  it('handles completely empty data safely', () => {
    const normalized = normalizeNexisPortfolio({});
    expect(normalized.sections).toEqual([]);
    expect(isSectionIdEnabled(normalized.sections, 'hero')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'about')).toBe(false);
    expect(isSectionIdEnabled(normalized.sections, 'footer')).toBe(false);
    expect(getOrderedInnerSections(normalized.sections)).toEqual([]);
  });

  // 8. Canonical Section ID normalization
  it('normalizes alias IDs to standard canonical IDs', () => {
    expect(normalizeSectionId('interest')).toBe('interests');
    expect(normalizeSectionId('interests')).toBe('interests');
    expect(normalizeSectionId('git-stats')).toBe('github');
    expect(normalizeSectionId('github-intelligence')).toBe('github');
    expect(normalizeSectionId('git_stats')).toBe('github');
    expect(normalizeSectionId('github')).toBe('github');
    expect(normalizeSectionId('ABOUT')).toBe('about');
    expect(normalizeSectionId('Hero')).toBe('hero');
  });
});
