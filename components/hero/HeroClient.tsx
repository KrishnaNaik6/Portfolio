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
import {
  normalizeSectionId,
  isSectionEnabled,
  getOrderedBodySections,
  debugSectionSync,
} from '@/lib/sectionConfig';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroClientProps {
  initialDetails: PortfolioDetails | null;
  initialProjects: ProjectItem[];
  initialStats?: GitHubStatsResponse | null;
  initialSections?: SectionConfig[] | null;
}

const HeroClient: React.FC<HeroClientProps> = ({
  initialDetails,
  initialProjects,
  initialStats = null,
  initialSections,
}) => {
  const [details, setDetails] = useState<PortfolioDetails | null>(initialDetails);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [stats, setStats] = useState<GitHubStatsResponse | null>(initialStats);
  const [sections, setSections] = useState<SectionConfig[] | null>(
    initialSections ?? initialDetails?.sections ?? null
  );

  // Synchronize state when server-provided props change (e.g. navigation, reload)
  useEffect(() => {
    if (initialSections !== undefined) {
      setSections(initialSections);
    } else if (initialDetails?.sections) {
      setSections(initialDetails.sections);
    }
  }, [initialSections, initialDetails?.sections]);

  useEffect(() => {
    if (initialDetails !== undefined) {
      setDetails(initialDetails);
    }
  }, [initialDetails]);

  useEffect(() => {
    if (initialProjects !== undefined) {
      setProjects(initialProjects);
    }
  }, [initialProjects]);

  useEffect(() => {
    if (initialStats !== undefined) {
      setStats(initialStats);
    }
  }, [initialStats]);

  // Development-only console debug table
  useEffect(() => {
    debugSectionSync(sections);
  }, [sections]);

  const isHeroEnabled = useMemo(() => isSectionEnabled(sections, 'hero'), [sections]);
  const isFooterEnabled = useMemo(() => isSectionEnabled(sections, 'footer'), [sections]);

  const [showContent, setShowContent] = useState<boolean>(true);
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

  // Client-side fallback fetch ONLY if neither details nor initialSections were provided from server
  useEffect(() => {
    if (!details && initialSections === undefined) {
      fetch('/api/portfolio', { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.details) {
            setDetails(data.details);
            if (data.projects && Array.isArray(data.projects)) {
              setProjects(data.projects);
            }
            if (data.sections && Array.isArray(data.sections)) {
              setSections(data.sections);
            }
          }
        })
        .catch((err) => console.warn('[HeroClient] Client portfolio fetch failed:', err));
    }
  }, [details, initialSections]);

  // Fetch GitHub stats ONLY if GitHub section is enabled in NEXIS sections configuration
  const isGitHubEnabled = useMemo(() => isSectionEnabled(sections, 'github'), [sections]);

  useEffect(() => {
    if (isGitHubEnabled && !stats) {
      const targetUser =
        details?.contact?.follow?.Github?.split('/').filter(Boolean).pop() || 'KrishnaNaik6';
      fetch(`/api/github/stats/${targetUser}`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setStats(data);
        })
        .catch((err) => console.warn('[HeroClient] GitHub stats fetch error:', err));
    }
  }, [isGitHubEnabled, stats, details]);

  // Determine enabled and ordered inner sections (strictly excluding hero and footer)
  const orderedSections = useMemo(() => {
    return getOrderedBodySections(sections);
  }, [sections]);

  // High-performance scroll spy with requestAnimationFrame for smooth in-view active navbar highlight
  useEffect(() => {
    if (!showContent || typeof window === 'undefined') return;

    const sectionIds = orderedSections.map((s) => {
      const canonical = normalizeSectionId(s.id);
      if (canonical === 'interests') return 'interest';
      if (canonical === 'github') return 'git-stats';
      return canonical;
    });

    if (sectionIds.length === 0) return;

    let ticking = false;

    const updateActiveSection = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const windowHeight = window.innerHeight || 800;
      const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0;

      // Bottom of page detection
      if (documentHeight > 0 && scrollY + windowHeight >= documentHeight - 100) {
        setAtBottom(true);
        if (sectionIds.length > 0) {
          setActiveSection(sectionIds[sectionIds.length - 1]);
        }
        return;
      }

      setAtBottom(false);

      // Trigger line at 30% from the top of the viewport
      const triggerLine = scrollY + windowHeight * 0.35;
      let currentSection = sectionIds[0] || 'about';

      for (let i = 0; i < sectionIds.length; i++) {
        const id = sectionIds[i];
        const elem = document.getElementById(id);
        if (elem) {
          const rect = elem.getBoundingClientRect();
          const elemTop = rect.top + scrollY;
          if (triggerLine >= elemTop - 50) {
            currentSection = id;
          }
        }
      }

      setActiveSection(currentSection);
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // Initial check
    updateActiveSection();

    // IntersectionObserver as secondary listener for instant section entries
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible.length > 0) {
            setActiveSection(visible[0].target.id);
          }
        },
        {
          threshold: [0.2, 0.5, 0.8],
          rootMargin: '-15% 0px -40% 0px',
        }
      );

      sectionIds.forEach((id) => {
        const elem = document.getElementById(id);
        if (elem) observer?.observe(elem);
      });
    } catch {
      // Fallback to scroll listener
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showContent, orderedSections]);

  const githubUsername =
    details?.contact?.follow?.Github?.split('/').filter(Boolean).pop() || 'KrishnaNaik6';

  const renderSection = (sec: SectionConfig) => {
    const canonical = normalizeSectionId(sec.id);

    // Strict runtime assertion: never render any section if isSectionEnabled is false
    if (!isSectionEnabled(sections, canonical)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[HeroClient Warning] Prevented rendering disabled section: ${canonical}`);
      }
      return null;
    }

    switch (canonical) {
      case 'about':
        return (
          <AboutSection
            key="about"
            sectionRef={aboutRef}
            bio={details?.profile?.bio}
            fullName={details?.profile?.fullName}
            location={details?.profile?.location}
            achievements={details?.achievements || []}
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
            initialProjects={projects || []}
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
      case 'interests':
        return (
          <InterestSection
            key="interests"
            sectionRef={interestRef}
            interest={details?.interest || []}
          />
        );
      case 'github':
        return (
          <GitHubStatsSection
            key="github"
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
          <Welcome
            profile={details?.profile}
            sections={sections}
            onComplete={() => setShowContent(true)}
          />
        )}

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {orderedSections.map((sec) => renderSection(sec))}
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
