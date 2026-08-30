import { SectionConfig } from './types';

export const VALID_CANONICAL_SECTION_IDS = [
  'hero',
  'about',
  'education',
  'experience',
  'projects',
  'skills',
  'interests',
  'github',
  'contact',
  'footer',
] as const;

export type CanonicalSectionId = (typeof VALID_CANONICAL_SECTION_IDS)[number];

/**
 * Normalizes any section ID string to its exact canonical ID.
 */
export function normalizeSectionId(id: string): CanonicalSectionId | string {
  if (!id) return '';
  const lower = id.toLowerCase().trim();
  if (lower === 'interest' || lower === 'interests') return 'interests';
  if (
    lower === 'git-stats' ||
    lower === 'git_stats' ||
    lower === 'github' ||
    lower === 'github-intelligence' ||
    lower === 'githubintelligence'
  ) {
    return 'github';
  }
  return lower;
}

/**
 * Development-time validation that detects:
 * - Unknown section IDs
 * - Duplicate section IDs
 * - Duplicate section display orders
 */
export function validateSections(rawSections: any[]): {
  validSections: SectionConfig[];
  warnings: string[];
} {
  const warnings: string[] = [];
  if (!Array.isArray(rawSections)) {
    return { validSections: [], warnings: ['Sections payload is not an array.'] };
  }

  const seenIds = new Set<string>();
  const seenOrders = new Set<number>();
  const validSections: SectionConfig[] = [];

  for (const raw of rawSections) {
    if (!raw || typeof raw !== 'object') continue;
    if (typeof raw.id !== 'string') {
      warnings.push(`Section without valid string ID encountered: ${JSON.stringify(raw)}`);
      continue;
    }

    const canonical = normalizeSectionId(raw.id);

    // 1. Check for unknown section ID
    if (!VALID_CANONICAL_SECTION_IDS.includes(canonical as CanonicalSectionId)) {
      warnings.push(`[SectionConfig Warning] Unknown section ID detected: "${raw.id}" (normalized: "${canonical}")`);
    }

    // 2. Check for duplicate section ID
    if (seenIds.has(canonical)) {
      warnings.push(`[SectionConfig Warning] Duplicate section ID detected: "${raw.id}"`);
      continue; // Skip duplicate instance
    }
    seenIds.add(canonical);

    // 3. Check for duplicate order
    const order = typeof raw.order === 'number' ? raw.order : 999;
    if (seenOrders.has(order) && raw.enabled === true) {
      warnings.push(`[SectionConfig Warning] Duplicate display order detected: order ${order} for section "${raw.id}"`);
    } else if (raw.enabled === true) {
      seenOrders.add(order);
    }

    // 4. Strict enabled filter
    if (raw.enabled === true) {
      validSections.push({
        id: canonical,
        label: raw.label || raw.id,
        enabled: true,
        order,
      });
    }
  }

  // Sort strictly ascending by order
  validSections.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    warnings.forEach((w) => console.warn(w));
  }

  return { validSections, warnings };
}

/**
 * Checks whether a specific canonical section is enabled in the sections list.
 * Single authoritative source of truth:
 * - Requires exact section matching
 * - Requires enabled === true
 * - Returns false if missing, undefined, null, or enabled !== true
 */
export function isSectionEnabled(
  sections: SectionConfig[] | undefined | null,
  targetId: CanonicalSectionId | string
): boolean {
  if (!sections || !Array.isArray(sections) || sections.length === 0) {
    return false;
  }
  const canonicalTarget = normalizeSectionId(targetId);
  return sections.some(
    (s) => normalizeSectionId(s.id) === canonicalTarget && s.enabled === true
  );
}

/**
 * Returns strictly enabled inner body sections (excluding hero and footer),
 * sorted by order ascending.
 */
export function getOrderedBodySections(
  sections: SectionConfig[] | undefined | null
): SectionConfig[] {
  if (!sections || !Array.isArray(sections)) return [];
  return sections
    .filter((s) => {
      const canonical = normalizeSectionId(s.id);
      return s.enabled === true && canonical !== 'hero' && canonical !== 'footer';
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Development-only debug logger showing:
 * API section ID -> enabled in NEXIS -> rendered
 */
export function debugSectionSync(sections: SectionConfig[] | undefined | null): void {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const summary = VALID_CANONICAL_SECTION_IDS.map((id) => {
      const isEnabled = isSectionEnabled(sections, id);
      const found = sections?.find((s) => normalizeSectionId(s.id) === id);
      return {
        'Section ID': id,
        'Enabled in NEXIS': isEnabled,
        'Order': found?.order ?? '-',
        'Render Status': isEnabled
          ? `✅ Rendered (${id})`
          : '🚫 [NOT RENDERED]',
      };
    });

    console.groupCollapsed('[NEXIS Section Synchronization Status]');
    console.table(summary);
    console.groupEnd();
  }
}
