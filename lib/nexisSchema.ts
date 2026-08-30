import { z } from 'zod';
import {
  PortfolioDetails,
  ProjectItem,
  SectionConfig,
  EducationItem,
  ExperienceItem,
  SkillData,
  ContactInfo,
} from './types';

export type CanonicalSectionId =
  | 'hero'
  | 'about'
  | 'education'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'interests'
  | 'github'
  | 'contact'
  | 'footer';

/**
 * Maps incoming section IDs to their standard canonical IDs.
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
 * Checks whether a specific canonical section is enabled in the sections list.
 */
export function isSectionIdEnabled(
  sections: SectionConfig[] | undefined | null,
  targetId: string
): boolean {
  if (!sections || !Array.isArray(sections)) return false;
  const canonicalTarget = normalizeSectionId(targetId);
  return sections.some(
    (s) => normalizeSectionId(s.id) === canonicalTarget && s.enabled === true
  );
}

/**
 * Filters out hero and footer, returning only enabled inner sections sorted by order.
 */
export function getOrderedInnerSections(
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

export const NexisProfileSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  resumeUrl: z.string().nullable().optional(),
}).passthrough();

export const NexisSectionSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  enabled: z.boolean(),
  order: z.number().optional().default(999),
}).passthrough();

export const NexisProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  repoUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().optional().default(0),
  collabed: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
}).passthrough();

export const NexisExperienceSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().optional(),
  company: z.string(),
  position: z.string(),
  location: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().optional(),
  description: z.string().nullable().optional(),
  companyUrl: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export const NexisEducationSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().optional(),
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  status: z.string().optional().default('Completed'),
  completionYear: z.string().nullable().optional(),
  grade: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export const NexisSkillSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().optional(),
  name: z.string(),
  category: z.string(),
  proficiencyLevel: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export const NexisAchievementSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  awarder: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

export const NexisSocialLinkSchema = z.object({
  id: z.string().optional(),
  profileId: z.string().optional(),
  platform: z.string(),
  url: z.string(),
  username: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
}).passthrough();

const BaseNexisPayload = z.object({
  publishedAt: z.string().optional(),
  profile: NexisProfileSchema.optional(),
  sections: z.array(NexisSectionSchema).optional(),
  projects: z.array(NexisProjectSchema).optional(),
  experience: z.array(NexisExperienceSchema).optional(),
  education: z.array(NexisEducationSchema).optional(),
  skills: z.array(NexisSkillSchema).optional(),
  certifications: z.array(z.any()).optional(),
  achievements: z.array(NexisAchievementSchema).optional(),
  socialLinks: z.array(NexisSocialLinkSchema).optional(),
  interests: z.array(z.string()).optional(),
}).passthrough();

export const NexisPortfolioResponseSchema = z.union([
  z.object({
    success: z.boolean().optional(),
    data: BaseNexisPayload,
  }).passthrough(),
  BaseNexisPayload,
]);

export type NexisPortfolioRaw = z.infer<typeof NexisPortfolioResponseSchema>;

/**
 * Formats ISO / YYYY-MM-DD date strings into human-readable tenure (e.g. "Jul 2026 - Aug 2026")
 */
export function formatTenurePeriod(
  startDate?: string | null,
  endDate?: string | null,
  isCurrent?: boolean
): string {
  const formatMonthYear = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const start = startDate ? formatMonthYear(startDate) : '';
  const end = isCurrent ? 'Present' : endDate ? formatMonthYear(endDate) : '';

  if (!start && !end) return '';
  if (!start) return end;
  if (!end) return start;
  return `${start} - ${end}`;
}

export interface NormalizedNexisData {
  details: PortfolioDetails;
  projects: ProjectItem[];
  sections: SectionConfig[];
}

/**
 * Normalizes validated NEXIS API response into typed frontend structures without inventing dummy data.
 * Sections are strictly filtered to only those with enabled === true, mapped to canonical IDs, and sorted by order.
 */
