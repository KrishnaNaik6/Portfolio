'use client';

import React, { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  title?: string;
  terminalCommand: string;
  children: React.ReactNode;
}

export const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ id, title, terminalCommand, children }, ref) => {
    const sectionNumbers: Record<string, string> = {
      about: '02',
      education: '03',
      experience: '04',
      projects: '05',
      skills: '06',
      interest: '07',
      'git-stats': '08',
      contact: '09',
    };

    const num = sectionNumbers[id.toLowerCase()] || '00';

    return (
      <section
        id={id.toLowerCase()}
        ref={ref}
        className="py-10 md:py-24 relative z-10 scroll-mt-20"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '150px 0px -50px 0px', amount: 'some' }}
          variants={fadeIn}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Editorial Section Header */}
          <div className="mb-8 md:mb-12 group flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <span className="text-[11px] sm:text-xs font-mono text-neon-indigo font-bold tracking-widest px-2.5 py-1 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 shadow-sm">
                {num} // SECTION
              </span>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black font-sora tracking-tight text-text-primary uppercase">
                {title || id}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono text-text-secondary mt-1">
              <span className="text-neon-cyan">~KrishnaNaik6</span>
              <span>{'>'}</span>
              <span className="text-neon-rose">{terminalCommand}</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-neon-indigo/60 via-neon-cyan/40 to-transparent mt-3 sm:mt-4" />
          </div>

          {/* Section Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '150px 0px -50px 0px', amount: 'some' }}
            variants={staggerContainer}
          >
            {children}
          </motion.div>
        </motion.div>
      </section>
    );
  }
);

SectionWrapper.displayName = 'SectionWrapper';

export default SectionWrapper;

