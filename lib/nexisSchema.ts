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

// -------------------------------------------------------------
// Existing NEXIS Portfolio Zod Validation Schemas
// -------------------------------------------------------------

export const NexisPillarSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  highlights: z.array(z.string()).optional(),
});

export const NexisProfileSchema = z.object({
  fullName: z.string().optional(),
  headline: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  resumeUrl: z.string().nullable().optional(),
  websiteUrl: z.string().nullable().optional(),
  welcomeGreeting: z.string().nullable().optional(),
  typewriterTexts: z.array(z.string()).optional(),
  pillars: z.array(NexisPillarSchema).optional(),
});

export const NexisExperienceSchema = z.object({
  id: z.string().optional(),
  position: z.string().optional(),
  role: z.string().optional(),
  company: z.string(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  isCurrent: z.boolean().optional(),
  tenure: z.string().optional(),
  description: z.string().optional(),
  works: z.array(z.string()).optional(),
  displayOrder: z.number().optional(),
  companyUrl: z.string().nullable().optional(),
});

export const NexisEducationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().optional(),
  edu: z.string().optional(),
  institution: z.string().optional(),
  college: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  status: z.string().optional(),
  grade: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
});

export const NexisSkillSchema = z.object({
  name: z.string(),
  category: z.string().optional().default('Other'),
  proficiencyLevel: z.string().optional(),
  displayOrder: z.number().optional(),
});

export const NexisProjectSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  title: z.string().optional(),
  description: z.string().nullable().optional(),
  repoUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  collabed: z.boolean().optional().default(false),
  type: z.string().optional().default('Project'),
  featured: z.boolean().optional().default(false),
  displayOrder: z.number().optional(),
  highlightLabel: z.string().nullable().optional(),
});

export const NexisSectionConfigSchema = z
  .object({
    id: z.string(),
    label: z.string().optional(),
    name: z.string().optional(),
    title: z.string().optional(),
    enabled: z.boolean().optional().default(true),
    order: z.number().optional(),
    displayOrder: z.number().optional(),
  })
  .passthrough();

export const NexisSocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string(),
  username: z.string().nullable().optional(),
});

export const NexisAchievementSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  displayOrder: z.number().optional(),
});

export const NexisConstellationMeshSchema = z.object({
  enabled: z.boolean().optional(),
  nodeDensity: z.number().optional(),
  interactive: z.boolean().optional(),
  categoryColors: z.record(z.string(), z.string()).optional(),
});

export const NexisPortfolioSnapshotSchema = z.object({
  profile: NexisProfileSchema.optional(),
  experiences: z.array(NexisExperienceSchema).optional().default([]),
  experience: z.array(NexisExperienceSchema).optional().default([]),
  education: z.array(NexisEducationSchema).optional().default([]),
  educations: z.array(NexisEducationSchema).optional().default([]),
  skills: z.array(NexisSkillSchema).optional().default([]),
  projects: z.array(NexisProjectSchema).optional().default([]),
  sections: z.array(NexisSectionConfigSchema).optional(),
  socialLinks: z.array(NexisSocialLinkSchema).optional().default([]),
  achievements: z.array(NexisAchievementSchema).optional().default([]),
  interests: z.array(z.string()).optional().default([]),
  aboutPillars: z.array(NexisPillarSchema).optional().default([]),
  constellationMeshConfig: NexisConstellationMeshSchema.optional(),
  welcomeGreeting: z.string().nullable().optional(),
  typewriterTexts: z.array(z.string()).optional(),
  publishedAt: z.string().optional(),
  githubIntelligence: z.any().optional(),
});

export const NexisPortfolioEnvelopeSchema = z
  .object({
    success: z.boolean().optional(),
    data: NexisPortfolioSnapshotSchema,
    timestamp: z.string().optional(),
    correlationId: z.string().optional(),
  })
  .passthrough();

export const NexisPortfolioResponseSchema = z.preprocess(
  (val) => {
    if (typeof val !== 'object' || val === null) return val;
    // Explicit failure envelope must NEVER be parsed as a direct snapshot
    if ('success' in val && (val as any).success === false) {
      return null;
    }
    // Wrapped data envelope
    if ('data' in val) {
      if (typeof (val as any).data === 'object' && (val as any).data !== null) {
        return (val as any).data;
      }
      return null;
    }
    // Direct snapshot
    return val;
  },
  NexisPortfolioSnapshotSchema
);

