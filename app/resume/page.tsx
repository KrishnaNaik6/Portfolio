import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Code2,
  FolderGit2,
  Award,
  Trophy,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  FileQuestion,
} from 'lucide-react';
import { fetchNexisResume } from '@/lib/nexis';
import { PrintButton } from '@/components/resume/PrintButton';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Resume | Krishna Naik (Full Stack Developer & AI/ML Engineer)',
  description:
    'Official published resume and curriculum vitae of Krishna Naik — Full Stack Developer, Software Engineer, and AI/ML Specialist. View verified experience, skills, education, projects, and certifications.',
  alternates: {
    canonical: 'https://krishna-naik.vercel.app/resume',
  },
  openGraph: {
    title: 'Resume | Krishna Naik',
    description:
      'Official published resume of Krishna Naik — Full Stack Developer & AI/ML Engineer.',
    url: 'https://krishna-naik.vercel.app/resume',
    type: 'profile',
  },
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  if (dateStr.toLowerCase() === 'present' || dateStr.toLowerCase() === 'current') {
    return 'Present';
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch {
    return dateStr;
  }
}

function getSocialIcon(platform: string) {
  const p = (platform || '').toLowerCase();
  if (p.includes('github')) return <Github className="w-4 h-4" aria-hidden="true" />;
  if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" aria-hidden="true" />;
  if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4" aria-hidden="true" />;
  return <Globe className="w-4 h-4" aria-hidden="true" />;
}

