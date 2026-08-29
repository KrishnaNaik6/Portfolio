'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Header from '../header/Header';
import Welcome from './Welcome';
import AboutSection from './AboutSection';
import EducationSection from './EducationSection';
import ExperienceSection from './ExperienceSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import InterestSection from './InterestSection';
import GitHubStatsSection from './GitHubStatsSection';
import ContactSection from './ContactSection';
import Footer from '../footer/Footer';
import CustomCursor from '../ui/CustomCursor';
import Background3DParticles from '../3d/Background3DParticles';
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { PortfolioDetails, ProjectItem, GitHubStatsResponse, SectionConfig } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroClientProps {
  initialDetails: PortfolioDetails | null;
  initialProjects: ProjectItem[];
  initialStats?: GitHubStatsResponse | null;
  initialSections?: SectionConfig[];
}

const defaultSections: SectionConfig[] = [
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
];

const HeroClient: React.FC<HeroClientProps> = ({
  initialDetails,
  initialProjects,
  initialStats = null,
  initialSections,
}) => {
  const [details, setDetails] = useState<PortfolioDetails | null>(initialDetails);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [stats, setStats] = useState<GitHubStatsResponse | null>(initialStats);
  const [sections, setSections] = useState<SectionConfig[]>(
    initialSections || initialDetails?.sections || defaultSections
  );

  const heroSectionConfig = sections.find((s) => s.id === 'hero');
  const isHeroEnabled = heroSectionConfig ? heroSectionConfig.enabled !== false : true;

  const [showContent, setShowContent] = useState<boolean>(!isHeroEnabled);
  const [activeSection, setActiveSection] = useState<string>('about');
  const [atBottom, setAtBottom] = useState<boolean>(false);

  const aboutRef = useRef<HTMLElement>(null);
  const eduRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const projRef = useRef<HTMLElement>(null);
  const skillRef = useRef<HTMLElement>(null);
  const interestRef = useRef<HTMLElement>(null);
  const gitRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Client-side fallback fetch if server prefetch was unavailable
  useEffect(() => {
    if (!details) {
      fetch('/api/portfolio')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.details) {
            setDetails(data.details);
            if (data.projects && Array.isArray(data.projects) && projects.length === 0) {
              setProjects(data.projects);
            }
            if (data.sections && Array.isArray(data.sections)) {
              setSections(data.sections);
            }
          } else {
            // Legacy GitHub API fallback
            fetch('/api/github/details')
              .then((res) => (res.ok ? res.json() : null))
              .then((ghData) => {
                if (ghData) setDetails(ghData);
              })
              .catch((err) => console.error('Error fetching details fallback:', err));
          }
        })
        .catch(() => {
          fetch('/api/github/details')
            .then((res) => (res.ok ? res.json() : null))
            .then((ghData) => {
              if (ghData) setDetails(ghData);
            })
            .catch((err) => console.error('Error fetching details fallback:', err));
        });
    }

    if (projects.length === 0) {
      fetch('/api/github/projects')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setProjects(data);
        })
        .catch((err) => console.error('Error fetching projects fallback:', err));
    }

    if (!stats) {
      const targetUser =
        details?.contact?.follow?.Github?.split('/').filter(Boolean).pop() || 'KrishnaNaik6';
      fetch(`/api/github/stats/${targetUser}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setStats(data);
        })
        .catch((err) => console.error('Error fetching stats fallback:', err));
    }
  }, [details, projects.length, stats]);

  // Determine enabled and ordered sections (excluding hero and footer from inner list)
  const orderedSections = useMemo(() => {
    return sections
      .filter((s) => s.enabled !== false && s.id !== 'hero' && s.id !== 'footer')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [sections]);

  const isFooterEnabled = useMemo(() => {
    const footerConfig = sections.find((s) => s.id === 'footer');
    return footerConfig ? footerConfig.enabled !== false : true;
  }, [sections]);

  // Section Observer for active header highlight
  useEffect(() => {
    if (!showContent) return;

    const sectionIds = orderedSections.map((s) => {
      if (s.id === 'interests') return 'interest';
      if (s.id === 'github') return 'git-stats';
      return s.id;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }

        const footerElem = document.getElementById('footer');
        if (footerElem) {
          const rect = footerElem.getBoundingClientRect();
          setAtBottom(rect.top <= window.innerHeight + 100);
        }
      },
      {
        threshold: [0.15, 0.4, 0.7],
        rootMargin: '-10% 0px -30% 0px',
      }
    );

    sectionIds.forEach((id) => {
      const elem = document.getElementById(id);
      if (elem) observer.observe(elem);
    });

    const footerElem = document.getElementById('footer');
    if (footerElem) observer.observe(footerElem);

    return () => observer.disconnect();
  }, [showContent, orderedSections]);

  const githubUsername =
    details?.contact?.follow?.Github?.split('/').filter(Boolean).pop() || 'KrishnaNaik6';

  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case 'about':
        return (
          <AboutSection
            key="about"
            sectionRef={aboutRef}
            bio={details?.profile?.bio}
            fullName={details?.profile?.fullName}
            location={details?.profile?.location}
            achievements={details?.achievements}
          />
        );
      case 'education':
        return (
          <EducationSection
            key="education"
            sectionRef={eduRef}
            eduData={details?.education || []}
          />
        );
      case 'experience':
        return (
          <ExperienceSection
            key="experience"
            sectionRef={expRef}
            expData={details?.experience || []}
          />
        );
      case 'projects':
        return (
          <ProjectsSection
            key="projects"
            sectionRef={projRef}
            initialProjects={projects}
          />
        );
      case 'skills':
        return (
          <SkillsSection
            key="skills"
            sectionRef={skillRef}
            skillData={details?.skills}
          />
        );
      case 'interest':
      case 'interests':
        return (
          <InterestSection
            key="interest"
            sectionRef={interestRef}
            interest={details?.interest || []}
          />
        );
      case 'github':
      case 'git-stats':
        return (
          <GitHubStatsSection
            key="git-stats"
            sectionRef={gitRef}
            initialUsername={githubUsername}
            initialStats={stats}
          />
        );
      case 'contact':
        return (
          <ContactSection
            key="contact"
            sectionRef={contactRef}
            contact={details?.contact}
            resumeUrl={details?.profile?.resumeUrl}
          />
        );
      default:
        return null;
    }
  };

  const topTarget = orderedSections.length > 0 ? `#${orderedSections[0].id}` : '#about';

  return (
    <div className="bg-bg-main min-h-screen transition-colors duration-500 selection:bg-neon-indigo/20 selection:text-neon-indigo relative overflow-hidden">
      {/* 3D Global Particles Background Canvas */}
      <Background3DParticles />

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      <Header activeSection={activeSection} sections={sections} fullName={details?.profile?.fullName} />

      <main className="pt-20 pb-12 relative z-10">
        {isHeroEnabled && (
          <Welcome profile={details?.profile} onComplete={() => setShowContent(true)} />
        )}

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {orderedSections.map((sec) => renderSection(sec.id))}
              {isFooterEnabled && (
                <Footer
                  contact={details?.contact}
                  sections={sections}
                  fullName={details?.profile?.fullName}
                  bio={details?.profile?.bio}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Scroll Navigation Arrow on Bottom-Right */}
      {showContent && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            href={atBottom ? topTarget : '#footer'}
            aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'}
            className="p-3 rounded-full bg-slate-900/80 backdrop-blur-lg border border-neon-indigo/30 shadow-2xl text-neon-indigo block animate-bounce"
          >
            {atBottom ? <CircleArrowUp size={20} /> : <CircleArrowDown size={20} />}
          </motion.a>
        </div>
      )}
    </div>
  );
};

export default HeroClient;