export interface NormalizedNexisData {
  details: PortfolioDetails;
  projects: ProjectItem[];
  sections: SectionConfig[];
}

export function formatTenurePeriod(
  startDate?: string | null,
  endDate?: string | null,
  isCurrent = false
): string {
  if (!startDate && !endDate && !isCurrent) return '';
  const formatSingle = (dateStr?: string | null) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    } catch {
      return dateStr;
    }
  };

  const startFormatted = formatSingle(startDate);
  if (isCurrent) {
    return startFormatted ? `${startFormatted} - Present` : 'Present';
  }
  const endFormatted = formatSingle(endDate);
  if (startFormatted && endFormatted) {
    return `${startFormatted} - ${endFormatted}`;
  }
  return startFormatted || endFormatted || '';
}

export function isSectionIdEnabled(sections: SectionConfig[], sectionId: string): boolean {
  const match = sections.find((s) => s.id === sectionId);
  return match !== undefined ? match.enabled : true;
}

export function getOrderedInnerSections(sections: SectionConfig[]): SectionConfig[] {
  return [...sections]
    .filter((s) => s.enabled && s.id !== 'hero')
    .sort((a, b) => a.order - b.order);
}

export function normalizeNexisPortfolio(
  rawResponse: z.infer<typeof NexisPortfolioResponseSchema>
): NormalizedNexisData {
  let data: z.infer<typeof NexisPortfolioSnapshotSchema>;
  if ('data' in rawResponse && rawResponse.data && typeof rawResponse.data === 'object') {
    data = rawResponse.data as any;
  } else {
    data = rawResponse as z.infer<typeof NexisPortfolioSnapshotSchema>;
  }

  const sections: SectionConfig[] = (data.sections || [])
    .filter((s: any) => s && s.enabled !== false)
    .map((s: any, idx: number) => ({
      id: s.id,
      label: s.label || s.name || s.title || s.id,
      enabled: s.enabled !== false,
      order: s.order ?? s.displayOrder ?? idx + 1,
    }))
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  const educationRaw = (data.education && data.education.length > 0) ? data.education : (data.educations || []);
  const education: EducationItem[] = educationRaw
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((edu: any) => ({
      id: edu.id,
      edu: edu.degree || edu.edu || edu.fieldOfStudy || 'Education',
      college: edu.institution || edu.college || '',
      status: edu.status || 'Graduated',
      year: edu.endDate ? String(edu.endDate) : edu.startDate ? `${edu.startDate} - Present` : '',
      grade: edu.grade ?? null,
    }));

  const experienceRaw = (data.experience && data.experience.length > 0) ? data.experience : (data.experiences || []);
  const experience: ExperienceItem[] = experienceRaw
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((exp: any) => {
      let works: string[] = [];
      if (Array.isArray(exp.works) && exp.works.length > 0) {
        works = exp.works;
      } else if (exp.description) {
        works = exp.description
          .split('\n')
          .map((line: string) => line.replace(/^[-*•]\s*/, '').trim())
          .filter(Boolean);
      }

      const tenure = exp.tenure || formatTenurePeriod(exp.startDate, exp.endDate, exp.isCurrent ?? false);

      return {
        id: exp.id,
        role: exp.position || exp.role || '',
        company: exp.company,
        tenure_period: tenure,
        works,
        companyUrl: exp.companyUrl ?? null,
      };
    });

  const skills: SkillData = {
    Technical: {},
    'Soft Skills': [],
  };

  (data.skills || []).forEach((sk: any) => {
    const category = sk.category || 'General';
    if (category.toLowerCase().includes('soft')) {
      if (!skills['Soft Skills']) skills['Soft Skills'] = [];
      skills['Soft Skills'].push(sk.name);
    } else {
      if (!skills.Technical[category]) {
        skills.Technical[category] = {};
      }
      skills.Technical[category][sk.name] = {
        level: sk.proficiencyLevel || 'intermediate',
      };
    }
  });

  const linkedinLink = data.socialLinks?.find(
    (s: any) => s.platform?.toLowerCase() === 'linkedin'
  );
  const githubLink = data.socialLinks?.find(
    (s: any) => s.platform?.toLowerCase() === 'github'
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

  const achievements: string[] = (data.achievements || [])
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((a: any) => (a.description ? `${a.title}: ${a.description}` : a.title));

  const projects: ProjectItem[] = (data.projects || [])
    .sort((a: any, b: any) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
    .map((p: any, idx: number) => ({
      id: p.id,
      name: p.name || p.title || 'Project',
      description: p.description ?? null,
      link: {
        git: p.repoUrl || p.githubUrl || '',
        live: p.liveUrl ?? null,
      },
      collabed: p.collabed ?? false,
      type: p.type ? p.type.charAt(0).toUpperCase() + p.type.slice(1) : 'Project',
      featured: p.featured ?? (idx === 0),
      displayOrder: p.displayOrder ?? idx,
      highlightLabel: p.highlightLabel ?? null,
    }));

  const githubIntelligence = (data as any).githubIntelligence;
  const githubStats = githubIntelligence
    ? {
        user: {
          login: githubIntelligence.profile.username,
          id: 0,
          avatar_url: githubIntelligence.profile.avatarUrl,
          html_url: githubIntelligence.profile.profileUrl,
          name: githubIntelligence.profile.name,
          bio: githubIntelligence.profile.bio,
          location: githubIntelligence.profile.location,
          public_repos: githubIntelligence.profile.publicRepos,
          followers: githubIntelligence.profile.followers,
          following: githubIntelligence.profile.following,
        },
        repos: (githubIntelligence.repositories || []).map((repo: any) => ({
          id: 0,
          name: repo.name,
          description: repo.description,
          html_url: repo.url,
          homepage: null,
          stargazers_count: repo.stars,
          forks_count: repo.forks,
          language: repo.language,
        })),
        extraStats: {
          commits: githubIntelligence.stats.totalCommits,
          prs: githubIntelligence.stats.totalPullRequests,
          issues: githubIntelligence.stats.totalIssues,
        },
        contributionsData: githubIntelligence.activity?.calendar
          ? {
              total: { [String(githubIntelligence.activity.selectedYear)]: githubIntelligence.activity.totalContributions },
              contributions: (githubIntelligence.activity.calendar.weeks || []).flatMap((week: any) =>
                (week.contributionDays || []).map((day: any) => ({
                  date: day.date,
                  count: day.contributionCount,
                  level: day.contributionCount > 0 ? 1 : 0,
                }))
              ),
            }
          : undefined,
      }
    : null;

  const details: PortfolioDetails = {
    profile: data.profile
      ? {
          fullName: data.profile.fullName,
          headline: data.profile.headline,
          bio: data.profile.bio,
          avatarUrl: data.profile.avatarUrl || data.profile.imageUrl || null,
          imageUrl: data.profile.imageUrl || data.profile.avatarUrl || null,
          location: data.profile.location,
          email: data.profile.email,
          phone: data.profile.phone,
          resumeUrl: data.profile.resumeUrl,
          websiteUrl: data.profile.websiteUrl,
          welcomeGreeting: data.welcomeGreeting ?? data.profile.welcomeGreeting,
          typewriterTexts: data.typewriterTexts ?? data.profile.typewriterTexts,
          pillars: data.profile.pillars,
        }
      : undefined,
    education,
    experience,
    skills,
    interest: data.interests || [],
    contact,
    achievements,
    about: data.profile?.bio,
    aboutPillars: data.aboutPillars || data.profile?.pillars || [],
    constellationMeshConfig: data.constellationMeshConfig,
    sections,
    publishedAt: data.publishedAt,
  };

  if (githubStats) details.githubIntelligence = githubStats;

  return {
    details,
    projects,
    sections,
  };
}

// -------------------------------------------------------------
// Published Resume Zod Validation Schemas
// -------------------------------------------------------------

export const ResumeProfileSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    const rawName = val.fullName || val.name;
    const fullName = typeof rawName === 'string' && rawName.trim() ? rawName.trim() : undefined;
    if (!fullName) {
      return val;
    }
    return {
      fullName,
      name: fullName,
      headline: val.headline ?? val.title ?? null,
      title: val.title ?? val.headline ?? null,
      bio: val.bio ?? val.summary ?? null,
      summary: val.summary ?? val.bio ?? null,
      email: val.email ?? null,
      phone: val.phone ?? null,
      location: val.location ?? null,
      avatarUrl: val.avatarUrl ?? val.imageUrl ?? null,
      websiteUrl: val.websiteUrl ?? val.website ?? null,
      website: val.website ?? val.websiteUrl ?? null,
    };
  }
  return val;
}, z.object({
  fullName: z.string().min(1),
  name: z.string().optional(),
  headline: z.string().nullish(),
  title: z.string().nullish(),
  bio: z.string().nullish(),
  summary: z.string().nullish(),
  email: z.string().nullish(),
  phone: z.string().nullish(),
  location: z.string().nullish(),
  avatarUrl: z.string().nullish(),
  websiteUrl: z.string().nullish(),
  website: z.string().nullish(),
}));

