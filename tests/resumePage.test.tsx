import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PrintButton } from '../components/resume/PrintButton';
import ResumePage from '../app/resume/page';
import * as nexisModule from '../lib/nexis';

const mockResume = {
  slug: 'krishna-naik',
  theme: 'modern',
  publishedAt: '2026-03-01T00:00:00.000Z',
  profile: {
    name: 'Krishna Umesh Naik',
    title: 'Full Stack Developer & AI Engineer',
    email: 'krishna@example.com',
    phone: '+91 9999999999',
    location: 'Bengaluru, India',
    website: 'https://krishna-naik.vercel.app',
    summary: 'Passionate software engineer building resilient web and AI systems.',
    avatarUrl: null,
  },
  socialLinks: [
    { platform: 'GitHub', url: 'https://github.com/KrishnaNaik6' },
  ],
  experiences: [
    {
      id: 'exp-1',
      company: 'Antigravity AI',
      position: 'Senior Software Engineer',
      location: 'Bengaluru',
      startDate: '2024-01-01',
      endDate: null,
      current: true,
      highlights: ['Engineered scalable backend pipelines', 'Reduced latency by 50%'],
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Ramaiah Institute of Technology',
      degree: 'B.E.',
      field: 'Computer Science',
      startDate: '2022-08-01',
      endDate: '2026-06-01',
      grade: '9.4 CGPA',
      activities: ['Coding Club President'],
    },
  ],
  skills: [
    { category: 'Frontend', skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'] },
    { category: 'Backend', skills: ['NestJS', 'Node.js', 'PostgreSQL'] },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Portfolio System',
      description: 'Dynamic portfolio with live NEXIS integration',
      technologies: ['Next.js', 'TypeScript'],
      url: 'https://krishna-naik.vercel.app',
      githubUrl: 'https://github.com/KrishnaNaik6/Portfolio',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'Certified Kubernetes Administrator',
      issuer: 'CNCF',
      issueDate: '2025-01-01',
      url: 'https://cncf.io',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'Grand Prize Winner at HackRIT',
      description: 'Built distributed intelligence agent',
      date: '2024-11-10',
    },
  ],
};

describe('PrintButton Component', () => {
  it('renders with accessible label and calls window.print() on click', () => {
    const printMock = vi.fn();
    window.print = printMock;

    render(<PrintButton label="Print Resume" />);
    const btn = screen.getByRole('button', { name: /print/i });
    expect(btn).toBeInTheDocument();
    expect(screen.getByText('Print Resume')).toBeInTheDocument();

    fireEvent.click(btn);
    expect(printMock).toHaveBeenCalledTimes(1);
  });
});

