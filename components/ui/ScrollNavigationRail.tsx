'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionConfig } from '@/lib/types';
import { normalizeSectionId, getOrderedBodySections } from '@/lib/sectionConfig';

interface ScrollNavigationRailProps {
  activeSection: string;
  sections?: SectionConfig[] | null;
}

interface RailItem {
  id: string;
  label: string;
  number: string;
}

const defaultRailItems: RailItem[] = [
  { id: 'about', label: 'About', number: '01' },
  { id: 'education', label: 'Education', number: '02' },
  { id: 'experience', label: 'Experience', number: '03' },
  { id: 'projects', label: 'Projects', number: '04' },
  { id: 'skills', label: 'Skills', number: '05' },
  { id: 'interest', label: 'Interests', number: '06' },
  { id: 'git-stats', label: 'Git Intelligence', number: '07' },
  { id: 'contact', label: 'Contact', number: '08' },
];

const ScrollNavigationRail: React.FC<ScrollNavigationRailProps> = ({
  activeSection,
  sections,
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const railItems = useMemo<RailItem[]>(() => {
    if (sections) {
      const ordered = getOrderedBodySections(sections);
      return ordered.map((sec, idx) => {
        const canonical = normalizeSectionId(sec.id);
        const domId =
          canonical === 'interests' ? 'interest' : canonical === 'github' ? 'git-stats' : canonical;
        return {
          id: domId,
          label: sec.label || sec.id,
          number: String(idx + 1).padStart(2, '0'),
        };
      });
    }
    return defaultRailItems;
  }, [sections]);

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isCurrentActive = (itemId: string) => {
    if (!activeSection) return false;
    const canonicalActive = normalizeSectionId(activeSection);
    const canonicalItem = normalizeSectionId(itemId);
    return (
      activeSection === itemId ||
      canonicalActive === canonicalItem ||
      (canonicalActive === 'interests' && itemId === 'interest') ||
      (canonicalActive === 'github' && itemId === 'git-stats')
    );
  };

  return (
    <nav
      aria-label="Section navigation rail"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-xl border border-border-color/60 shadow-2xl"
    >
      {railItems.map((item) => {
        const isActive = isCurrentActive(item.id);
        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            className="relative flex items-center justify-center"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip on hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 10, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-9 px-3 py-1 rounded-full bg-slate-900/95 border border-neon-cyan/40 text-neon-cyan text-[11px] font-mono font-bold whitespace-nowrap shadow-[0_0_15px_rgba(88,166,255,0.3)] backdrop-blur-xl pointer-events-none flex items-center gap-1.5"
                >
                  <span className="opacity-60">{item.number}</span>
                  <span>{item.label}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Dot Button */}
            <button
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-label={`Jump to ${item.label} section`}
              aria-current={isActive ? 'true' : undefined}
              className={`relative rounded-full transition-all duration-300 cursor-pointer flex items-center justify-center ${
                isActive
                  ? 'w-6 h-6 bg-neon-cyan/20 border border-neon-cyan shadow-[0_0_12px_rgba(88,166,255,0.6)]'
                  : 'w-3 h-3 bg-slate-700/60 hover:bg-neon-indigo hover:scale-125'
              }`}
            >
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(88,166,255,1)]" />
              )}
            </button>
          </div>
        );
      })}
    </nav>
  );
};

export default ScrollNavigationRail;