export const ResumeExperienceSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    let description = val.description ?? null;
    let highlights: string[] = [];
    if (Array.isArray(val.highlights)) {
      highlights = val.highlights;
      if (!description && highlights.length > 0) {
        description = highlights.join('\n');
      }
    } else if (description) {
      highlights = description
        .split('\n')
        .map((l: string) => l.replace(/^[-*•]\s*/, '').trim())
        .filter(Boolean);
    }

    const isCurrent = val.isCurrent ?? val.current ?? false;

    return {
      id: val.id ?? '',
      company: val.company ?? '',
      position: val.position ?? val.role ?? '',
      location: val.location ?? null,
      startDate: val.startDate ?? '',
      endDate: val.endDate ?? null,
      isCurrent,
      current: isCurrent,
      description,
      highlights,
      companyUrl: val.companyUrl ?? val.link ?? null,
      link: val.link ?? null,
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  company: z.string(),
  position: z.string(),
  location: z.string().nullish(),
  startDate: z.string(),
  endDate: z.string().nullish(),
  isCurrent: z.boolean().default(false),
  current: z.boolean().default(false),
  description: z.string().nullish(),
  highlights: z.array(z.string()).default([]),
  companyUrl: z.string().nullish(),
  link: z.string().nullish(),
  displayOrder: z.number().default(0),
}));

