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
  const [loading, setLoading] = useState<boolean>(initialProjects.length === 0);

  useEffect(() => {
    if (initialProjects.length > 0) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/github/projects');
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [initialProjects]);

  return (
    <SectionWrapper ref={sectionRef} id="projects" title="Featured Projects" terminalCommand="echo $projects">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-12 h-12 border-2 border-neon-indigo/20 border-t-neon-indigo rounded-full animate-spin" />
          <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">
            Loading Repositories...
          </span>
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name || index}
              project={project}
              index={index}
              featured={index === 0}
            />
          ))}
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
