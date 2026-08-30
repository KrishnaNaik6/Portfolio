import { describe, it, expect } from 'vitest';
import {
  normalizeNexisPortfolio,
  normalizeSectionId,
  isSectionEnabled,
  getOrderedBodySections,
  validateSections,
  VALID_CANONICAL_SECTION_IDS,
} from '../lib/sectionConfig';

describe('Authoritative Section Visibility & Ordering Comprehensive Test Suite', () => {
  // Scenario A: All sections enabled
  it('Scenario A: All sections enabled -> all 10 canonical sections render', () => {
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

    const { validSections } = validateSections(rawData.sections);
    expect(validSections.length).toBe(10);

    for (const sectionId of VALID_CANONICAL_SECTION_IDS) {
      expect(isSectionEnabled(validSections, sectionId)).toBe(true);
    }

    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).toEqual([
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

  // Scenario B: github.enabled = false
  it('Scenario B: github.enabled = false -> GitHub Intelligence does NOT render', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'education', enabled: true, order: 3 },
        { id: 'experience', enabled: true, order: 4 },
        { id: 'projects', enabled: true, order: 5 },
        { id: 'skills', enabled: true, order: 6 },
        { id: 'interests', enabled: true, order: 7 },
        { id: 'github', enabled: false, order: 8 }, // DISABLED
        { id: 'contact', enabled: true, order: 9 },
        { id: 'footer', enabled: true, order: 10 },
      ],
    };

    const { validSections } = validateSections(rawData.sections);
    expect(isSectionEnabled(validSections, 'github')).toBe(false);
    expect(isSectionEnabled(validSections, 'git-stats')).toBe(false);

    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).not.toContain('github');
    expect(bodySections.map((s) => s.id)).toContain('contact');
  });

  // Scenario C: contact.enabled = false
  it('Scenario C: contact.enabled = false -> Get In Touch does NOT render', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'education', enabled: true, order: 3 },
        { id: 'experience', enabled: true, order: 4 },
        { id: 'projects', enabled: true, order: 5 },
        { id: 'skills', enabled: true, order: 6 },
        { id: 'interests', enabled: true, order: 7 },
        { id: 'github', enabled: true, order: 8 },
        { id: 'contact', enabled: false, order: 9 }, // DISABLED
        { id: 'footer', enabled: true, order: 10 },
      ],
    };

    const { validSections } = validateSections(rawData.sections);
    expect(isSectionEnabled(validSections, 'contact')).toBe(false);

    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).not.toContain('contact');
    expect(bodySections.map((s) => s.id)).toContain('github');
  });

  // Scenario D: Both github and contact disabled
  it('Scenario D: Both github and contact disabled -> neither renders', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'education', enabled: true, order: 3 },
        { id: 'experience', enabled: true, order: 4 },
        { id: 'projects', enabled: true, order: 5 },
        { id: 'skills', enabled: true, order: 6 },
        { id: 'interests', enabled: true, order: 7 },
        { id: 'github', enabled: false, order: 8 }, // DISABLED
        { id: 'contact', enabled: false, order: 9 }, // DISABLED
        { id: 'footer', enabled: true, order: 10 },
      ],
    };

    const { validSections } = validateSections(rawData.sections);
    expect(isSectionEnabled(validSections, 'github')).toBe(false);
    expect(isSectionEnabled(validSections, 'contact')).toBe(false);

    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).not.toContain('github');
    expect(bodySections.map((s) => s.id)).not.toContain('contact');
    expect(bodySections.map((s) => s.id)).toEqual([
      'about',
      'education',
      'experience',
      'projects',
      'skills',
      'interests',
    ]);
  });

  // Scenario E: Random multiple sections disabled
  it('Scenario E: Random multiple sections disabled -> only enabled sections render', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'education', enabled: false, order: 3 }, // DISABLED
        { id: 'experience', enabled: true, order: 4 },
        { id: 'projects', enabled: false, order: 5 }, // DISABLED
        { id: 'skills', enabled: false, order: 6 }, // DISABLED
        { id: 'interests', enabled: false, order: 7 }, // DISABLED
        { id: 'github', enabled: false, order: 8 }, // DISABLED
        { id: 'contact', enabled: false, order: 9 }, // DISABLED
        { id: 'footer', enabled: true, order: 10 },
      ],
    };

    const { validSections } = validateSections(rawData.sections);
    expect(isSectionEnabled(validSections, 'hero')).toBe(true);
    expect(isSectionEnabled(validSections, 'about')).toBe(true);
    expect(isSectionEnabled(validSections, 'experience')).toBe(true);
    expect(isSectionEnabled(validSections, 'footer')).toBe(true);

    expect(isSectionEnabled(validSections, 'education')).toBe(false);
    expect(isSectionEnabled(validSections, 'projects')).toBe(false);
    expect(isSectionEnabled(validSections, 'skills')).toBe(false);
    expect(isSectionEnabled(validSections, 'interests')).toBe(false);
    expect(isSectionEnabled(validSections, 'github')).toBe(false);
    expect(isSectionEnabled(validSections, 'contact')).toBe(false);

    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).toEqual(['about', 'experience']);
  });

  // Scenario F: Section missing from API
  it('Scenario F: Section missing from API -> does not render', () => {
    const rawData = {
      sections: [
        { id: 'hero', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'footer', enabled: true, order: 10 },
      ],
    };

    const { validSections } = validateSections(rawData.sections);
    expect(isSectionEnabled(validSections, 'education')).toBe(false);
    expect(isSectionEnabled(validSections, 'experience')).toBe(false);
    expect(isSectionEnabled(validSections, 'projects')).toBe(false);
    expect(isSectionEnabled(validSections, 'skills')).toBe(false);
    expect(isSectionEnabled(validSections, 'interests')).toBe(false);
    expect(isSectionEnabled(validSections, 'github')).toBe(false);
    expect(isSectionEnabled(validSections, 'contact')).toBe(false);

    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).toEqual(['about']);
  });

  // Scenario G: Sections reordered
  it('Scenario G: Sections reordered -> UI follows NEXIS order strictly', () => {
    const rawData = {
      sections: [
        { id: 'contact', enabled: true, order: 2 },
        { id: 'skills', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 5 },
        { id: 'projects', enabled: true, order: 3 },
      ],
    };

    const { validSections } = validateSections(rawData.sections);
    const bodySections = getOrderedBodySections(validSections);
    expect(bodySections.map((s) => s.id)).toEqual(['skills', 'contact', 'projects', 'about']);
  });

  // Scenario H: Development-time warning detection
  it('Scenario H: Detects unknown section IDs, duplicates, and duplicate orders', () => {
    const rawData = {
      sections: [
        { id: 'custom_unknown_widget', enabled: true, order: 1 },
        { id: 'about', enabled: true, order: 2 },
        { id: 'about', enabled: true, order: 2 }, // Duplicate ID and duplicate order
      ],
    };

    const { validSections, warnings } = validateSections(rawData.sections);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes('Unknown section ID'))).toBe(true);
    expect(warnings.some((w) => w.includes('Duplicate section ID'))).toBe(true);
    expect(validSections.length).toBe(2);
  });
});
