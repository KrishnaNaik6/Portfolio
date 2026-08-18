export interface EducationItem {
  id?: string;
  edu: string;
  college: string;
  status: string;
  year?: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  tenure_period: string;
  works: string[];
}

export interface TechnicalSkills {
  [category: string]: {
    [skillName: string]: any;
  };
}

export interface SkillData {
  Technical: TechnicalSkills;
  'Soft Skills'?: string[];
}

export interface ContactInfo {
  msg: {
    Mail: string;
    Phone: string;
  };
  follow: {
    Linkedin: string;
    Instagram: string;
    Github?: string;
  };
}

export interface PortfolioDetails {
  education: EducationItem[];
  experience: ExperienceItem[];
  skills: SkillData;
  interest: string[];
  contact: ContactInfo;
}

export interface ProjectLink {
  git: string;
  live: string | null;
}

export interface ProjectItem {
  name: string;
  description: string | null;
  link: ProjectLink;
  collabed?: boolean;
  type?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  total_private_repos?: number;
  owned_private_repos?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  has_projects?: boolean;
}

export interface ExtraStats {
  commits: number;
  prs: number;
  issues: number;
}

export interface GitHubStatsResponse {
  user: GitHubUser;
  repos: GitHubRepo[];
  extraStats: ExtraStats;
}
