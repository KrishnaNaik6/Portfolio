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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const SectionWrapper = React.forwardRef<HTMLElement, SectionWrapperProps>(
  ({ id, title, terminalCommand, children }, ref) => {
    const localRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(localRef, { once: true, amount: 0.1 });

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
        className="py-12 md:py-20 relative z-10 scroll-mt-24"
      >
        <motion.div
          ref={localRef}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeIn}
          className="max-w-7xl mx-auto px-6 lg:px-8"
        >
          {/* Editorial Section Header */}
          <div className="mb-10 group flex flex-col items-start gap-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-neon-indigo font-bold tracking-widest px-2.5 py-0.5 rounded bg-neon-indigo/15 border border-neon-indigo/30">
                {num} // SECTION
              </span>
              <h2 className="text-xl md:text-3xl font-black font-sora tracking-tight text-text-primary uppercase">
                {title || id}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary mt-1">
              <span className="text-neon-cyan">~KrishnaNaik6</span>
              <span>{'>'}</span>
              <span className="text-neon-rose">{terminalCommand}</span>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-neon-indigo/60 via-neon-cyan/40 to-transparent mt-3" />
          </div>

          {/* Section Content */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
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
