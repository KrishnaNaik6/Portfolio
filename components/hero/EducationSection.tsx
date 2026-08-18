'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { EducationItem } from '@/lib/types';
import SectionWrapper, { staggerContainer } from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';

interface EducationSectionProps {
  eduData?: EducationItem[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const EducationSection: React.FC<EducationSectionProps> = ({ eduData = [], sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="education" title="Education" terminalCommand="echo $education">
      {eduData && eduData.length > 0 ? (
        <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {eduData.map((edu, index) => (
            <GlassCard key={edu.id || index} className="flex flex-col justify-between h-full group hover:border-neon-pink/40 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3.5 rounded-2xl bg-neon-pink/10 border border-neon-pink/30 text-neon-pink group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-slate-950/60 border border-white/10 text-text-secondary">
                    Degree
                  </span>
                </div>

                <h3 className="text-xl font-bold font-sora text-text-primary mb-2 leading-snug">
                  {edu.edu}
                </h3>
                <p className="text-sm font-semibold text-neon-cyan mb-4 font-sora">
                  {edu.college}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-text-secondary">
                <span className="text-neon-pink font-medium">{edu.status}</span>
                {edu.year && <span>{edu.year}</span>}
              </div>
            </GlassCard>
          ))}
        </motion.div>
      ) : (
        <div className="text-center text-text-secondary font-mono py-8">
          Loading education records...
        </div>
      )}
    </SectionWrapper>
  );
};

export default EducationSection;
