'use client';

import React from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';
import { Cpu, Code2, Sparkles, Terminal, Rocket } from 'lucide-react';

interface AboutSectionProps {
  achievements?: string[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ achievements = [], sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="about" title="About Me" terminalCommand="whoami">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Main Editorial Card */}
        <GlassCard className="lg:col-span-8 p-8 md:p-12 shadow-2xl flex flex-col justify-between border-neon-indigo/30">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo text-xs font-mono">
              <Sparkles size={14} />
              <span>BIO & PHILOSOPHY</span>
            </div>

            <p className="text-xl md:text-2xl text-text-primary leading-relaxed font-sora font-semibold tracking-tight">
              I'm <strong className="text-neon-indigo font-bold text-glow-indigo">Krishna Naik</strong>, a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              I enjoy building full-stack applications and experimenting with intelligent systems that bridge the gap between technology and real-world impact. With hands-on experience in web development, backend systems, and AI-driven projects, I'm passionate about solving problems through innovation and creativity.
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

          <div className="pt-6 mt-6 border-t border-border-color flex flex-wrap items-center gap-4 text-xs font-mono text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Based in Bengaluru, IN</span>
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

        {/* Side Highlight Pillars */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-br from-neon-indigo/10 via-card-bg to-transparent border-neon-indigo/25">
            <div className="p-3.5 rounded-2xl bg-neon-indigo/20 w-fit mb-4 text-neon-indigo">
              <Cpu size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-text-primary font-sora mb-1.5">AI & Machine Learning</h4>
              <p className="text-xs text-text-secondary font-mono leading-relaxed">
                Specialized in neural model exploration, intelligent algorithms, and smart automation.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-br from-neon-cyan/10 via-card-bg to-transparent border-neon-cyan/25">
            <div className="p-3.5 rounded-2xl bg-neon-cyan/20 w-fit mb-4 text-neon-cyan">
              <Code2 size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-text-primary font-sora mb-1.5">Full-Stack Architecture</h4>
              <p className="text-xs text-text-secondary font-mono leading-relaxed">
                Building scalable web apps, clean APIs, and interactive UI systems with modern tech.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default AboutSection;

