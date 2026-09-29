'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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
import { CircleArrowDown, CircleArrowUp, Sparkles, RefreshCw, Activity } from 'lucide-react';
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

  // Polling & Retry State for Cloud Instance Wakeup
  const isReady = Boolean(details && sections && sections.length > 0);
  const [countdown, setCountdown] = useState(10);
  const [isFetching, setIsFetching] = useState(false);
  const [attempts, setAttempts] = useState(1);
  const isFetchingRef = useRef(false);

  const aboutRef = useRef<HTMLElement>(null);
  const eduRef = useRef<HTMLElement>(null);
  const expRef = useRef<HTMLElement>(null);
  const projRef = useRef<HTMLElement>(null);
  const skillRef = useRef<HTMLElement>(null);
  const interestRef = useRef<HTMLElement>(null);
  const gitRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (initialSections !== undefined && initialSections !== null) setSections(initialSections);
    else if (initialDetails?.sections) setSections(initialDetails.sections);
  }, [initialSections, initialDetails?.sections]);

  useEffect(() => setDetails(initialDetails), [initialDetails]);
  useEffect(() => setProjects(initialProjects), [initialProjects]);
  useEffect(() => setStats(initialStats), [initialStats]);

  useEffect(() => {
    debugSectionSync(sections);
  }, [sections]);

  const fetchPortfolio = useCallback(async () => {
    if (isFetchingRef.current) return false;
    isFetchingRef.current = true;
    setIsFetching(true);
    try {
      const res = await fetch('/api/portfolio', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.details) {
          setDetails(data.details);
          if (Array.isArray(data.projects)) setProjects(data.projects);
          if (Array.isArray(data.sections)) setSections(data.sections);
          return true;
        }
      }
    } catch (err) {
      console.warn('[HeroClient] Portfolio auto-retry failed:', err);
    } finally {
      isFetchingRef.current = false;
      setIsFetching(false);
    }
    return false;
  }, []);

  const handleManualRetry = () => {
    setCountdown(10);
    setAttempts((prev) => prev + 1);
    fetchPortfolio();
  };

  useEffect(() => {
    if (isReady) return;

    fetchPortfolio();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setAttempts((a) => a + 1);
          fetchPortfolio();
          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isReady, fetchPortfolio]);

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
      case 'about': return <AboutSection key="about" sectionRef={aboutRef} bio={details?.profile?.bio} fullName={details?.profile?.fullName} location={details?.profile?.location} achievements={details?.achievements || []} pillars={details?.aboutPillars || []} />;
      case 'education': return <EducationSection key="education" sectionRef={eduRef} eduData={details?.education || []} />;
      case 'experience': return <ExperienceSection key="experience" sectionRef={expRef} expData={details?.experience || []} />;
      case 'projects': return <ProjectsSection key="projects" sectionRef={projRef} initialProjects={projects || []} />;
      case 'skills': return <SkillsSection key="skills" sectionRef={skillRef} skillData={details?.skills} constellationConfig={details?.constellationMeshConfig} />;
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
      <main className="pt-24 pb-12 relative z-10">
        <AnimatePresence mode="wait">
          {!isReady ? (
            <motion.div
              key="loading-portfolio-card"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="min-h-[60vh] flex flex-col items-center justify-center px-4"
            >
              <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-card-bg/90 border border-border-color shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
                {/* Glowing ambient background auras */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-indigo/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

                {/* Animated Cybernetic Icon */}
                <div className="relative mb-5 inline-flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-neon-indigo/10 border border-neon-indigo/30 flex items-center justify-center relative">
                    <Sparkles className="w-7 h-7 text-neon-cyan animate-pulse" />
                    <span className="absolute -inset-1 rounded-2xl border border-neon-cyan/40 animate-spin [animation-duration:3s]" />
                  </div>
                </div>

                {/* Status info */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-[11px] font-mono font-bold tracking-widest text-neon-indigo uppercase">
                      {attempts > 6 ? 'Server Standby' : 'Connecting to Server'}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-sora text-text-primary tracking-tight">
                    {attempts > 6 ? 'Waking Up Cloud Service' : 'Loading Portfolio'}
                  </h2>
                  <p className="text-xs text-text-secondary font-mono leading-relaxed max-w-xs mx-auto">
                    {attempts > 6
                      ? 'The cloud instance is taking a little longer to spin up. Rechecking every 10 seconds...'
                      : 'Connecting to live services. Auto-refreshing every 10 seconds.'}
                  </p>
                </div>

                {/* Attempt and Countdown badge */}
                <div className="bg-slate-950/30 rounded-xl p-3 border border-border-color mb-6 flex items-center justify-between text-xs font-mono">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Activity size={13} className="text-neon-cyan animate-spin [animation-duration:4s]" />
                    Attempt #{attempts}
                  </span>
                  <span className="text-neon-cyan font-semibold">
                    {isFetching ? 'Checking server...' : `Retrying in ${countdown}s`}
                  </span>
                </div>

                {/* Interactive Loading / Retry Button */}
                <button
                  onClick={handleManualRetry}
                  disabled={isFetching}
                  aria-label="Retry loading portfolio"
                  className="w-full py-3 px-5 rounded-2xl font-mono text-xs sm:text-sm font-bold tracking-wider flex items-center justify-center gap-2 bg-gradient-to-r from-neon-indigo to-neon-cyan text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
                >
                  <RefreshCw
                    size={15}
                    className={`transition-transform duration-500 ${isFetching ? 'animate-spin' : 'group-hover:rotate-180'}`}
                  />
                  <span>{isFetching ? 'Connecting to Server...' : `Retry Now (${countdown}s)`}</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {isHeroEnabled && <Welcome profile={details?.profile} sections={sections} onComplete={() => undefined} />}
              {orderedSections.map(renderSection)}
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
      {isReady && (
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
