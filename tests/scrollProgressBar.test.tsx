import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ScrollProgressBar from '@/components/ui/ScrollProgressBar';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useScroll: () => ({
      scrollYProgress: { get: () => 0.5 },
    }),
    useSpring: (val: any) => val,
    motion: {
      div: ({ children, className, style, ...props }: any) => (
        <div className={className} style={style} {...props}>
          {children}
        </div>
      ),
    },
  };
});

describe('ScrollProgressBar Component Suite', () => {
  it('renders the scroll progress bar with correct container and bar elements', () => {
    render(<ScrollProgressBar />);

    const container = screen.getByTestId('scroll-progress-container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('aria-hidden', 'true');

    const progressBar = screen.getByTestId('scroll-progress-bar');
    expect(progressBar).toBeInTheDocument();
  });
});
