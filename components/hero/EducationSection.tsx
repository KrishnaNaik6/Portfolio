'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
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
            <GlassCard key={edu.id || index} className="flex flex-col justify-between h-full">
              <div>
                <div className="p-3 w-fit rounded-xl bg-neon-pink/10 border border-neon-pink/20 mb-4">
                  <GraduationCap className="w-7 h-7 text-neon-pink" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2 leading-snug">{edu.edu}</h3>
                <p className="text-base text-neon-cyan font-medium mb-3">{edu.college}</p>
              </div>
              <p className="text-xs text-text-secondary font-mono italic mt-4 pt-3 border-t border-white/5">
                {edu.status}
                {edu.year && ` - ${edu.year}`}
              </p>
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
