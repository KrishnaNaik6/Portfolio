'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard, { itemVariants } from '../cards/GlassCard';

interface InterestSectionProps {
  interest?: string[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const InterestSection: React.FC<InterestSectionProps> = ({ interest = [], sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="interest" title="Interest" terminalCommand="cat $interest">
      <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto shadow-2xl">
        <h3 className="text-2xl font-bold text-neon-cyan mb-6 tracking-tight">What Drives Me</h3>
        {interest && interest.length > 0 ? (
          <ul className="space-y-4 text-text-primary text-base md:text-lg">
            {interest.map((item, index) => (
              <motion.li key={index} variants={itemVariants} className="leading-relaxed flex items-start gap-3">
                <span className="text-neon-pink font-mono text-sm mt-1">✦</span>
                <span className="text-text-secondary">{item}</span>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary leading-relaxed font-mono">
            Exploring artificial intelligence, high-performance systems, open-source software, and intuitive user experiences.
          </p>
        )}
      </GlassCard>
    </SectionWrapper>
  );
};

export default InterestSection;
