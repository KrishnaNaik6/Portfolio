'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard, { itemVariants } from '../cards/GlassCard';
import { Compass } from 'lucide-react';

interface InterestSectionProps {
  interest?: string[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const InterestSection: React.FC<InterestSectionProps> = ({ interest = [], sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="interest" title="Interest" terminalCommand="cat $interest">
      <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto shadow-2xl border-neon-cyan/30">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30">
            <Compass size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono text-neon-cyan uppercase font-bold block tracking-widest">
              PASSION & CURIOSITY
            </span>
            <h3 className="text-2xl font-bold font-sora text-text-primary tracking-tight">What Drives Me</h3>
          </div>
        </div>

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

