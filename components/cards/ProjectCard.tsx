'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Code2 } from 'lucide-react';
import { ProjectItem } from '@/lib/types';
import { itemVariants } from './GlassCard';

interface ProjectCardProps {
  project: ProjectItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 70;

  const safeDescription = project.description || 'No description provided.';
  const needsTruncation = safeDescription.length > maxChars;

  const displayDescription =
    isExpanded || !needsTruncation
      ? safeDescription
      : safeDescription.substring(0, maxChars);

  // Mouse position state for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const initialRotateX = -2;
  const initialRotateY = 2;

  const springConfig = { damping: 20, stiffness: 150, mass: 1 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const rotateX = useTransform(sy, [0, 1], [8, -8]);
  const rotateY = useTransform(sx, [0, 1], [-12, 12]);

  const finalRotateX = useTransform(rotateX, (rx) => `calc(${rx}deg + ${initialRotateX}deg)`);
  const finalRotateY = useTransform(rotateY, (ry) => `calc(${ry}deg + ${initialRotateY}deg)`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      onTouchCancel={handleMouseLeave}
      whileHover={{ scale: 1.03, z: 50 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: finalRotateX,
        rotateY: finalRotateY,
        scale: useTransform(sx, [0, 1], [1, 1.03]),
        transformStyle: 'preserve-3d',
      }}
      className="rounded-2xl transition-shadow duration-300 will-change-transform perspective-1000 relative z-10 h-full flex flex-col"
    >
      <div
        className="
          relative p-6 md:p-8 rounded-2xl h-full flex flex-col justify-between
          bg-card-bg backdrop-blur-md border border-glass
          shadow-lg group overflow-hidden
        "
        style={{
          transform: 'translateZ(30px)',
        }}
      >
        {/* Neon Glow Hover Ring */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500 group-hover:ring-2 group-hover:ring-neon-purple/70 group-hover:shadow-[0_0_25px_var(--shadow-purple)]" />

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-xl md:text-2xl font-bold text-neon-cyan group-hover:text-neon-pink transition-colors duration-300">
              {project.name}
            </h3>
            {project.collabed && (
              <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/30 whitespace-nowrap">
                Collab
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono uppercase text-text-secondary tracking-wider">
            <Code2 className="w-3.5 h-3.5 text-neon-pink" />
            <span>{project.type || 'Project'}</span>
          </div>

          <p className="text-text-primary text-sm leading-relaxed mt-2">
            {displayDescription}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-cyan hover:text-neon-pink ml-1 text-xs font-semibold transition-colors duration-200 focus:outline-none"
              >
                {isExpanded ? ' (Read Less)' : '...'}
              </button>
            )}
          </p>
        </div>

        {/* Links Footer */}
        <div className="mt-8 flex flex-wrap gap-3 pt-4 border-t border-white/5">
          {project.link.live ? (
            <a
              href={project.link.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-full bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-bg-main transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </a>
          ) : (
            <span className="text-xs font-semibold px-4 py-2 rounded-full bg-slate-800/40 text-slate-500 border border-slate-700/50 cursor-not-allowed flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Not Hosted</span>
            </span>
          )}

          <a
            href={project.link.git}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-4 py-2 rounded-full border border-border-color text-text-secondary hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 flex items-center gap-2"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