describe('ResumePage Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders published resume details and download actions when NEXIS returns valid snapshot', async () => {
    vi.spyOn(nexisModule, 'fetchNexisResumeResult').mockResolvedValue({
      status: 'published',
      data: mockResume as any,
    });

    const PageComponent = await ResumePage();
    render(PageComponent);

    // Profile info
    expect(screen.getByText('Krishna Umesh Naik')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer & AI Engineer')).toBeInTheDocument();
    expect(screen.getByText('krishna@example.com')).toBeInTheDocument();
    expect(screen.getByText('Bengaluru, India')).toBeInTheDocument();
    expect(screen.getByText(/Passionate software engineer/i)).toBeInTheDocument();

    // Skills
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('NestJS')).toBeInTheDocument();

    // Experience
    expect(screen.getByText(/Senior Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText('Antigravity AI')).toBeInTheDocument();
    expect(screen.getByText('Engineered scalable backend pipelines')).toBeInTheDocument();

    // Education
    expect(screen.getByText(/Ramaiah Institute of Technology/i)).toBeInTheDocument();

    // Projects
    expect(screen.getByText('Portfolio System')).toBeInTheDocument();

    // Certifications & Achievements
    expect(screen.getByText('Certified Kubernetes Administrator')).toBeInTheDocument();
    expect(screen.getByText('Grand Prize Winner at HackRIT')).toBeInTheDocument();

    // Verified download & print actions in published view
    const downloadBtn = screen.getByRole('link', { name: /Download backup PDF copy/i });
    expect(downloadBtn).toBeInTheDocument();
    expect(downloadBtn).toHaveAttribute('href', '/KrishnaNaik.pdf');
  });

  it('renders unpublished state on confirmed 404 and strictly isolates withdrawn resume without PDF download link', async () => {
    vi.spyOn(nexisModule, 'fetchNexisResumeResult').mockResolvedValue({
      status: 'unpublished',
      data: null,
      statusCode: 404,
    });

    const PageComponent = await ResumePage();
    render(PageComponent);

    expect(screen.getByText('Resume Currently Unpublished')).toBeInTheDocument();
    expect(screen.getByText(/official resume for this profile is currently private or unpublished/i)).toBeInTheDocument();

    // CRITICAL: Ensure NO link to /KrishnaNaik.pdf exists when unpublished
    const allLinks = screen.getAllByRole('link');
    const pdfLinks = allLinks.filter((link) => link.getAttribute('href')?.includes('.pdf'));
    expect(pdfLinks).toHaveLength(0);

    const backBtn = screen.getByRole('link', { name: /Back to Portfolio/i });
    expect(backBtn).toBeInTheDocument();
    expect(backBtn).toHaveAttribute('href', '/');

    const contactBtn = screen.getByRole('link', { name: /Contact Krishna/i });
    expect(contactBtn).toBeInTheDocument();
    expect(contactBtn).toHaveAttribute('href', '/#contact');
  });

  it('renders friendly temporary outage message on network failure without exposing private data or stack traces', async () => {
    vi.spyOn(nexisModule, 'fetchNexisResumeResult').mockResolvedValue({
      status: 'error',
      data: null,
      errorMessage: 'Network timeout',
    });

    const PageComponent = await ResumePage();
    render(PageComponent);

    expect(screen.getByText('Resume Temporarily Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/unable to connect to the live NEXIS resume service/i)).toBeInTheDocument();
    expect(screen.queryByText(/Network timeout/i)).not.toBeInTheDocument(); // No raw trace exposure

    const backBtn = screen.getByRole('link', { name: /Back to Portfolio/i });
    expect(backBtn).toBeInTheDocument();
  });

  it('sanitizes unsafe javascript URL schemes preventing XSS attacks', async () => {
    const maliciousResume = {
      ...mockResume,
      profile: {
        ...mockResume.profile,
        website: 'javascript:alert("XSS")',
      },
      socialLinks: [
        { platform: 'Twitter', url: 'javascript:alert("XSS")' },
      ],
      projects: [
        {
          id: 'proj-malicious',
          title: 'Exploit Project',
          githubUrl: 'javascript:alert("XSS")',
          url: 'javascript:alert("XSS")',
        },
      ],
    };

    vi.spyOn(nexisModule, 'fetchNexisResumeResult').mockResolvedValue({
      status: 'published',
      data: maliciousResume as any,
    });

    const PageComponent = await ResumePage();
    render(PageComponent);

    const links = screen.queryAllByRole('link');
    for (const link of links) {
      const href = link.getAttribute('href');
      if (href) {
        expect(href.toLowerCase()).not.toContain('javascript:');
      }
    }
  });

  it('handles minimal resume payload without crashing or inventing facts', async () => {
    const minimalResume = {
      slug: 'krishna-naik',
      publishedAt: '2026-03-01T00:00:00.000Z',
      profile: {
        fullName: 'Krishna Minimal',
      },
    };

    vi.spyOn(nexisModule, 'fetchNexisResumeResult').mockResolvedValue({
      status: 'published',
      data: minimalResume as any,
    });

    const PageComponent = await ResumePage();
    render(PageComponent);

    expect(screen.getByText('Krishna Minimal')).toBeInTheDocument();
    expect(screen.queryByText('Technical Skills')).not.toBeInTheDocument();
    expect(screen.queryByText('Work Experience')).not.toBeInTheDocument();
  });
});
