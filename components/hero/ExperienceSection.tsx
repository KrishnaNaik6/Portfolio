'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { ExperienceItem } from '@/lib/types';
import SectionWrapper, { staggerContainer } from '../ui/SectionWrapper';
import GlassCard, { itemVariants } from '../cards/GlassCard';

interface ExperienceSectionProps {
  expData?: ExperienceItem[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ expData = [], sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="experience" title="Experience" terminalCommand="echo $experience">
      {expData && expData.length > 0 ? (
        <div className="relative max-w-4xl mx-auto pl-4 md:pl-8">
          {/* Vertical Connecting Glow Line */}
          <div className="absolute left-2.5 md:left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-neon-cyan via-neon-purple to-transparent opacity-60" />

          <motion.div variants={staggerContainer} className="space-y-8">
            {expData.map((exp, i) => (
              <div key={i} className="relative pl-6 md:pl-10">
                {/* Illuminated Timeline Node Dot */}
                <div className="absolute left-[-5px] md:left-[11px] top-7 w-4 h-4 rounded-full bg-neon-cyan ring-4 ring-neon-cyan/20 shadow-[0_0_12px_rgba(0,245,212,0.6)]" />

                <GlassCard className="p-8 shadow-2xl hover:border-neon-cyan/40 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan shrink-0">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold font-sora text-text-primary tracking-tight">
                          {exp.role}
                        </h3>
                        <p className="text-base text-neon-pink font-semibold mt-0.5 font-sora">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-mono text-text-secondary py-1.5 px-3.5 rounded-full bg-slate-950/60 border border-white/10 shrink-0">
                      <Calendar size={13} className="text-neon-cyan" />
                      <span>{exp.tenure_period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {exp.works.map((point, index) => (
                      <motion.li key={index} variants={itemVariants} className="text-sm md:text-base leading-relaxed flex items-start gap-3">
                        <ChevronRight className="w-4 h-4 text-neon-cyan shrink-0 mt-1" />
                        <span className="text-text-secondary">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="text-center text-text-secondary font-mono py-8">
          Loading experience records...
        </div>
      )}
    </SectionWrapper>
  );
};

export default ExperienceSection;
