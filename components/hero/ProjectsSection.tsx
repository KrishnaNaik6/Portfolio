'use client';

import React, { useEffect, useState } from 'react';
import { ProjectItem } from '@/lib/types';
import SectionWrapper from '../ui/SectionWrapper';
import ProjectCard from '../cards/ProjectCard';
import ProjectSlider from '../cards/ProjectSlider';
import { Sparkles, Layers, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProjectsSectionProps {
  initialProjects?: ProjectItem[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ initialProjects = [], sectionRef }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const hasExplicitFeatured = projects.some((p) => p.featured);

  // Exclude featured projects in the slider
  const featuredProjects = hasExplicitFeatured
    ? projects.filter((p) => p.featured)
    : projects.length > 0
    ? [projects[0]]
    : [];

  const sliderProjects = hasExplicitFeatured
    ? projects.filter((p) => !p.featured)
    : projects.slice(1);

  // Extract unique categories for interactive filtering
  const categories = React.useMemo(() => {
    const types = Array.from(
      new Set(
        sliderProjects
          .map((p) => p.type?.trim())
          .filter((t): t is string => Boolean(t && t.length > 0))
      )
    );
    if (types.length <= 1) return [];
    return ['All', ...types];
  }, [sliderProjects]);

  const displayedSliderProjects = React.useMemo(() => {
    if (selectedCategory === 'All') return sliderProjects;
    return sliderProjects.filter(
      (p) => p.type?.trim().toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [sliderProjects, selectedCategory]);

  return (
    <SectionWrapper ref={sectionRef} id="projects" title="Featured Projects" terminalCommand="echo $projects">
      {projects.length > 0 ? (
        <div className="space-y-14 sm:space-y-20">
          {/* Featured Projects Showcase (Excluded from the slider) */}
          {featuredProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-neon-indigo/25 to-neon-cyan/20 border border-neon-indigo/40 text-neon-indigo shadow-[0_0_15px_rgba(99,102,241,0.25)]">
                    <Sparkles size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-mono uppercase tracking-widest text-text-primary font-bold">
                      Featured Showcase
                    </h3>
                    <p className="text-xs text-text-secondary font-mono">
                      Flagship production systems & verified deployments
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-mono text-neon-indigo bg-neon-indigo/10 border border-neon-indigo/30 font-semibold shadow-sm">
                  {featuredProjects.length} Featured
                </span>
              </div>
              <div
                className={`grid gap-6 sm:gap-8 ${
                  featuredProjects.length === 1
                    ? 'max-w-2xl mx-auto'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {featuredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id || project.name || index}
                    project={project}
                    index={index}
                    featured={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Elegant Divider between Featured and Archive */}
          {featuredProjects.length > 0 && sliderProjects.length > 0 && (
            <div className="relative py-2">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-border-color to-transparent" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 px-3 py-0.5 rounded-full bg-slate-900 border border-border-color text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                Interactive Showcase
              </div>
            </div>
          )}

          {/* Interactive Sliding Card Display for Remaining Projects */}
          {sliderProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-neon-cyan/25 to-neon-indigo/20 border border-neon-cyan/40 text-neon-cyan shadow-[0_0_15px_rgba(88,166,255,0.25)]">
                    <Layers size={16} />
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base font-mono uppercase tracking-widest text-text-primary font-bold">
                      Project Archive
                    </h3>
                    <p className="text-xs text-text-secondary font-mono">
                      Explore full collection in 3D interactive sliding perspective
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 font-semibold hidden sm:inline-flex">
                    {displayedSliderProjects.length} Shown
                  </span>
                  <div className="text-[11px] font-mono text-text-secondary hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-border-color">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    <span>Responsive 3D Slider • Auto-adapts In-View</span>
                  </div>
                </div>
              </div>

              {/* Interactive Category Filter Pills Dock */}
              {categories.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 mb-4 scrollbar-none">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-secondary mr-2 shrink-0">
                    <Filter size={13} className="text-neon-cyan" />
                    <span>Filter:</span>
                  </div>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const count =
                      cat === 'All'
                        ? sliderProjects.length
                        : sliderProjects.filter(
                            (p) => p.type?.trim().toLowerCase() === cat.toLowerCase()
                          ).length;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`relative px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                          isSelected
                            ? 'text-neon-cyan font-bold shadow-[0_0_15px_rgba(88,166,255,0.3)]'
                            : 'text-text-secondary hover:text-text-primary bg-slate-900/40 hover:bg-slate-800/60 border border-border-color'
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId="activeProjectCategory"
                            className="absolute inset-0 rounded-full bg-neon-cyan/15 border border-neon-cyan/50"
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{cat}</span>
                        <span
                          className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-neon-cyan/25 text-neon-cyan font-bold'
                              : 'bg-slate-800/80 text-text-secondary'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {displayedSliderProjects.length > 0 ? (
                <ProjectSlider projects={displayedSliderProjects} />
              ) : (
                <div className="text-center py-12 rounded-2xl bg-card-bg/40 border border-border-color text-text-secondary font-mono text-xs">
                  No projects matching &quot;{selectedCategory}&quot;.
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-text-secondary font-mono py-8">
          No projects available at the moment.
        </div>
      )}
    </SectionWrapper>
  );
};

export default ProjectsSection;