export const ResumeEducationSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    return {
      id: val.id ?? '',
      institution: val.institution ?? val.college ?? '',
      degree: val.degree ?? val.edu ?? '',
      fieldOfStudy: val.fieldOfStudy ?? val.field ?? null,
      field: val.field ?? val.fieldOfStudy ?? null,
      startDate: val.startDate ?? null,
      endDate: val.endDate ?? null,
      grade: val.grade ?? null,
      status: val.status ?? null,
      completionYear: val.completionYear ?? null,
      description: val.description ?? (Array.isArray(val.activities) ? val.activities.join(', ') : null),
      activities: Array.isArray(val.activities) ? val.activities : [],
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  institution: z.string(),
  degree: z.string(),
  fieldOfStudy: z.string().nullish(),
  field: z.string().nullish(),
  startDate: z.string().nullish(),
  endDate: z.string().nullish(),
  grade: z.string().nullish(),
  status: z.string().nullish(),
  completionYear: z.union([z.string(), z.number()]).nullish(),
  description: z.string().nullish(),
  activities: z.array(z.string()).default([]),
  displayOrder: z.number().default(0),
}));

export const ResumeSkillSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    return {
      id: val.id ?? '',
      name: val.name ?? '',
      category: val.category ?? 'General',
      proficiencyLevel: val.proficiencyLevel ?? 'intermediate',
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  name: z.string(),
  category: z.string().default('General'),
  proficiencyLevel: z.string().default('intermediate'),
  displayOrder: z.number().default(0),
}));

export const ResumeCertificationSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    return {
      id: val.id ?? '',
      name: val.name ?? '',
      issuer: val.issuer ?? '',
      issueDate: val.issueDate ?? null,
      expiryDate: val.expiryDate ?? null,
      credentialId: val.credentialId ?? null,
      credentialUrl: val.credentialUrl ?? val.url ?? null,
      url: val.url ?? val.credentialUrl ?? null,
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string().nullish(),
  expiryDate: z.string().nullish(),
  credentialId: z.string().nullish(),
  credentialUrl: z.string().nullish(),
  url: z.string().nullish(),
  displayOrder: z.number().default(0),
}));