export default async function ResumePage() {
  const resume = await fetchNexisResume();

  if (!resume || !resume.profile) {
    return (
      <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
        <div className="bg-bg-surface border border-border-color rounded-2xl p-8 sm:p-12 shadow-xl max-w-lg w-full">
          <div className="w-16 h-16 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 flex items-center justify-center mx-auto mb-6 text-neon-cyan">
            <FileQuestion className="w-8 h-8" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-3">Resume Currently Unavailable</h1>
          <p className="text-text-secondary text-sm mb-8 leading-relaxed">
            The live interactive resume is currently being updated in NEXIS. You can download the verified static PDF copy directly or return to the main portfolio.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/KrishnaNaik.pdf"
              download="Krishna_Naik_Resume.pdf"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-neon-indigo hover:bg-neon-indigo/90 text-white font-medium text-sm transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Download PDF Resume</span>
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-bg-main hover:bg-border-color/30 text-text-primary border border-border-color font-medium text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const {
    profile,
    socialLinks = [],
    experiences = [],
    educations = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
  } = resume as any;

  // Group skills by category safely
  const skillsByCategory: Record<string, string[]> = {};
  for (const item of (skills as any[])) {
    if (item && Array.isArray(item.skills)) {
      const cat = item.category || 'General';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(...item.skills);
    } else if (item && (item.name || item.skill)) {
      const cat = item.category || 'General';
      if (!skillsByCategory[cat]) skillsByCategory[cat] = [];
      skillsByCategory[cat].push(item.name || item.skill);
    }
  }

  const experienceList = experiences.length > 0 ? experiences : (resume as any).experience || [];
  const educationList = educations.length > 0 ? educations : (resume as any).education || [];

  const fullName = profile.fullName || profile.name || 'Krishna Naik';
  const headline = profile.headline || profile.title || null;
  const summary = profile.bio || profile.summary || null;

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto print:py-0 print:px-0 print:max-w-none">
      {/* Print styles injected for pristine document generation */}
      <style>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #111827 !important;
          }
          .bg-ambient-mesh,
          .print-hidden,
          .top-toolbar,
          header.top-toolbar,
          footer {
            display: none !important;
          }
          .resume-container {
            background-color: #ffffff !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #111827 !important;
          }
          .resume-container * {
            color: #111827 !important;
            border-color: #e5e7eb !important;
          }
          .resume-badge {
            background-color: #f3f4f6 !important;
            border: 1px solid #d1d5db !important;
            color: #1f2937 !important;
          }
          .resume-section-heading {
            border-bottom: 2px solid #111827 !important;
            color: #111827 !important;
          }
          .resume-card {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          a {
            text-decoration: none !important;
            color: inherit !important;
          }
        }
        @page {
          margin: 12mm 15mm 12mm 15mm;
          size: auto;
        }
      `}</style>

      {/* Top Navigation & Action Toolbar (Hidden in Print) */}
      <div className="top-toolbar flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-border-color print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-surface transition-colors border border-transparent hover:border-border-color"
          aria-label="Return to portfolio home"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>Back to Portfolio</span>
        </Link>

        <div className="flex items-center gap-3">
          <a
            href="/KrishnaNaik.pdf"
            download="Krishna_Naik_Resume.pdf"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all bg-bg-surface hover:bg-border-color/40 text-text-primary border border-border-color active:scale-95"
            aria-label="Download backup PDF copy"
          >
            <Download className="w-4 h-4 text-neon-cyan" aria-hidden="true" />
            <span className="hidden sm:inline">Download PDF File</span>
            <span className="sm:hidden">PDF</span>
          </a>

          <PrintButton />
        </div>
      </div>

      {/* Resume Document Paper */}
      <div className="resume-container bg-card-bg backdrop-blur-md border border-border-color rounded-2xl p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
        {/* Header Profile Section */}
        <header className="border-b border-border-color pb-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight font-sora">
              {fullName}
            </h1>
            {headline && (
              <p className="text-lg font-semibold text-neon-cyan sm:text-right">
                {headline}
              </p>
            )}
          </div>

          {/* Contact Details & Links */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-text-secondary pt-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1.5 hover:text-neon-cyan transition-colors"
              >
                <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{profile.email}</span>
              </a>
            )}

            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                className="inline-flex items-center gap-1.5 hover:text-neon-cyan transition-colors"
              >
                <Phone className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{profile.phone}</span>
              </a>
            )}

            {profile.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{profile.location}</span>
              </span>
            )}

            {(profile.websiteUrl || profile.website) && (
              <a
                href={(profile.websiteUrl || profile.website).startsWith('http') ? (profile.websiteUrl || profile.website) : `https://${profile.websiteUrl || profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-neon-cyan transition-colors"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                <span>{(profile.websiteUrl || profile.website).replace(/^https?:\/\//, '')}</span>
              </a>
            )}

            {socialLinks.map((s: any, idx: number) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-neon-cyan transition-colors"
              >
                {getSocialIcon(s.platform)}
                <span>{s.platform}</span>
              </a>
            ))}
          </div>
        </header>

        {/* Executive Summary */}
        {summary && (
          <section className="resume-card space-y-2.5">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Technical Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="resume-card space-y-3">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              <Code2 className="w-4 h-4 text-neon-cyan print:hidden" aria-hidden="true" />
              <span>Technical Skills</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(skillsByCategory).map(([category, items], idx) => (
                <div key={idx} className="space-y-1.5 text-sm">
                  <div className="font-semibold text-text-primary text-xs uppercase tracking-wide text-neon-purple print:text-gray-900">
                    {category}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="resume-badge px-2.5 py-0.5 rounded text-xs font-medium bg-bg-surface border border-border-color text-text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience */}
        {experienceList && experienceList.length > 0 && (
          <section className="resume-card space-y-4">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              <Briefcase className="w-4 h-4 text-neon-cyan print:hidden" aria-hidden="true" />
              <span>Work Experience</span>
            </h2>
            <div className="space-y-5">
              {experienceList.map((exp: any, eIdx: number) => {
                const isCurrent = exp.isCurrent ?? exp.current ?? false;
                const highlights: string[] = Array.isArray(exp.highlights) && exp.highlights.length > 0
                  ? exp.highlights
                  : exp.description
                  ? exp.description.split('\n').map((l: string) => l.replace(/^[-*•]\s*/, '').trim()).filter(Boolean)
                  : [];

                return (
                  <div key={exp.id || eIdx} className="resume-card space-y-1.5 pl-3 border-l-2 border-neon-indigo/40 print:border-l-2 print:border-gray-400">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                      <h3 className="text-sm font-bold text-text-primary">
                        {exp.position} <span className="font-normal text-text-secondary">at</span>{' '}
                        <span className="text-neon-cyan print:text-gray-900">{exp.company}</span>
                      </h3>
                      <span className="text-xs text-text-secondary font-mono">
                        {formatDate(exp.startDate)} – {isCurrent ? 'Present' : formatDate(exp.endDate)}
                      </span>
                    </div>
                    {exp.location && (
                      <div className="text-xs text-text-secondary italic">{exp.location}</div>
                    )}
                    {highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 space-y-1 text-xs sm:text-sm text-text-secondary leading-relaxed pt-1">
                        {highlights.map((h, hIdx) => (
                          <li key={hIdx}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="resume-card space-y-4">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              <FolderGit2 className="w-4 h-4 text-neon-cyan print:hidden" aria-hidden="true" />
              <span>Featured Projects</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj: any, pIdx: number) => {
                const pTitle = proj.name || proj.title || 'Project';
                const technologies: string[] = Array.isArray(proj.technologies) ? proj.technologies : [];

                return (
                  <div
                    key={proj.id || pIdx}
                    className="resume-card bg-bg-surface/60 border border-border-color rounded-xl p-4 space-y-2 print:bg-transparent print:border-gray-300"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-text-primary">{pTitle}</h3>
                      <div className="flex items-center gap-1.5 print:hidden">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-neon-cyan transition-colors"
                            aria-label={`GitHub repo for ${pTitle}`}
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {(proj.liveUrl || proj.url) && (
                          <a
                            href={proj.liveUrl || proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-text-secondary hover:text-neon-cyan transition-colors"
                            aria-label={`Live demo for ${pTitle}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.description && (
                      <p className="text-xs text-text-secondary leading-relaxed">{proj.description}</p>
                    )}
                    {technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {technologies.map((t, tIdx) => (
                          <span
                            key={tIdx}
                            className="resume-badge px-2 py-0.5 rounded text-[10px] font-mono bg-bg-main border border-border-color text-neon-indigo print:text-gray-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {educationList && educationList.length > 0 && (
          <section className="resume-card space-y-4">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              <GraduationCap className="w-4 h-4 text-neon-cyan print:hidden" aria-hidden="true" />
              <span>Education</span>
            </h2>
            <div className="space-y-4">
              {educationList.map((edu: any, edIdx: number) => (
                <div key={edu.id || edIdx} className="resume-card space-y-1 pl-3 border-l-2 border-neon-purple/40 print:border-l-2 print:border-gray-400">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-sm font-bold text-text-primary">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : edu.field ? `in ${edu.field}` : ''}
                    </h3>
                    <span className="text-xs text-text-secondary font-mono">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate) || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs text-neon-cyan print:text-gray-900 font-medium">{edu.institution || edu.college}</div>
                  {edu.grade && (
                    <div className="text-xs text-text-secondary">Grade / Score: {edu.grade}</div>
                  )}
                  {edu.description && (
                    <p className="text-xs text-text-secondary pt-0.5">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section className="resume-card space-y-3">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              <Award className="w-4 h-4 text-neon-cyan print:hidden" aria-hidden="true" />
              <span>Certifications</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {certifications.map((c: any, cIdx: number) => {
                const certUrl = c.credentialUrl || c.url;
                return (
                  <div
                    key={c.id || cIdx}
                    className="resume-card bg-bg-surface/50 border border-border-color rounded-lg p-3 text-xs space-y-1 print:bg-transparent print:border-gray-300"
                  >
                    <div className="font-semibold text-text-primary flex items-center justify-between">
                      <span>{c.name}</span>
                      {certUrl && (
                        <a
                          href={certUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neon-cyan hover:underline print:hidden ml-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="text-text-secondary">
                      {c.issuer}
                      {c.issueDate && ` • ${formatDate(c.issueDate)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Honors & Achievements */}
        {achievements && achievements.length > 0 && (
          <section className="resume-card space-y-3">
            <h2 className="resume-section-heading text-base font-bold uppercase tracking-wider text-text-primary flex items-center gap-2 border-b border-border-color pb-1">
              <Trophy className="w-4 h-4 text-neon-cyan print:hidden" aria-hidden="true" />
              <span>Key Achievements & Honors</span>
            </h2>
            <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
              {achievements.map((ach: any, aIdx: number) => (
                <li key={ach.id || aIdx} className="resume-card flex items-start gap-2">
                  <span className="text-neon-cyan font-bold">•</span>
                  <div>
                    <span className="font-semibold text-text-primary">{ach.title}</span>
                    {ach.date && <span className="text-xs text-text-secondary font-mono ml-2">({formatDate(ach.date)})</span>}
                    {ach.description && <p className="text-xs text-text-secondary mt-0.5">{ach.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
