'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TypingText from '../ui/TypingText';
import { ArrowDownRight, Sparkles, FileText, Send } from 'lucide-react';
import AnchorLink from '../ui/AnchorLink';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) {
      onComplete();
    }
  }, [complete, onComplete]);

  const badges = ['Full-Stack Dev', 'AI & ML Engineer', 'React 19 / Next.js', 'TypeScript', 'Python'];

  return (
    <div className="flex flex-col items-center justify-center bg-transparent pt-12 pb-16 px-4 text-center relative z-10 max-w-6xl mx-auto">
      {/* Status Badge Pill */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-neon-cyan/30 text-neon-cyan text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(0,245,212,0.15)]"
      >
        <span className="w-2 h-2 rounded-full bg-neon-cyan animate-ping" />
        <span>SYSTEM ONLINE // BENGALURU, IN</span>
      </motion.div>

      {/* Main Title Banner with Typing Effect */}
      <h1
        className="
          text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-sora
          bg-gradient-to-r from-neon-cyan via-text-primary to-neon-purple
          text-transparent bg-clip-text
          tracking-tight select-none leading-[1.1] max-w-5xl mx-auto mb-8
          drop-shadow-sm
        "
      >
        <TypingText speed={40} onComplete={() => setComplete(true)}>
          Hey there!! Welcome to my Portfolio
        </TypingText>
      </h1>

      {/* Interactive Tech Badge Pills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto mb-10"
      >
        {badges.map((badge, idx) => (
          <span
            key={idx}
            className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-card-bg border border-white/10 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/40 transition-all cursor-default shadow-sm"
          >
            #{badge}
          </span>
        ))}
      </motion.div>

      {/* CTA Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <AnchorLink to="projects">
          <div className="px-6 py-3.5 rounded-full bg-neon-cyan text-bg-main font-bold text-sm font-sora flex items-center gap-2 hover:bg-neon-cyan/90 transition-all shadow-[0_0_20px_rgba(0,245,212,0.4)] hover:scale-105 cursor-pointer">
            <span>Explore Projects</span>
            <ArrowDownRight size={18} />
          </div>
        </AnchorLink>

        <AnchorLink to="contact">
          <div className="px-6 py-3.5 rounded-full bg-card-bg border border-white/15 text-text-primary font-semibold text-sm font-sora flex items-center gap-2 hover:border-neon-purple hover:text-neon-purple transition-all hover:scale-105 cursor-pointer">
            <Send size={16} />
            <span>Get in Touch</span>
          </div>
        </AnchorLink>

        <a
          href="/KrishnaNaik.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-full bg-card-bg border border-white/15 text-text-secondary font-semibold text-sm font-sora flex items-center gap-2 hover:border-neon-pink hover:text-neon-pink transition-all hover:scale-105"
        >
          <FileText size={16} />
          <span>Resume</span>
        </a>
      </motion.div>
    </div>
  );
};

export default Welcome;
