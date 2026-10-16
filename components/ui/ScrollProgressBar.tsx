'use client';

import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] pointer-events-none bg-slate-950/40 backdrop-blur-sm"
      aria-hidden="true"
      data-testid="scroll-progress-container"
    >
      <motion.div
        data-testid="scroll-progress-bar"
        style={{ scaleX, transformOrigin: '0%' }}
        className="h-full w-full bg-gradient-to-r from-neon-cyan via-neon-indigo to-neon-purple shadow-[0_0_12px_rgba(88,166,255,0.7),0_0_24px_rgba(99,102,241,0.5)] relative"
      >
        {/* Glowing spark orb at current scroll head */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_16px_rgba(88,166,255,0.9)]" />
      </motion.div>
    </div>
  );
};

export default ScrollProgressBar;