export const ResumeAchievementSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    return {
      id: val.id ?? '',
      title: val.title ?? '',
      description: val.description ?? null,
      date: val.date ?? null,
      awarder: val.awarder ?? null,
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  title: z.string(),
  description: z.string().nullish(),
  date: z.string().nullish(),
  awarder: z.string().nullish(),
  displayOrder: z.number().default(0),
}));

export const ResumeSocialLinkSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    return {
      id: val.id ?? '',
      platform: val.platform ?? '',
      url: val.url ?? '',
      username: val.username ?? null,
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  platform: z.string(),
  url: z.string(),
  username: z.string().nullish(),
  displayOrder: z.number().default(0),
}));

export const ResumeProjectSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    return {
      id: val.id ?? '',
      name: val.name ?? val.title ?? 'Project',
      title: val.title ?? val.name ?? 'Project',
      type: val.type ?? 'Project',
      description: val.description ?? null,
      liveUrl: val.liveUrl ?? val.url ?? null,
      url: val.url ?? val.liveUrl ?? null,
      githubUrl: val.githubUrl ?? val.repoUrl ?? '',
      technologies: Array.isArray(val.technologies) ? val.technologies : [],
      isFeatured: val.isFeatured ?? val.featured ?? false,
      displayOrder: val.displayOrder ?? 0,
    };
  }
  return val;
}, z.object({
  id: z.string().default(''),
  name: z.string(),
  title: z.string().optional(),
  type: z.string().default('Project'),
  description: z.string().nullish(),
  liveUrl: z.string().nullish(),
  url: z.string().nullish(),
  githubUrl: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  displayOrder: z.number().default(0),
}));

export const ResumeSnapshotSchema = z.preprocess((val: any) => {
  if (val && typeof val === 'object') {
    let rawSkills = val.skills ?? [];
    if (Array.isArray(rawSkills) && rawSkills.length > 0 && typeof rawSkills[0] === 'object' && 'skills' in rawSkills[0]) {
      const flattened: any[] = [];
      rawSkills.forEach((group: any) => {
        const cat = group.category || 'General';
        (group.skills || []).forEach((sk: string) => {
          flattened.push({ name: sk, category: cat, proficiencyLevel: 'intermediate' });
        });
      });
      rawSkills = flattened;
    }

    const experiences = val.experiences ?? val.experience ?? [];
    const educations = val.educations ?? val.education ?? [];

    return {
      schemaVersion: val.schemaVersion ?? 1,
      slug: val.slug ?? 'krishna-naik',
      profile: val.profile,
      experiences,
      experience: experiences,
      educations,
      education: educations,
      skills: rawSkills,
      certifications: val.certifications ?? [],
      achievements: val.achievements ?? [],
      socialLinks: val.socialLinks ?? [],
      projects: val.projects ?? [],
      publishedAt: val.publishedAt ?? new Date().toISOString(),
    };
  }
  return val;
}, z.object({
  schemaVersion: z.number().default(1),
  slug: z.string().optional().default('krishna-naik'),
  profile: ResumeProfileSchema,
  experiences: z.array(ResumeExperienceSchema).default([]),
  experience: z.array(ResumeExperienceSchema).optional(),
  educations: z.array(ResumeEducationSchema).default([]),
  education: z.array(ResumeEducationSchema).optional(),
  skills: z.array(ResumeSkillSchema).default([]),
  certifications: z.array(ResumeCertificationSchema).default([]),
  achievements: z.array(ResumeAchievementSchema).default([]),
  socialLinks: z.array(ResumeSocialLinkSchema).default([]),
  projects: z.array(ResumeProjectSchema).default([]),
  publishedAt: z.string(),
}));

export const NexisResumeResponseSchema = z.union([
  z.object({
    success: z.boolean(),
    data: ResumeSnapshotSchema,
    timestamp: z.string().optional(),
  }),
  z.object({
    data: ResumeSnapshotSchema,
  }),
  ResumeSnapshotSchema,
]);
