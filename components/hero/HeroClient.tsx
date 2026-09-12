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
import { normalizeSectionId, isSectionEnabled, getOrderedBodySections, debugSectionSync } from '@/lib/sectionConfig';
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
  const [sections, setSections] = useState<SectionConfig[] | null>(initialSections ?? initialDetails?.sections ?? null);
  const [showContent] = useState(true);
  const [activeSection, setActiveSection] = useState('about');
  const [atBottom, setAtBottom] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const eduRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const projRef = useRef<HTMLElement>(null);
  const skillRef = useRef<HTMLElement>(null);
  const interestRef = useRef<HTMLElement>(null);
  const gitRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialSections !== undefined) setSections(initialSections);
    else if (initialDetails?.sections) setSections(initialDetails.sections);
  }, [initialSections, initialDetails?.sections]);

  useEffect(() => setDetails(initialDetails), [initialDetails]);
  useEffect(() => setProjects(initialProjects), [initialProjects]);
  useEffect(() => setStats(initialStats), [initialStats]);

  useEffect(() => {
    debugSectionSync(sections);
  }, [sections]);

  // Optional client fallback: never block the initial render.
  useEffect(() => {
    if (details || initialSections !== undefined) return;
    const controller = new AbortController();
    fetch('/api/portfolio', { cache: 'no-store', signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.details) setDetails(data.details);
        if (Array.isArray(data.projects)) setProjects(data.projects);
        if (Array.isArray(data.sections)) setSections(data.sections);
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') console.warn('[HeroClient] Portfolio enhancement failed:', err);
      });
    return () => controller.abort();
  }, [details, initialSections]);

  const isHeroEnabled = useMemo(() => isSectionEnabled(sections, 'hero'), [sections]);
  const isFooterEnabled = useMemo(() => isSectionEnabled(sections, 'footer'), [sections]);
  const isGitHubEnabled = useMemo(() => isSectionEnabled(sections, 'github'), [sections]);

  useEffect(() => {
    if (!isGitHubEnabled || stats) return;
    const targetUser = details?.contact?.follow?.Github?.split('/').filter(Boolean).pop() || 'KrishnaNaik6';
    const controller = new AbortController();
    fetch(`/api/github/stats/${encodeURIComponent(targetUser)}`, { cache: 'no-store', signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setStats(data))
      .catch((err) => {
        if (err?.name !== 'AbortError') console.warn('[HeroClient] GitHub stats enhancement failed:', err);
      });
    return () => controller.abort();
  }, [isGitHubEnabled, stats, details]);

  const orderedSections = useMemo(() => getOrderedBodySections(sections), [sections]);

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
      if (documentHeight > 0 && scrollY + windowHeight >= documentHeight - 100) {
        setAtBottom(true);
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }
      setAtBottom(false);
      const triggerLine = scrollY + windowHeight * 0.35;
      let currentSection = sectionIds[0] || 'about';
      for (const id of sectionIds) {
        const elem = document.getElementById(id);
        if (elem) {
          const elemTop = elem.getBoundingClientRect().top + scrollY;
          if (triggerLine >= elemTop - 50) currentSection = id;
        }
      }
      setActiveSection(currentSection);
    };

    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    };

    updateActiveSection();
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible.length) setActiveSection(visible[0].target.id);
        },
        { threshold: [0.2, 0.5, 0.8], rootMargin: '-15% 0px -40% 0px' }
      );
      sectionIds.forEach((id) => {
        const elem = document.getElementById(id);
        if (elem) observer?.observe(elem);
      });
    } catch {
      observer = null;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [showContent, orderedSections]);

  const githubUsername = details?.contact?.follow?.Github?.split('/').filter(Boolean).pop() || 'KrishnaNaik6';

  const renderSection = (sec: SectionConfig) => {
    const canonical = normalizeSectionId(sec.id);
    if (!isSectionEnabled(sections, canonical)) return null;
    switch (canonical) {
      case 'about': return <AboutSection key="about" sectionRef={aboutRef} bio={details?.profile?.bio} fullName={details?.profile?.fullName} location={details?.profile?.location} achievements={details?.achievements || []} />;
      case 'education': return <EducationSection key="education" sectionRef={eduRef} eduData={details?.education || []} />;
      case 'experience': return <ExperienceSection key="experience" sectionRef={expRef} expData={details?.experience || []} />;
      case 'projects': return <ProjectsSection key="projects" sectionRef={projRef} initialProjects={projects || []} />;
      case 'skills': return <SkillsSection key="skills" sectionRef={skillRef} skillData={details?.skills} />;
      case 'interests': return <InterestSection key="interests" sectionRef={interestRef} interest={details?.interest || []} />;
      case 'github': return <GitHubStatsSection key="github" sectionRef={gitRef} initialUsername={githubUsername} initialStats={stats} />;
      case 'contact': return <ContactSection key="contact" sectionRef={contactRef} contact={details?.contact} resumeUrl={details?.profile?.resumeUrl} />;
      default: return null;
    }
  };

  const topTarget = orderedSections.length > 0 ? `#${orderedSections[0].id}` : '#about';

  return (
    <div className="bg-bg-main min-h-screen transition-colors duration-500 selection:bg-neon-indigo/20 selection:text-neon-indigo relative overflow-hidden">
      <Background3DParticles />
      <CustomCursor />
      <Header activeSection={activeSection} sections={sections} fullName={details?.profile?.fullName} />
      <main className="pt-20 pb-12 relative z-10">
        {isHeroEnabled && <Welcome profile={details?.profile} sections={sections} onComplete={() => undefined} />}
        <AnimatePresence>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="space-y-6">
            {orderedSections.map(renderSection)}
            {isFooterEnabled && <Footer contact={details?.contact} sections={sections} fullName={details?.profile?.fullName} bio={details?.profile?.bio} />}
          </motion.div>
        </AnimatePresence>
      </main>
      <div className="fixed bottom-6 right-6 z-40">
        <motion.a whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} href={atBottom ? topTarget : '#footer'} aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'} className="p-3 rounded-full bg-slate-900/80 backdrop-blur-lg border border-neon-indigo/30 shadow-2xl text-neon-indigo block animate-bounce">
          {atBottom ? <CircleArrowUp size={20} /> : <CircleArrowDown size={20} />}
        </motion.a>
      </div>
    </div>
  );
};

export default HeroClient;
