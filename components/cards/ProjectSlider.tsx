'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectItem } from '@/lib/types';
import ProjectCard from './ProjectCard';

interface ProjectSliderProps {
  projects: ProjectItem[];
}

function getCircularDiff(index: number, currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  let diff = (index - currentIndex) % total;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

const ProjectSlider: React.FC<ProjectSliderProps> = ({ projects }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Keep index within bounds if projects array changes
  useEffect(() => {
    if (currentIndex >= projects.length && projects.length > 0) {
      setCurrentIndex(0);
    }
  }, [projects.length, currentIndex]);

  const handleNext = useCallback(() => {
    if (projects.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const handlePrev = useCallback(() => {
    if (projects.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const handleSelect = useCallback((index: number) => {
    if (index >= 0 && index < projects.length) {
      setCurrentIndex(index);
    }
  }, [projects.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  const getCardStyle = (diff: number) => {
    if (diff === 0) {
      return {
        x: '0%',
        scale: 1,
        rotateY: 0,
        opacity: 1,
        zIndex: 40,
        pointerEvents: 'auto' as const,
        filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.9)) drop-shadow(0 0 25px rgba(88, 166, 255, 0.35))',
      };
    }
    if (diff === -1) {
      return {
        x: '-48%',
        scale: 0.8,
        rotateY: 12,
        opacity: 0.22,
        zIndex: 15,
        pointerEvents: 'auto' as const,
        filter: 'blur(5px) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.7))',
      };
    }
    if (diff === 1) {
      return {
        x: '48%',
        scale: 0.8,
        rotateY: -12,
        opacity: 0.22,
        zIndex: 15,
        pointerEvents: 'auto' as const,
        filter: 'blur(5px) drop-shadow(0 6px 14px rgba(0, 0, 0, 0.7))',
      };
    }
    // Offscreen
    return {
      x: diff < 0 ? '-100%' : '100%',
      scale: 0.65,
      rotateY: diff < 0 ? 20 : -20,
      opacity: 0,
      zIndex: 10,
      pointerEvents: 'none' as const,
      filter: 'blur(8px)',
    };
  };

  return (
    <div
      ref={sliderRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Projects sliding carousel"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      data-testid="project-slider"
      className="relative w-full max-w-4xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-indigo/50 rounded-3xl"
    >
      {/* Cards Deck Stage flanked by Arrow Buttons at both ends */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-6 w-full py-2">
        {/* Left Arrow Button at the left end of the card */}
        {projects.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project"
            data-testid="slider-prev-btn"
            className="z-50 p-2 sm:p-2.5 md:p-3 rounded-full bg-slate-900/95 backdrop-blur-xl border border-neon-cyan/50 text-neon-cyan hover:text-white hover:bg-neon-cyan/20 hover:border-neon-cyan hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(88,166,255,0.35)] transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* Stage for Left - Middle (in-view) - Right Cards */}
        <div
          className="relative w-[280px] sm:w-[320px] md:w-[360px] h-[255px] sm:h-[245px] md:h-[235px] flex items-center justify-center perspective-[1200px]"
          style={{ perspective: 1200 }}
        >
          {/* Dynamic Ambient Spotlight behind the Middle In-View Card */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <div className="w-[220px] sm:w-[280px] h-[220px] sm:h-[280px] bg-gradient-to-r from-neon-cyan/20 via-neon-indigo/25 to-neon-purple/20 rounded-full blur-3xl opacity-80 animate-pulse [animation-duration:6s]" />
          </div>

          {projects.map((project, index) => {
            const diff = getCircularDiff(index, currentIndex, projects.length);
            const isMiddle = diff === 0;
            const isLeft = diff === -1;
            const isRight = diff === 1;
            const isHidden = !isMiddle && !isLeft && !isRight;

            const positionLabel = isMiddle ? 'middle' : isLeft ? 'left' : isRight ? 'right' : 'hidden';

            return (
              <motion.div
                key={project.id || project.name || index}
                data-testid={`project-slide-${positionLabel}`}
                data-position={positionLabel}
                aria-hidden={isHidden}
                initial={false}
                animate={getCardStyle(diff)}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                  mass: 0.9,
                }}
                className="absolute top-0 w-[72vw] max-w-[200px] sm:max-w-[220px] md:max-w-[240px] h-full"
              >
                <div className="relative h-full select-none">
                  <ProjectCard
                    project={project}
                    index={index}
                    featured={false}
                    isActive={isMiddle}
                  />

                  {/* Clickable heavy-blur overlay on Left / Right preview cards so they do not look clearly */}
                  {!isMiddle && (
                    <button
                      type="button"
                      onClick={() => handleSelect(index)}
                      className="absolute inset-0 z-30 w-full h-full rounded-xl sm:rounded-2xl cursor-pointer bg-slate-950/75 backdrop-blur-md hover:bg-slate-950/45 transition-all flex items-center justify-center group focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                      aria-label={`Slide ${project.name} into center view`}
                      title={`Click to view ${project.name}`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 px-2.5 py-1 rounded-full bg-slate-900/95 border border-neon-cyan/60 text-neon-cyan text-[10px] font-mono font-bold shadow-[0_0_15px_rgba(88,166,255,0.5)] backdrop-blur-xl flex items-center gap-1">
                        Click to view
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right Arrow Button at the right end of the card */}
        {projects.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project"
            data-testid="slider-next-btn"
            className="z-50 p-2 sm:p-2.5 md:p-3 rounded-full bg-slate-900/95 backdrop-blur-xl border border-neon-cyan/50 text-neon-cyan hover:text-white hover:bg-neon-cyan/20 hover:border-neon-cyan hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(88,166,255,0.35)] transition-all cursor-pointer flex items-center justify-center shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>

      {/* Active Project Information Header & Pagination Controls */}
      {projects.length > 1 && (
        <div className="mt-5 flex flex-col items-center gap-3">
          {/* Active project callout */}
          <div className="font-mono text-xs text-text-secondary flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/60 border border-border-color shadow-sm">
            <span className="text-[10px] uppercase tracking-wider text-neon-cyan font-bold bg-neon-cyan/15 px-2 py-0.5 rounded border border-neon-cyan/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
              Active
            </span>
            <span className="text-text-primary font-sora font-semibold text-xs sm:text-sm">
              {projects[currentIndex]?.name}
            </span>
          </div>

          {/* Pagination Dots & Numeric Counter */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Project slider pagination">
              {projects.map((proj, idx) => (
                <button
                  key={proj.id || proj.name || idx}
                  type="button"
                  onClick={() => handleSelect(idx)}
                  aria-label={`Go to project ${idx + 1}: ${proj.name}`}
                  aria-selected={idx === currentIndex}
                  role="tab"
                  data-testid={`slider-dot-${idx}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 sm:w-9 bg-gradient-to-r from-neon-cyan to-neon-indigo shadow-[0_0_12px_rgba(88,166,255,0.7)]'
                      : 'w-2 bg-slate-700/60 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] sm:text-[11px] font-mono text-text-secondary ml-1">
              <span className="text-neon-cyan font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="opacity-50"> / </span>
              <span>{String(projects.length).padStart(2, '0')}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSlider;
