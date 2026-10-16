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
  isActive?: boolean;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  featured = false,
  isActive = false,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = featured ? 85 : 65;

  const safeDescription = project.description || 'No description provided.';
  const needsTruncation = safeDescription.length > maxChars;

  const displayDescription =
    isExpanded || !needsTruncation
      ? safeDescription
      : safeDescription.substring(0, maxChars);

  const highlightLabel =
    typeof project.highlightLabel === 'string'
      ? project.highlightLabel.trim()
      : '';

  // Mouse position state for 3D tilt
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 150, mass: 1 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  const rotateX = useTransform(sy, [0, 1], [6, -6]);
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || window.innerWidth < 768) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
    setSpotlightPos({ x: mouseX, y: mouseY });
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
    setSpotlightPos(null);
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
      className={`rounded-xl sm:rounded-2xl transition-shadow duration-300 relative z-10 h-full flex flex-col ${className}`}
    >
      <div
        className={`
          relative ${featured ? 'p-5 sm:p-6' : 'p-3 sm:p-3.5 md:p-4'} rounded-xl sm:rounded-2xl h-full flex flex-col justify-between
          backdrop-blur-2xl sm:backdrop-blur-3xl transition-all duration-300 group overflow-hidden
          ${
            featured
              ? 'bg-slate-900/90 border border-neon-indigo/50 hover:border-neon-indigo/80 shadow-[0_0_25px_rgba(99,102,241,0.2)] ring-1 ring-neon-indigo/30'
              : isActive
              ? 'bg-slate-900/95 border-2 border-neon-cyan/70 shadow-[0_0_30px_rgba(88,166,255,0.35)] ring-1 ring-neon-cyan/50'
              : 'bg-slate-950/80 border border-border-color/50 shadow-lg hover:border-neon-indigo/40'
          }
        `}
      >
        {/* Interactive mouse spotlight aura */}
        {spotlightPos && (
          <div
            className="pointer-events-none absolute -inset-px rounded-xl sm:rounded-2xl transition-opacity duration-200"
            style={{
              background: `radial-gradient(280px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${
                isActive ? 'rgba(88, 166, 255, 0.22)' : 'rgba(99, 102, 241, 0.16)'
              }, transparent 75%)`,
            }}
          />
        )}

        {/* Top Highlight Line */}
        {featured ? (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-indigo via-neon-cyan to-neon-rose opacity-90" />
        ) : isActive ? (
          <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-neon-cyan via-neon-indigo to-neon-purple opacity-100 shadow-[0_0_12px_rgba(88,166,255,0.8)]" />
        ) : null}

        {/* Neon Glow Hover Ring */}
        <div className={`absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none transition-all duration-500 ${
          isActive
            ? 'ring-1 ring-neon-cyan/50 shadow-[0_0_25px_var(--shadow-cyan)]'
            : 'group-hover:ring-2 group-hover:ring-neon-indigo/70 group-hover:shadow-[0_0_25px_var(--shadow-indigo)]'
        }`} />

        <div className={`flex flex-col ${featured ? 'gap-2.5 sm:gap-3' : 'gap-1.5 sm:gap-2'} relative z-10`}>
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <span className={`text-[9px] sm:text-[10px] font-mono font-bold block mb-0.5 ${
                isActive ? 'text-neon-cyan' : 'text-neon-indigo'
              }`}>
                {projectNum} / PROJECT
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                {highlightLabel && (
                  <span
                    data-testid="project-highlight-badge"
                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-neon-cyan/15 border border-neon-cyan/35 text-neon-cyan text-[8px] sm:text-[9px] font-mono font-semibold uppercase tracking-wider max-w-full truncate"
                  >
                    {highlightLabel}
                  </span>
                )}
                {featured && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-indigo/20 border border-neon-indigo/40 text-neon-indigo text-[8px] sm:text-[9px] font-mono font-semibold uppercase tracking-wider">
                    <Sparkles size={10} />
                    <span>Featured Project</span>
                  </div>
                )}
                {isActive && (
                  <div
                    data-testid="project-inview-badge"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(88,166,255,0.4)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
                    <span>In View</span>
                  </div>
                )}
              </div>
              <h3 className={`text-sm sm:text-base md:text-lg font-black font-sora tracking-tight truncate transition-colors duration-300 ${
                isActive ? 'text-text-primary group-hover:text-neon-cyan' : 'text-text-primary group-hover:text-neon-indigo'
              }`}>
                {project.name}
              </h3>
            </div>

            {project.collabed && (
              <span className="text-[8px] sm:text-[9px] uppercase font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shrink-0 font-semibold">
                Collab
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-mono uppercase text-text-secondary tracking-wider">
            <Code2 className="w-3 h-3 text-neon-rose shrink-0" />
            <span>{project.type || 'Repository'}</span>
          </div>

          <p className="text-text-primary text-[11px] sm:text-xs leading-relaxed line-clamp-2 sm:line-clamp-3 mt-0.5">
            {displayDescription}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-indigo hover:text-neon-cyan ml-1 text-[10px] font-semibold transition-colors duration-200 focus:outline-none"
              >
                {isExpanded ? '(Less)' : '...'}
              </button>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-2.5 pt-2 sm:mt-3 sm:pt-2.5 flex flex-wrap items-center gap-1.5 sm:gap-2 border-t border-border-color/60 relative z-10">
          {project.link.live ? (
            <a
              href={project.link.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] sm:text-[11px] font-sora font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-neon-indigo text-white hover:bg-neon-indigo/90 transition-all duration-300 flex items-center gap-1 shadow-[0_0_12px_rgba(99,102,241,0.3)]"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Live App</span>
            </a>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-sora font-medium px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-slate-950/40 text-text-secondary border border-border-color/60 cursor-not-allowed flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>Code Only</span>
            </span>
          )}

          {project.link.git ? <a
            href={project.link.git}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] sm:text-[11px] font-sora font-semibold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-border-color text-text-secondary hover:border-neon-indigo hover:text-neon-indigo transition-all duration-300 flex items-center gap-1"
          >
            <Github className="w-3 h-3" />
            <span>Repository</span>
          </a> : null}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

