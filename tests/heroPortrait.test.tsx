import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeroPortrait from '../components/hero/HeroPortrait';
import Welcome from '../components/hero/Welcome';
import { NexisPortfolioResponseSchema, normalizeNexisPortfolio } from '../lib/nexisSchema';
import { ProfileData } from '../lib/types';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useReducedMotion: () => false,
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
              animate,
              initial,
              transition,
              exit,
              ...rest
            } = props;
            return (
              <Tag className={className} style={style} {...rest}>
                {children}
              </Tag>
            );
          };
        },
      }
    ),
  };
});

describe('HeroPortrait Profile Avatar Component Suite', () => {
  it('renders dynamic profile avatar image correctly when avatarUrl is provided', () => {
    const testUrl = 'https://example-cdn.com/avatars/user-portrait-dynamic.webp';
    const fullName = 'Krishna Umesh Naik';

    render(<HeroPortrait avatarUrl={testUrl} fullName={fullName} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', testUrl);
    expect(img).toHaveAttribute('alt', `${fullName} – Full-Stack Developer & AI Engineer Profile Portrait`);
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('decoding', 'async');
  });

  it('renders graceful developer fallback when avatarUrl is missing', () => {
    render(<HeroPortrait avatarUrl={null} fullName="Krishna Naik" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-fallback')).toBeInTheDocument();
    expect(screen.getByText('KN')).toBeInTheDocument();
    expect(screen.getAllByText('Krishna Naik').length).toBeGreaterThanOrEqual(1);
  });

  it('switches to fallback gracefully when image onError fires without breaking layout', () => {
    const faultyUrl = 'https://invalid-storage.test/broken-image.webp';
    render(<HeroPortrait avatarUrl={faultyUrl} fullName="Krishna Naik" />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();

    // Trigger image error
    fireEvent.error(img);

    // Image is unmounted, fallback rendered cleanly
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByTestId('hero-portrait-fallback')).toBeInTheDocument();
    expect(screen.getAllByText('Krishna Naik').length).toBeGreaterThanOrEqual(1);
  });

  it('resets error state when avatarUrl is updated dynamically', () => {
    const { rerender } = render(
      <HeroPortrait avatarUrl="https://faulty.com/image.webp" fullName="Krishna Naik" />
    );

    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByTestId('hero-portrait-fallback')).toBeInTheDocument();

    // Re-render with new valid URL
    rerender(
      <HeroPortrait avatarUrl="https://valid-new-cdn.com/new-avatar.webp" fullName="Krishna Naik" />
    );

    const newImg = screen.getByRole('img');
    expect(newImg).toBeInTheDocument();
    expect(newImg).toHaveAttribute('src', 'https://valid-new-cdn.com/new-avatar.webp');
  });

  it('verifies Welcome hero renders HeroPortrait with profile.avatarUrl', () => {
    const mockProfile: ProfileData = {
      fullName: 'Krishna Umesh Naik',
      headline: 'Full - Stack developer',
      bio: 'Crafting intelligent systems',
      avatarUrl: 'https://dynamic-test.supabase.co/storage/v1/avatar.webp',
    };

    render(<Welcome onComplete={vi.fn()} profile={mockProfile} sections={[]} />);

    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockProfile.avatarUrl);
    expect(screen.getByText(/01 \/ FULL - STACK DEVELOPER/i)).toBeInTheDocument();
  });

  it('verifies NEXIS Schema and Normalizer extract and retain profile.avatarUrl from API payload', () => {
    const rawPayload = {
      profile: {
        fullName: 'Krishna Umesh Naik',
        avatarUrl: 'https://cdn.test/avatar-sample.webp',
        headline: 'AI Engineer',
      },
      sections: [],
    };

    const parsed = NexisPortfolioResponseSchema.parse(rawPayload);
    const normalized = normalizeNexisPortfolio(parsed);

    expect(normalized.details.profile?.avatarUrl).toBe('https://cdn.test/avatar-sample.webp');
  });
});
