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
        zIndex: 30,
        pointerEvents: 'auto' as const,
        filter: 'drop-shadow(0 20px 35px rgba(0, 0, 0, 0.5))',
      };
    }
    if (diff === -1) {
      return {
        x: '-65%',
        scale: 0.86,
        rotateY: 12,
        opacity: 0.55,
        zIndex: 20,
        pointerEvents: 'auto' as const,
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))',
      };
    }
    if (diff === 1) {
      return {
        x: '65%',
        scale: 0.86,
        rotateY: -12,
        opacity: 0.55,
        zIndex: 20,
        pointerEvents: 'auto' as const,
        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))',
      };
    }
    // Offscreen
    return {
      x: diff < 0 ? '-130%' : '130%',
      scale: 0.7,
      rotateY: diff < 0 ? 20 : -20,
      opacity: 0,
      zIndex: 10,
      pointerEvents: 'none' as const,
      filter: 'none',
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
      className="relative w-full max-w-5xl mx-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-indigo/50 rounded-3xl"
    >
      {/* Ambient cybernetic background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[300px] sm:w-[480px] h-[300px] bg-gradient-to-r from-neon-indigo/15 via-neon-cyan/15 to-neon-rose/10 rounded-full blur-3xl opacity-75" />
      </div>

      {/* Stage for Left - Middle (in-view) - Right Cards */}
      <div
        className="relative w-full h-[500px] sm:h-[480px] flex items-center justify-center overflow-x-clip py-4 perspective-[1200px]"
        style={{ perspective: 1200 }}
      >
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
              className="absolute top-0 w-[86vw] max-w-[340px] sm:max-w-[400px] md:max-w-[440px] h-full"
            >
              <div className="relative h-full select-none">
                <ProjectCard project={project} index={index} featured={false} />

                {/* Clickable overlay on Left / Right preview cards to slide them into view */}
                {!isMiddle && (
                  <button
                    type="button"
                    onClick={() => handleSelect(index)}
                    className="absolute inset-0 z-30 w-full h-full rounded-2xl sm:rounded-3xl cursor-pointer bg-slate-950/25 hover:bg-slate-950/10 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                    aria-label={`Slide ${project.name} into center view`}
                    title={`Click to view ${project.name}`}
                  />
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Floating desktop side buttons */}
        {projects.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous project"
              data-testid="slider-floating-prev"
              className="hidden md:flex absolute left-0 lg:-left-5 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-slate-950/80 backdrop-blur-md border border-neon-indigo/30 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/70 hover:scale-110 shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next project"
              data-testid="slider-floating-next"
              className="hidden md:flex absolute right-0 lg:-right-5 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-slate-950/80 backdrop-blur-md border border-neon-indigo/30 text-text-secondary hover:text-neon-cyan hover:border-neon-cyan/70 hover:scale-110 shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Controls Bar */}
      {projects.length > 1 && (
        <div className="mt-6 sm:mt-8 flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous project"
            data-testid="slider-prev-btn"
            className="p-2.5 sm:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-neon-indigo/30 text-text-primary hover:text-neon-cyan hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer group flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

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
                      ? 'w-7 sm:w-8 bg-gradient-to-r from-neon-indigo to-neon-cyan shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                      : 'w-2 bg-slate-700/60 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-text-secondary ml-1 sm:ml-2">
              <span className="text-neon-cyan font-bold">{String(currentIndex + 1).padStart(2, '0')}</span>
              <span className="opacity-50"> / </span>
              <span>{String(projects.length).padStart(2, '0')}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next project"
            data-testid="slider-next-btn"
            className="p-2.5 sm:p-3 rounded-full bg-slate-900/80 backdrop-blur-md border border-neon-indigo/30 text-text-primary hover:text-neon-cyan hover:border-neon-cyan/60 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer group flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectSlider;
