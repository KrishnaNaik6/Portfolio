'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, ExternalLink, Code2, Sparkles } from 'lucide-react';
import { ProjectItem } from '@/lib/types';
import { itemVariants } from './GlassCard';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  featured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, featured = false }) => {
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

  const springConfig = { damping: 20, stiffness: 150, mass: 1 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || window.innerWidth < 768) return;
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

  const projectNum = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      style={{
        rotateX,
        rotateY,
      }}
      className={`rounded-2xl sm:rounded-3xl transition-shadow duration-300 relative z-10 h-full flex flex-col ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div
        className={`
          relative p-5 sm:p-7 md:p-9 rounded-2xl sm:rounded-3xl h-full flex flex-col justify-between
          bg-card-bg backdrop-blur-xl border border-border-color
          shadow-2xl group overflow-hidden transition-all duration-300
          ${featured ? 'bg-gradient-to-br from-card-bg via-card-bg to-neon-indigo/15 border-neon-indigo/30' : ''}
        `}
      >
        {/* Neon Glow Hover Ring */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none transition-all duration-500 group-hover:ring-2 group-hover:ring-neon-indigo/70 group-hover:shadow-[0_0_30px_var(--shadow-indigo)]" />

        <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
          <div className="flex justify-between items-start gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <span className="text-[11px] sm:text-xs font-mono text-neon-indigo font-bold block mb-1">
                {projectNum} / PROJECT
              </span>
              {featured && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-neon-indigo/20 border border-neon-indigo/40 text-neon-indigo text-[9px] sm:text-[10px] font-mono uppercase tracking-widest mb-2 sm:mb-3">
                  <Sparkles size={11} />
                  <span>Featured Project</span>
                </div>
              )}
              <h3 className="text-lg sm:text-2xl md:text-3xl font-black font-sora text-text-primary group-hover:text-neon-indigo transition-colors duration-300 tracking-tight break-words">
                {project.name}
              </h3>
            </div>

            {project.collabed && (
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shrink-0 font-semibold">
                Collab
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono uppercase text-text-secondary tracking-wider">
            <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neon-rose shrink-0" />
            <span>{project.type || 'Repository'}</span>
          </div>

          <p className="text-text-primary text-xs sm:text-sm md:text-base leading-relaxed mt-0.5 sm:mt-1">
            {displayDescription}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-indigo hover:text-neon-cyan ml-1.5 text-xs font-semibold transition-colors duration-200 focus:outline-none"
              >
                {isExpanded ? '(Read Less)' : '...'}
              </button>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-2 sm:gap-3 pt-4 sm:pt-5 border-t border-border-color relative z-10">
          {project.link.live ? (
            <a
              href={project.link.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs font-sora font-bold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-neon-indigo text-white hover:bg-neon-indigo/90 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live App</span>
            </a>
          ) : (
            <span className="text-[11px] sm:text-xs font-sora font-medium px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-slate-950/30 text-text-secondary border border-border-color cursor-not-allowed flex items-center gap-1.5 sm:gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Code Only</span>
            </span>
          )}

          <a
            href={project.link.git}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] sm:text-xs font-sora font-semibold px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full border border-border-color text-text-secondary hover:border-neon-indigo hover:text-neon-indigo transition-all duration-300 flex items-center gap-1.5 sm:gap-2"
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

