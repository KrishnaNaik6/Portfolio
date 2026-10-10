'use client';

import React, { useEffect, useState } from 'react';
import { ProjectItem } from '@/lib/types';
import SectionWrapper from '../ui/SectionWrapper';
import ProjectCard from '../cards/ProjectCard';

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

  return (
    <SectionWrapper ref={sectionRef} id="projects" title="Featured Projects" terminalCommand="echo $projects">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {projects.map((project, index) => {
            const isFeatured = hasExplicitFeatured ? !!project.featured : index === 0;
            return (
              <ProjectCard
                key={project.id || project.name || index}
                project={project}
                index={index}
                featured={isFeatured}
              />
            );
          })}
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