export function normalizeNexisPortfolio(input: NexisPortfolioRaw): NormalizedNexisData {
  const data = 'data' in input && input.data && typeof input.data === 'object' ? (input.data as any) : input;

  // 1. Sections: strictly keep only items where enabled === true, normalize ID, and sort by order
  const rawSections: any[] = Array.isArray(data.sections) ? data.sections : [];
  const sections: SectionConfig[] = rawSections
    .filter((s: any) => s && typeof s.id === 'string' && s.enabled === true)
    .map((s: any) => ({
      id: normalizeSectionId(s.id),
      label: s.label || s.id,
      enabled: true,
      order: typeof s.order === 'number' ? s.order : 999,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // 2. Education: sort by displayOrder
  const education: EducationItem[] = (data.education || [])
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((e: any) => ({
      id: e.id,
      edu: e.fieldOfStudy ? `${e.degree} - ${e.fieldOfStudy}` : e.degree,
      college: e.institution,
      status: e.status || 'Completed',
      year: e.completionYear || (e.endDate ? e.endDate.substring(0, 4) : undefined),
      grade: e.grade,
    }));

  // 3. Experience: sort by displayOrder
  const experience: ExperienceItem[] = (data.experience || [])
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((exp: any) => {
      const works = exp.description
        ? exp.description
            .split('\n')
            .map((line: string) => line.trim())
            .filter((line: string) => line.length > 0)
        : [];

      return {
        id: exp.id,
        role: exp.position,
        company: exp.company,
        tenure_period: formatTenurePeriod(exp.startDate, exp.endDate, exp.isCurrent),
        works,
        companyUrl: exp.companyUrl || exp.link || null,
      };
    });

  // 4. Skills: categorize into Technical clusters and Soft Skills
  const technicalSkills: Record<string, Record<string, any>> = {};
  const softSkills: string[] = [];

  const sortedSkills = (data.skills || []).sort(
    (a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
  );

  sortedSkills.forEach((skill: any) => {
    if (skill.category === 'Soft Skills') {
      softSkills.push(skill.name);
    } else {
      if (!technicalSkills[skill.category]) {
        technicalSkills[skill.category] = {};
      }
      technicalSkills[skill.category][skill.name] = {
        proficiency: skill.proficiencyLevel,
      };
    }
  });

  const skills: SkillData = {
    Technical: technicalSkills,
    'Soft Skills': softSkills.length > 0 ? softSkills : undefined,
  };

  // 5. Contact info & Social Links
  const githubLink = data.socialLinks?.find(
    (s: any) => s.platform?.toLowerCase() === 'github'
  );
  const linkedinLink = data.socialLinks?.find(
    (s: any) => s.platform?.toLowerCase() === 'linkedin'
  );
  const instagramLink = data.socialLinks?.find(
    (s: any) => s.platform?.toLowerCase() === 'instagram'
  );

  const contact: ContactInfo = {
    msg: {
      Mail: data.profile?.email || '',
      Phone: data.profile?.phone || '',
    },
    follow: {
      Linkedin: linkedinLink?.url || '',
      Instagram: instagramLink?.url || '',
      Github: githubLink?.url || 'https://github.com/KrishnaNaik6',
    },
  };

  // 6. Achievements: format into display strings
  const achievements: string[] = (data.achievements || [])
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((a: any) => (a.description ? `${a.title}: ${a.description}` : a.title));

  // 7. Projects: sort by displayOrder and map links
  const projects: ProjectItem[] = (data.projects || [])
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((p: any, idx: number) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? null,
      link: {
        git: p.repoUrl || '',
        live: p.liveUrl ?? null,
      },
      collabed: p.collabed ?? false,
      type: p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : 'Project',
      featured: p.featured ?? (idx === 0),
      displayOrder: p.displayOrder ?? idx,
    }));

  const details: PortfolioDetails = {
    profile: data.profile
      ? {
          fullName: data.profile.fullName,
          headline: data.profile.headline,
          bio: data.profile.bio,
          location: data.profile.location,
          email: data.profile.email,
          phone: data.profile.phone,
          resumeUrl: data.profile.resumeUrl,
        }
      : undefined,
    education,
    experience,
    skills,
    interest: data.interests || [],
    contact,
    achievements,
    about: data.profile?.bio,
    sections,
    publishedAt: data.publishedAt,
  };

  return {
    details,
    projects,
    sections,
  };
}
