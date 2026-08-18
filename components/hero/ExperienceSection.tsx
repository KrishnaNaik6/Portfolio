'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
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
        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          {expData.map((exp, i) => (
            <GlassCard key={i} className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 shrink-0">
                    <Briefcase className="w-6 h-6 text-neon-cyan" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-text-primary tracking-tight">{exp.role}</h3>
                    <p className="text-lg text-neon-pink font-semibold mt-0.5">{exp.company}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-text-secondary py-1 px-3 rounded-full bg-slate-800/40 border border-white/5 whitespace-nowrap">
                  {exp.tenure_period}
                </span>
              </div>
              <ul className="space-y-3 pl-2 text-text-primary">
                {exp.works.map((point, index) => (
                  <motion.li key={index} variants={itemVariants} className="text-base leading-relaxed flex items-start gap-3">
                    <span className="text-neon-cyan font-mono text-sm mt-1">➢</span>
                    <span className="text-text-secondary">{point}</span>
                  </motion.li>
                ))}
              </ul>
            </GlassCard>
          ))}
        </motion.div>
      ) : (
        <div className="text-center text-text-secondary font-mono py-8">
          Loading experience records...
        </div>
      )}
    </SectionWrapper>
  );
};

export default ExperienceSection;
