'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import { PortfolioDetails, ProjectItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroClientProps {
  initialDetails: PortfolioDetails | null;
  initialProjects: ProjectItem[];
}

const HeroClient: React.FC<HeroClientProps> = ({ initialDetails, initialProjects }) => {
  const [activeSection, setActiveSection] = useState<string>('about');
  const [showContent, setShowContent] = useState<boolean>(false);
  const [details, setDetails] = useState<PortfolioDetails | null>(initialDetails);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
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
    if (!showContent) return;

    if (!details) {
      fetch('/api/github/details')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setDetails(data);
        })
        .catch((err) => console.error('Error fetching details fallback:', err));
    }

    if (projects.length === 0) {
      fetch('/api/github/projects')
        .then((res) => (res.ok ? res.json() : []))
        .then((data) => {
          if (Array.isArray(data)) setProjects(data);
        })
        .catch((err) => console.error('Error fetching projects fallback:', err));
    }
  }, [showContent, details, projects.length]);

  // Section Observer for active header highlight
  useEffect(() => {
    if (!showContent) return;

    const sectionIds = [
      'about',
      'education',
      'experience',
      'projects',
      'skills',
      'interest',
      'git-stats',
      'contact',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }

        // Check if footer or contact is in view for floating arrow
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
  }, [showContent]);

  return (
    <div className="bg-bg-main min-h-screen transition-colors duration-500 selection:bg-neon-cyan/20 selection:text-neon-cyan">
      <Header activeSection={activeSection} />

      <main className="pt-24 pb-12">
        <Welcome onComplete={() => setShowContent(true)} />

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <AboutSection sectionRef={aboutRef} />
              <EducationSection sectionRef={eduRef} eduData={details?.education || []} />
              <ExperienceSection sectionRef={expRef} expData={details?.experience || []} />
              <ProjectsSection sectionRef={projRef} initialProjects={projects} />
              <SkillsSection sectionRef={skillRef} skillData={details?.skills} />
              <InterestSection sectionRef={interestRef} interest={details?.interest || []} />
              <GitHubStatsSection sectionRef={gitRef} initialUsername="KrishnaNaik6" />
              <ContactSection sectionRef={contactRef} contact={details?.contact} />
              <Footer />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Scroll Navigation Arrow */}
      {showContent && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <motion.a
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            href={atBottom ? '#about' : '#footer'}
            aria-label={atBottom ? 'Scroll to top' : 'Scroll to bottom'}
            className="p-3 rounded-full bg-slate-900/60 backdrop-blur-lg border border-neon-cyan/30 shadow-xl text-neon-cyan block animate-bounce"
          >
            {atBottom ? <CircleArrowUp size={24} /> : <CircleArrowDown size={24} />}
          </motion.a>
        </div>
      )}
    </div>
  );
};

export default HeroClient;
