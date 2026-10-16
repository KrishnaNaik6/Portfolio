'use client';

import React, { useRef, useState } from 'react';
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

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={cardRef}
      variants={itemVariants}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos(null);
      }}
      whileHover={{ y: -2, scale: 1.008 }}
      transition={{ duration: 0.2 }}
      className={`
        bg-card-bg backdrop-blur-xl rounded-3xl p-6 md:p-8
        border border-border-color
        shadow-xl hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)] hover:border-neon-indigo/50
        transition-all duration-300 relative overflow-hidden group
        ${className}
      `}
    >
      {/* Interactive mouse spotlight aura */}
      {isHovered && mousePos && (
        <div
          className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 opacity-100"
          style={{
            background: `radial-gradient(380px circle at ${mousePos.x}px ${mousePos.y}px, rgba(88, 166, 255, 0.12), rgba(99, 102, 241, 0.04) 50%, transparent 80%)`,
          }}
        />
      )}

      {/* Inner highlight overlay */}
      <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-inner-light" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default GlassCard;

