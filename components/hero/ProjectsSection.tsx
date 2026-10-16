'use client';

import React, { useEffect, useState } from 'react';
import { ProjectItem } from '@/lib/types';
import SectionWrapper from '../ui/SectionWrapper';
import ProjectCard from '../cards/ProjectCard';
import ProjectSlider from '../cards/ProjectSlider';
import { Sparkles, Layers } from 'lucide-react';

interface ProjectsSectionProps {
  initialProjects?: ProjectItem[];
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ initialProjects = [], sectionRef }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);

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
                    {sliderProjects.length} In Archive
                  </span>
                  <div className="text-[11px] font-mono text-text-secondary hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-border-color">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    <span>Responsive 3D Slider • Auto-adapts In-View</span>
                  </div>
                </div>
              </div>

              <ProjectSlider projects={sliderProjects} />
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
