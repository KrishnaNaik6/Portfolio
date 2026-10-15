import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectsSection from '@/components/hero/ProjectsSection';
import ProjectSlider from '@/components/cards/ProjectSlider';
import { ProjectItem } from '@/lib/types';

// Mock framer-motion with simple proxy
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_, prop: string) => {
          const Tag = prop as any;
          return ({ children, className, style, ...props }: any) => {
            const {
              whileHover,
              whileTap,
              whileInView,
              viewport,
              variants,
              initial,
              animate,
              transition,
              drag,
              dragConstraints,
              dragElastic,
              onDragEnd,
              ...validProps
            } = props;
            return (
              <Tag className={className} style={style} {...validProps}>
                {children}
              </Tag>
            );
          };
        },
      }
    ),
    useMotionValue: () => ({ set: vi.fn() }),
    useSpring: () => 0,
    useTransform: () => 0,
  };
});

describe('ProjectSlider & ProjectsSection Suite', () => {
  const mockProjects: ProjectItem[] = [
    {
      id: 'p-1',
      name: 'Featured Flagship Project',
      type: 'Full Stack',
      description: 'The main flagship project.',
      link: { git: 'https://github.com/test/flagship', live: 'https://flagship.test' },
      featured: true,
      displayOrder: 0,
    },
    {
      id: 'p-2',
      name: 'Alpha Slider App',
      type: 'Web App',
      description: 'An interactive web app.',
      link: { git: 'https://github.com/test/alpha', live: 'https://alpha.test' },
      featured: false,
      displayOrder: 1,
    },
    {
      id: 'p-3',
      name: 'Beta Cloud API',
      type: 'Backend',
      description: 'Distributed microservice.',
      link: { git: 'https://github.com/test/beta', live: null },
      featured: false,
      displayOrder: 2,
    },
    {
      id: 'p-4',
      name: 'Gamma Mobile System',
      type: 'Mobile',
      description: 'Cross-platform mobile client.',
      link: { git: 'https://github.com/test/gamma', live: null },
      featured: false,
      displayOrder: 3,
    },
  ];

  describe('ProjectsSection - Exclude featured projects in slider', () => {
    it('renders featured projects in showcase and strictly excludes them from the slider', () => {
      render(<ProjectsSection initialProjects={mockProjects} />);

      // Featured showcase header is rendered
      expect(screen.getByText(/Featured Showcase/i)).toBeInTheDocument();
      expect(screen.getByText('Featured Flagship Project')).toBeInTheDocument();

      // Slider is rendered for non-featured projects
      expect(screen.getByText(/Project Archive/i)).toBeInTheDocument();
      expect(screen.getByTestId('project-slider')).toBeInTheDocument();

      // The slider container should NOT contain the featured project
      const slider = screen.getByTestId('project-slider');
      expect(slider).not.toHaveTextContent('Featured Flagship Project');

      // The slider should contain the non-featured projects
      expect(slider).toHaveTextContent('Alpha Slider App');
      expect(slider).toHaveTextContent('Beta Cloud API');
      expect(slider).toHaveTextContent('Gamma Mobile System');
    });

    it('renders empty message when no projects are available', () => {
      render(<ProjectsSection initialProjects={[]} />);
      expect(screen.getByText(/No projects available at the moment/i)).toBeInTheDocument();
    });

    it('renders only showcase without slider if there is only one project (featured)', () => {
      const singleProject = [mockProjects[0]];
      render(<ProjectsSection initialProjects={singleProject} />);

      expect(screen.getByText(/Featured Showcase/i)).toBeInTheDocument();
      expect(screen.queryByTestId('project-slider')).not.toBeInTheDocument();
    });
  });

  describe('ProjectSlider - Interactive Left - Middle (in-view) - Right card display', () => {
    const sliderOnlyProjects = mockProjects.filter((p) => !p.featured);

    it('initializes with the first project in Middle (in-view), second in Right, and last in Left', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      // Check position attributes
      const middleSlide = screen.getByTestId('project-slide-middle');
      expect(middleSlide).toHaveAttribute('data-position', 'middle');
      expect(middleSlide).toHaveTextContent('Alpha Slider App');

      const rightSlide = screen.getByTestId('project-slide-right');
      expect(rightSlide).toHaveAttribute('data-position', 'right');
      expect(rightSlide).toHaveTextContent('Beta Cloud API');

      const leftSlide = screen.getByTestId('project-slide-left');
      expect(leftSlide).toHaveAttribute('data-position', 'left');
      expect(leftSlide).toHaveTextContent('Gamma Mobile System');
    });

    it('navigates forward when clicking the next button', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      const nextBtn = screen.getByTestId('slider-next-btn');
      fireEvent.click(nextBtn);

      // Now index 1 (Beta Cloud API) should be in Middle
      const middleSlide = screen.getByTestId('project-slide-middle');
      expect(middleSlide).toHaveTextContent('Beta Cloud API');

      // Alpha should be on Left
      const leftSlide = screen.getByTestId('project-slide-left');
      expect(leftSlide).toHaveTextContent('Alpha Slider App');

      // Gamma should be on Right
      const rightSlide = screen.getByTestId('project-slide-right');
      expect(rightSlide).toHaveTextContent('Gamma Mobile System');
    });

    it('navigates backward when clicking the previous button', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      const prevBtn = screen.getByTestId('slider-prev-btn');
      fireEvent.click(prevBtn);

      // Now last project (Gamma Mobile System) should wrap to Middle
      const middleSlide = screen.getByTestId('project-slide-middle');
      expect(middleSlide).toHaveTextContent('Gamma Mobile System');

      // Beta should be on Left
      const leftSlide = screen.getByTestId('project-slide-left');
      expect(leftSlide).toHaveTextContent('Beta Cloud API');

      // Alpha should be on Right
      const rightSlide = screen.getByTestId('project-slide-right');
      expect(rightSlide).toHaveTextContent('Alpha Slider App');
    });

    it('slides a side card to Middle when clicked directly', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      // Click the Right card overlay button
      const rightOverlay = screen.getByRole('button', { name: /Slide Beta Cloud API into center view/i });
      fireEvent.click(rightOverlay);

      // Now Beta Cloud API is in Middle
      const middleSlide = screen.getByTestId('project-slide-middle');
      expect(middleSlide).toHaveTextContent('Beta Cloud API');
    });

    it('slides to selected project when clicking pagination dots', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      // Click dot for index 2 (Gamma)
      const dot2 = screen.getByTestId('slider-dot-2');
      fireEvent.click(dot2);

      const middleSlide = screen.getByTestId('project-slide-middle');
      expect(middleSlide).toHaveTextContent('Gamma Mobile System');
    });

    it('responds to keyboard arrow navigation', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      const slider = screen.getByTestId('project-slider');

      // Press ArrowRight
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      expect(screen.getByTestId('project-slide-middle')).toHaveTextContent('Beta Cloud API');

      // Press ArrowLeft
      fireEvent.keyDown(slider, { key: 'ArrowLeft' });
      expect(screen.getByTestId('project-slide-middle')).toHaveTextContent('Alpha Slider App');
    });

    it('gracefully handles 2 projects', () => {
      const twoProjects = sliderOnlyProjects.slice(0, 2);
      render(<ProjectSlider projects={twoProjects} />);

      expect(screen.getByTestId('project-slide-middle')).toHaveTextContent('Alpha Slider App');
      expect(screen.getByTestId('project-slide-right')).toHaveTextContent('Beta Cloud API');

      // Click next
      fireEvent.click(screen.getByTestId('slider-next-btn'));
      expect(screen.getByTestId('project-slide-middle')).toHaveTextContent('Beta Cloud API');
      expect(screen.getByTestId('project-slide-left')).toHaveTextContent('Alpha Slider App');
    });

    it('clearly highlights the in-view front card with an in-view badge and active styling while keeping side cards dimmed', () => {
      render(<ProjectSlider projects={sliderOnlyProjects} />);

      const middleSlide = screen.getByTestId('project-slide-middle');
      const inViewBadge = middleSlide.querySelector('[data-testid="project-inview-badge"]');
      expect(inViewBadge).toBeInTheDocument();
      expect(inViewBadge).toHaveTextContent(/In View/i);

      // Side cards should not display the In View badge
      const leftSlide = screen.getByTestId('project-slide-left');
      expect(leftSlide.querySelector('[data-testid="project-inview-badge"]')).not.toBeInTheDocument();

      const rightSlide = screen.getByTestId('project-slide-right');
      expect(rightSlide.querySelector('[data-testid="project-inview-badge"]')).not.toBeInTheDocument();
    });

    it('gracefully handles 1 project without side cards', () => {
      const singleProject = [sliderOnlyProjects[0]];
      render(<ProjectSlider projects={singleProject} />);

      expect(screen.getByTestId('project-slide-middle')).toHaveTextContent('Alpha Slider App');
      expect(screen.queryByTestId('project-slide-left')).not.toBeInTheDocument();
      expect(screen.queryByTestId('project-slide-right')).not.toBeInTheDocument();
      expect(screen.queryByTestId('slider-next-btn')).not.toBeInTheDocument();
    });
  });
});
