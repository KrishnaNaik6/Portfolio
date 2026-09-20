'use client';

import React from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';
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
      return <Layers size={22} />;
    case 'code':
    case 'code2':
      return <Code2 size={22} />;
    case 'terminal':
      return <Terminal size={22} />;
    case 'rocket':
      return <Rocket size={22} />;
    case 'sparkles':
      return <Sparkles size={22} />;
    case 'brain':
    case 'ai':
    case 'ml':
      return <Brain size={22} />;
    case 'database':
      return <Database size={22} />;
    case 'server':
      return <Server size={22} />;
    case 'globe':
      return <Globe size={22} />;
    case 'workflow':
      return <Workflow size={22} />;
    case 'zap':
      return <Zap size={22} />;
    case 'boxes':
      return <Boxes size={22} />;
    case 'bot':
      return <Bot size={22} />;
    case 'laptop':
      return <Laptop size={22} />;
    default:
      return <Cpu size={22} />;
  }
};

const AboutSection: React.FC<AboutSectionProps> = ({
  bio,
  fullName = 'Krishna Naik',
  location = 'Bengaluru, IN',
  achievements = [],
  pillars = [],
  sectionRef,
}) => {
  const sidePillars = (pillars || []).slice(0, 2);
  const bottomPillars = (pillars || []).slice(2);
  const hasSidePillars = sidePillars.length > 0;
  const hasBottomPillars = bottomPillars.length > 0;

  const renderPillarCard = (pillar: import('@/lib/types').AboutPillar, index: number) => (
    <GlassCard
      key={pillar.title || index}
      className="p-5 md:p-6 flex flex-col justify-between bg-gradient-to-br from-neon-indigo/10 via-card-bg/95 to-transparent border-neon-indigo/25 hover:border-neon-indigo/50 transition-all duration-300 shadow-xl rounded-2xl h-full"
    >
      <div>
        <div className="flex items-start gap-3.5 mb-3">
          <div className="p-2.5 rounded-xl bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/30 shrink-0">
            {renderPillarIcon(pillar.icon)}
          </div>
          <div>
            <h4 className="text-base md:text-lg font-bold text-text-primary font-sora leading-snug">
              {pillar.title}
            </h4>
            {pillar.subtitle && (
              <p className="text-[11px] text-neon-cyan font-mono font-medium mt-0.5">
                {pillar.subtitle}
              </p>
            )}
          </div>
        </div>

        {pillar.description && (
          <p className="text-xs text-text-secondary font-mono leading-relaxed mt-2.5">
            {pillar.description}
          </p>
        )}

        {pillar.highlights && pillar.highlights.length > 0 && (
          <div className="mt-3.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
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
    </GlassCard>
  );

  return (
    <SectionWrapper ref={sectionRef} id="about" title="About Me" terminalCommand="whoami">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-6xl mx-auto">
        {/* Main Editorial Card */}
        <GlassCard
          className={`${
            hasSidePillars ? 'lg:col-span-7 xl:col-span-8' : 'lg:col-span-12'
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

        {/* Side Pillars (Up to 2) */}
        {hasSidePillars && (
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4 lg:gap-5 w-full">
            {sidePillars.map(renderPillarCard)}
          </div>
        )}

        {/* Extra Bottom Pillars (3rd pillar onwards move underneath to the left/full width) */}
        {hasBottomPillars && (
          <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full mt-2">
            {bottomPillars.map(renderPillarCard)}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;
