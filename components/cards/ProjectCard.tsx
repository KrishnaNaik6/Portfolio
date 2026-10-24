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
  const maxChars = featured ? 130 : 105;

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
      className={`rounded-2xl transition-shadow duration-300 relative z-10 h-full flex flex-col ${className}`}
    >
      <div
        className={`
          relative ${featured ? 'p-5 sm:p-6' : 'p-4 sm:p-5'} rounded-2xl h-full flex flex-col justify-between
          backdrop-blur-2xl sm:backdrop-blur-3xl transition-all duration-300 group
          ${
            featured
              ? 'bg-slate-900/90 border border-neon-indigo/50 hover:border-neon-indigo/80 shadow-[0_0_25px_rgba(99,102,241,0.2)] ring-1 ring-neon-indigo/30'
              : isActive
              ? 'bg-slate-900/95 border-2 border-neon-cyan/70 shadow-[0_0_35px_rgba(88,166,255,0.4)] ring-1 ring-neon-cyan/50'
              : 'bg-slate-950/85 border border-border-color/60 shadow-lg hover:border-neon-indigo/40'
          }
        `}
      >
        {/* Interactive mouse spotlight aura */}
        {spotlightPos && (
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl overflow-hidden transition-opacity duration-200"
            style={{
              background: `radial-gradient(280px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${
                isActive ? 'rgba(88, 166, 255, 0.22)' : 'rgba(99, 102, 241, 0.16)'
              }, transparent 75%)`,
            }}
          />
        )}

        {/* Top Highlight Line */}
        {featured ? (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-indigo via-neon-cyan to-neon-rose opacity-90 rounded-t-2xl" />
        ) : isActive ? (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-indigo to-neon-purple opacity-100 shadow-[0_0_12px_rgba(88,166,255,0.8)] rounded-t-2xl" />
        ) : null}

        {/* Neon Glow Hover Ring */}
        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-500 ${
          isActive
            ? 'ring-1 ring-neon-cyan/50 shadow-[0_0_25px_var(--shadow-cyan)]'
            : 'group-hover:ring-2 group-hover:ring-neon-indigo/70 group-hover:shadow-[0_0_25px_var(--shadow-indigo)]'
        }`} />

        <div className={`flex flex-col ${featured ? 'gap-2.5 sm:gap-3' : 'gap-2'} relative z-10 flex-1 min-h-0`}>
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex-1">
              <span className={`text-[10px] sm:text-[11px] font-mono font-bold block mb-1 ${
                isActive ? 'text-neon-cyan' : 'text-neon-indigo'
              }`}>
                {projectNum} / PROJECT
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {highlightLabel && (
                  <span
                    data-testid="project-highlight-badge"
                    className="inline-flex items-center px-2 py-0.5 rounded-full bg-neon-cyan/15 border border-neon-cyan/35 text-neon-cyan text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider max-w-full truncate"
                  >
                    {highlightLabel}
                  </span>
                )}
                {featured && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neon-indigo/20 border border-neon-indigo/40 text-neon-indigo text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider">
                    <Sparkles size={11} />
                    <span>Featured Project</span>
                  </div>
                )}
                {isActive && (
                  <div
                    data-testid="project-inview-badge"
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(88,166,255,0.4)]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
                    <span>In View</span>
                  </div>
                )}
              </div>
              <h3
                title={project.name}
                className={`text-base sm:text-lg font-black font-sora tracking-tight line-clamp-1 transition-colors duration-300 ${
                  isActive ? 'text-text-primary group-hover:text-neon-cyan' : 'text-text-primary group-hover:text-neon-indigo'
                }`}
              >
                {project.name}
              </h3>
            </div>

            {project.collabed && (
              <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30 shrink-0 font-semibold">
                Collab
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase text-text-secondary tracking-wider">
            <Code2 className="w-3.5 h-3.5 text-neon-rose shrink-0" />
            <span>{project.type || 'Repository'}</span>
          </div>

          <p className="text-text-secondary text-xs sm:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-3 mt-1 font-sans">
            {displayDescription}
            {needsTruncation && (
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-indigo hover:text-neon-cyan ml-1 text-[11px] font-semibold transition-colors duration-200 focus:outline-none cursor-pointer"
              >
                {isExpanded ? '(Less)' : '...'}
              </button>
            )}
          </p>
        </div>

        {/* Action Buttons: Always anchored at bottom with guaranteed side-by-side visibility */}
        <div
          className={`shrink-0 mt-auto pt-3 border-t border-border-color/60 relative z-10 w-full ${
            project.link.git ? 'grid grid-cols-2 gap-2' : 'flex'
          }`}
        >
          {project.link.live ? (
            <a
              href={project.link.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs font-sora font-bold py-2 px-2.5 rounded-xl bg-neon-indigo text-white hover:bg-neon-indigo/90 hover:shadow-[0_0_15px_rgba(99,102,241,0.45)] transition-all duration-300 flex items-center justify-center gap-1.5 text-center truncate group/btn cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover/btn:scale-110 transition-transform" />
              <span className="truncate">Live App</span>
            </a>
          ) : (
            <span className="text-[11px] sm:text-xs font-sora font-medium py-2 px-2.5 rounded-xl bg-slate-950/50 text-text-secondary/70 border border-border-color/60 cursor-not-allowed flex items-center justify-center gap-1.5 text-center truncate">
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-50" />
              <span className="truncate">Code Only</span>
            </span>
          )}

          {project.link.git ? (
            <a
              href={project.link.git}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs font-sora font-semibold py-2 px-2.5 rounded-xl border border-border-color/80 text-text-secondary hover:border-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10 transition-all duration-300 flex items-center justify-center gap-1.5 text-center truncate group/btn cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 shrink-0 group-hover/btn:scale-110 transition-transform" />
              <span className="truncate">Repository</span>
            </a>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

