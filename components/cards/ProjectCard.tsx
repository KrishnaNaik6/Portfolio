'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { ProjectItem } from '@/lib/types';
import { itemVariants } from './GlassCard';

interface ProjectCardProps {
  project: ProjectItem;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, featured = false }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = featured ? 140 : 75;

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
      whileHover={{ scale: 1.02, z: 50 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX: finalRotateX,
        rotateY: finalRotateY,
        scale: useTransform(sx, [0, 1], [1, 1.02]),
        transformStyle: 'preserve-3d',
      }}
      className={`rounded-3xl transition-shadow duration-300 will-change-transform perspective-1000 relative z-10 h-full flex flex-col ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div
        className={`
          relative p-7 md:p-9 rounded-3xl h-full flex flex-col justify-between
          bg-card-bg backdrop-blur-xl border border-white/10
          shadow-2xl group overflow-hidden transition-all duration-300
          ${featured ? 'bg-gradient-to-br from-card-bg via-card-bg to-neon-purple/10 border-neon-purple/30' : ''}
        `}
        style={{
          transform: 'translateZ(30px)',
        }}
      >
        {/* Neon Glow Hover Ring */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none transition-all duration-500 group-hover:ring-2 group-hover:ring-neon-purple/70 group-hover:shadow-[0_0_30px_var(--shadow-purple)]" />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              {featured && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-[10px] font-mono uppercase tracking-widest mb-3">
                  <Sparkles size={12} />
                  <span>Featured Project</span>
                </div>
              )}
              <h3 className="text-2xl md:text-3xl font-black font-sora text-neon-cyan group-hover:text-neon-pink transition-colors duration-300 tracking-tight">
                {project.name}
              </h3>
            </div>

            {project.collabed && (
              <span className="text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shrink-0">
                Collaborative
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono uppercase text-text-secondary tracking-wider">
            <Code2 className="w-4 h-4 text-neon-pink shrink-0" />
            <span>{project.type || 'Repository'}</span>
          </div>

          <p className="text-text-primary text-sm md:text-base leading-relaxed mt-1">
            {displayDescription}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-cyan hover:text-neon-pink ml-1.5 text-xs font-semibold transition-colors duration-200 focus:outline-none"
              >
                {isExpanded ? '(Read Less)' : '...'}
              </button>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center gap-3 pt-5 border-t border-white/5">
          {project.link.live ? (
            <a
              href={project.link.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sora font-bold px-4 py-2.5 rounded-full bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-bg-main transition-all duration-300 flex items-center gap-2 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Application</span>
            </a>
          ) : (
            <span className="text-xs font-sora font-medium px-4 py-2.5 rounded-full bg-slate-900/50 text-slate-500 border border-slate-800 cursor-not-allowed flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Code Only</span>
            </span>
          )}

          <a
            href={project.link.git}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-sora font-semibold px-4 py-2.5 rounded-full border border-border-color text-text-secondary hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 flex items-center gap-2"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Repository</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
