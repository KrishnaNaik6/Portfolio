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
        <div className="space-y-12 sm:space-y-16">
          {/* Featured Projects Showcase (Excluded from the slider) */}
          {featuredProjects.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-neon-indigo/15 border border-neon-indigo/30 text-neon-indigo">
                  <Sparkles size={13} />
                </span>
                <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-neon-indigo font-bold">
                  Featured Showcase ({featuredProjects.length})
                </h3>
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

          {/* Interactive Sliding Card Display for Remaining Projects */}
          {sliderProjects.length > 0 && (
            <div>
              <div className="flex items-center justify-between gap-4 mb-4 sm:mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-neon-cyan/15 border border-neon-cyan/30 text-neon-cyan">
                    <Layers size={13} />
                  </span>
                  <h3 className="text-xs sm:text-sm font-mono uppercase tracking-widest text-neon-cyan font-bold">
                    Project Archive ({sliderProjects.length})
                  </h3>
                </div>
                <div className="text-[11px] font-mono text-text-secondary hidden sm:flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                  <span>Interactive 3D Carousel // Click side cards or slide to view</span>
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
