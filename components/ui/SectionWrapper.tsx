'use client';

import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { Copy, Check, Terminal } from 'lucide-react';

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
    const [copied, setCopied] = useState(false);

    const copyCommand = () => {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(terminalCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    };

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
        className="py-10 md:py-24 relative z-10 scroll-mt-20 overflow-hidden"
      >
        {/* Subtle Ambient Spatial Glow Orb */}
        <div
          className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-neon-indigo/10 via-neon-cyan/10 to-transparent blur-3xl pointer-events-none opacity-40"
          aria-hidden="true"
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '150px 0px -50px 0px', amount: 'some' }}
          variants={fadeIn}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative"
        >
          {/* Editorial Section Header with Parallax Stagger */}
          <div className="mb-8 md:mb-12 group flex flex-col items-start gap-1.5">
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
              <motion.span
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="text-[11px] sm:text-xs font-mono text-neon-indigo font-bold tracking-widest px-2.5 py-1 rounded-full bg-neon-indigo/10 border border-neon-indigo/30 shadow-sm"
              >
                {`${num} // SECTION`}
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
                className="text-xl sm:text-2xl md:text-4xl font-black font-sora tracking-tight text-text-primary uppercase"
              >
                {title || id}
              </motion.h2>
            </div>
            <motion.button
              type="button"
              onClick={copyCommand}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              title="Click to copy terminal command"
              aria-label={`Copy terminal command: ${terminalCommand}`}
              className="group/term inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono text-text-secondary mt-1 px-2.5 py-1 rounded-lg bg-slate-950/25 border border-border-color/30 hover:border-neon-cyan/50 hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm text-left"
            >
              <Terminal size={12} className="text-neon-cyan opacity-80 group-hover/term:opacity-100" />
              <span className="text-neon-cyan">~KrishnaNaik6</span>
              <span>{'>'}</span>
              <span className="text-neon-rose group-hover/term:text-neon-indigo transition-colors">{terminalCommand}</span>
              <span className="animate-pulse text-neon-cyan font-bold">_</span>
              <span className="ml-1.5 pl-2 border-l border-border-color/50 flex items-center gap-1 text-[10px] text-text-secondary group-hover/term:text-neon-cyan transition-colors">
                {copied ? (
                  <>
                    <Check size={11} className="text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} className="opacity-60 group-hover/term:opacity-100" />
                    <span className="opacity-0 group-hover/term:opacity-100 transition-opacity">Copy</span>
                  </>
                )}
              </span>
            </motion.button>

            {/* Scroll-triggered Animated Divider Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.15, ease: 'easeOut' }}
              style={{ transformOrigin: '0%' }}
              className="w-full h-px bg-gradient-to-r from-neon-indigo/80 via-neon-cyan/50 to-transparent mt-3 sm:mt-4 shadow-[0_0_8px_rgba(88,166,255,0.4)]"
            />
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
