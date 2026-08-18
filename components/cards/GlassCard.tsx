'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => (
  <motion.div
    variants={itemVariants}
    onClick={onClick}
    className={`
      bg-card-bg backdrop-blur-xl rounded-3xl p-6 md:p-8
      border border-border-color
      shadow-xl hover:shadow-2xl hover:border-neon-indigo/40 hover:scale-[1.01]
      transition-all duration-300 relative overflow-hidden
      ${className}
    `}
  >
    {/* Inner highlight overlay */}
    <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-inner-light" />
    {children}
  </motion.div>
);

export default GlassCard;

