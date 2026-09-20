'use client';

import React, { useState } from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Layers,
  Sparkles,
  Terminal,
  Rocket,
  Code2,
  Brain,
  Database,
  Server,
  Globe,
  Workflow,
  Zap,
  Boxes,
  Bot,
  Laptop,
} from 'lucide-react';

interface AboutSectionProps {
  bio?: string;
  fullName?: string;
  location?: string | null;
  achievements?: string[];
  pillars?: import('@/lib/types').AboutPillar[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const renderPillarIcon = (iconName?: string) => {
  const key = iconName?.toLowerCase().trim();
  switch (key) {
    case 'layers':
      return <Layers size={20} />;
    case 'code':
    case 'code2':
      return <Code2 size={20} />;
    case 'terminal':
      return <Terminal size={20} />;
    case 'rocket':
      return <Rocket size={20} />;
    case 'sparkles':
      return <Sparkles size={20} />;
    case 'brain':
    case 'ai':
    case 'ml':
      return <Brain size={20} />;
    case 'database':
      return <Database size={20} />;
    case 'server':
      return <Server size={20} />;
    case 'globe':
      return <Globe size={20} />;
    case 'workflow':
      return <Workflow size={20} />;
    case 'zap':
      return <Zap size={20} />;
    case 'boxes':
      return <Boxes size={20} />;
    case 'bot':
      return <Bot size={20} />;
    case 'laptop':
      return <Laptop size={20} />;
    default:
      return <Cpu size={20} />;
  }
};

const OverlappingPillarDeck: React.FC<{ pillars: import('@/lib/types').AboutPillar[] }> = ({ pillars }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Deterministic scatter/stack style based on index
  const getScatterStyle = (index: number, isActive: boolean) => {
    if (isActive) {
      return {
        rotate: 0,
        x: 0,
        scale: 1.02,
        zIndex: 40,
      };
    }

    const rotations = [-3.5, 4, -2.5, 3.5, -4];
    const xOffsets = [-8, 10, -6, 8, -10];
    const rot = rotations[index % rotations.length];
    const x = xOffsets[index % xOffsets.length];

    return {
      rotate: rot,
      x: x,
      scale: 0.96,
      zIndex: 10 + (pillars.length - index),
    };
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-mono text-text-secondary px-1">
        <span className="flex items-center gap-1.5 text-neon-cyan font-medium">
          <Layers size={14} />
          <span className="uppercase tracking-wider font-semibold">HIGHLIGHT DECK</span>
        </span>
        <span className="text-[10px] text-text-secondary/70">Click card to expand</span>
      </div>

      {/* Stack Container with vertical overlap */}
      <div className="relative flex flex-col w-full pt-1 pb-4">
        {pillars.map((pillar, index) => {
          const isActive = index === activeIndex;
          const scatter = getScatterStyle(index, isActive);
          const isOverlapped = index > 0;

          return (
            <motion.div
              key={pillar.title || index}
              role="button"
              tabIndex={0}
              aria-label={`Select ${pillar.title} pillar`}
              aria-expanded={isActive}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              }}
              initial={false}
              animate={{
                rotate: scatter.rotate,
                x: scatter.x,
                scale: scatter.scale,
              }}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 25,
              }}
              style={{ zIndex: scatter.zIndex }}
              className={`p-4 md:p-5 rounded-2xl cursor-pointer transition-colors duration-300 border backdrop-blur-md shadow-xl focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:outline-none relative ${
                isOverlapped ? '-mt-6 md:-mt-8' : ''
              } ${
                isActive
                  ? 'bg-card-bg/95 border-neon-indigo/70 shadow-[0_0_30px_rgba(99,102,241,0.25)] ring-1 ring-neon-indigo/50'
                  : 'bg-card-bg/80 border-neon-indigo/20 hover:border-neon-indigo/40 hover:bg-card-bg/90 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Header: Icon + Title (Always Visible) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl transition-colors duration-300 shrink-0 ${
                      isActive
                        ? 'bg-neon-indigo/25 text-neon-indigo border border-neon-indigo/50 shadow-sm'
                        : 'bg-neon-indigo/15 text-neon-indigo/80 border border-neon-indigo/20'
                    }`}
                  >
                    {renderPillarIcon(pillar.icon)}
                  </div>
                  <h4 className="text-base md:text-lg font-bold text-text-primary font-sora leading-snug">
                    {pillar.title}
                  </h4>
                </div>

                {isActive ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/40 shrink-0 font-semibold uppercase tracking-wider">
                    ACTIVE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-text-secondary/60 shrink-0">
                    ✦
                  </span>
                )}
              </div>

              {/* Expanded Body Content (Subtitle, Description, Highlights) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-white/10 space-y-3">
                      {pillar.subtitle && (
                        <p className="text-xs text-neon-cyan font-mono font-medium">
                          {pillar.subtitle}
                        </p>
                      )}

                      {pillar.description && (
                        <p className="text-xs text-text-secondary font-mono leading-relaxed">
                          {pillar.description}
                        </p>
                      )}

                      {pillar.highlights && pillar.highlights.length > 0 && (
                        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
                          <ul className="space-y-1.5 text-[11px] text-text-secondary font-mono">
                            {pillar.highlights.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-neon-indigo font-bold select-none">•</span>
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const AboutSection: React.FC<AboutSectionProps> = ({
  bio,
  fullName = 'Krishna Naik',
  location = 'Bengaluru, IN',
  achievements = [],
  pillars = [],
  sectionRef,
}) => {
  const hasPillars = pillars && pillars.length > 0;

  return (
    <SectionWrapper ref={sectionRef} id="about" title="About Me" terminalCommand="whoami">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
        {/* Main Editorial Card */}
        <GlassCard
          className={`${
            hasPillars ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
          } p-6 md:p-10 shadow-2xl flex flex-col border-neon-indigo/30 rounded-3xl bg-card-bg/90 backdrop-blur-md`}
        >
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo text-xs font-mono">
              <Sparkles size={14} />
              <span>BIO & PHILOSOPHY</span>
            </div>

            <p className="text-xl md:text-2xl text-text-primary leading-relaxed font-sora font-semibold tracking-tight">
              I&apos;m <strong className="text-neon-indigo font-bold text-glow-indigo">{fullName}</strong> (<span className="text-text-secondary font-medium">Krishna Umesh Naik / Krishna</span>), a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              {bio ||
                "I enjoy building full-stack applications and experimenting with intelligent systems that bridge the gap between technology and real-world impact. With hands-on experience in web development, backend systems, and AI-driven projects, I'm passionate about solving problems through innovation and creativity."}
            </p>

            {achievements && achievements.length > 0 && (
              <div className="p-4 rounded-2xl bg-neon-indigo/10 border border-neon-indigo/30 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neon-indigo font-bold block">
                  KEY_ACHIEVEMENT //
                </span>
                {achievements.map((item, idx) => (
                  <p key={idx} className="text-sm font-sora text-text-primary font-medium">
                    ✦ {item}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 mt-8 border-t border-border-color flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Based in {location || 'Bengaluru, IN'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Terminal size={14} className="text-neon-cyan" />
              <span>Full-Stack + AI/ML</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-2">
              <Rocket size={14} className="text-neon-rose" />
              <span>Open Source Contributor</span>
            </div>
          </div>
        </GlassCard>

        {/* Overlapping Deck NEXIS About Pillars */}
        {hasPillars && (
          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <OverlappingPillarDeck pillars={pillars} />
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
