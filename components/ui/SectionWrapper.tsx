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
          {/* Terminal Header */}
          <div className="mb-10 group">
            <h2 className="text-lg md:text-2xl font-mono tracking-tight flex items-center gap-2 flex-wrap">
              <span className="text-neon-cyan font-semibold">~KrishnaNaik6</span>
              <span className="text-gray-400 group-hover:text-neon-pink transition-colors duration-300">
                {' > '}
              </span>
              <span className="text-neon-pink group-hover:text-neon-cyan transition-colors duration-300 font-medium">
                {terminalCommand}
              </span>
            </h2>
            <div className="w-full h-px bg-gradient-to-r from-neon-cyan/60 via-neon-purple/40 to-transparent mt-2" />
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
