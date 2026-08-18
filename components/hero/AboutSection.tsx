'use client';

import React from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';
import { Cpu, Code2, Sparkles } from 'lucide-react';

interface AboutSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="about" title="About Me" terminalCommand="whoami">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Main Editorial Card */}
        <GlassCard className="lg:col-span-8 p-8 md:p-12 shadow-2xl flex flex-col justify-between border-neon-indigo/30">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo text-xs font-mono">
              <Sparkles size={14} />
              <span>BIO & PHILOSOPHY</span>
            </div>

            <p className="text-xl md:text-2xl text-text-primary leading-relaxed font-sora font-semibold tracking-tight">
              I'm <strong className="text-neon-indigo font-bold text-glow-indigo">Krishna Naik</strong>, a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              I enjoy building full-stack applications and experimenting with intelligent systems that bridge the gap between technology and real-world impact. With hands-on experience in web development, backend systems, and AI-driven projects, I'm passionate about solving problems through innovation and creativity.
            </p>

            <p className="text-text-secondary leading-relaxed text-base md:text-lg">
              My goal is to explore how AI can transform everyday life while sharpening my skills as a developer and researcher. Outside of coding, I love exploring emerging tech trends and challenging myself with projects that push the boundaries of what's possible.
            </p>
          </div>
        </GlassCard>

        {/* Side Highlight Pillars */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <GlassCard className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-br from-neon-indigo/10 to-transparent border-neon-indigo/25">
            <div className="p-3 rounded-xl bg-neon-indigo/20 w-fit mb-4 text-neon-indigo">
              <Cpu size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-text-primary font-sora mb-1">AI & Machine Learning</h4>
              <p className="text-xs text-text-secondary font-mono leading-relaxed">
                Specialized in neural model exploration, intelligent algorithms, and smart automation.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-br from-neon-cyan/10 to-transparent border-neon-cyan/25">
            <div className="p-3 rounded-xl bg-neon-cyan/20 w-fit mb-4 text-neon-cyan">
              <Code2 size={24} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-text-primary font-sora mb-1">Full-Stack Architecture</h4>
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
