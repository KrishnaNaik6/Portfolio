import { fetchNexisPortfolio } from '@/lib/nexis';
import { fetchGitHubDetails, fetchGitHubProjects } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';

// Enable Incremental Static Regeneration (ISR) with Edge Caching
// The page is served instantly (<50ms) from Vercel Global Edge CDN, and revalidates in the background every 30s
export const revalidate = 30;

export default async function HomePage() {
  const nexisData = await fetchNexisPortfolio().catch((err) => {
    console.warn('[HomePage] NEXIS prefetch failed:', err?.message);
    return null;
  });

  const sections = nexisData?.sections ?? null;
  let details = nexisData?.details || null;
  let projects = nexisData?.projects || [];

  // Fallback to GitHub legacy data sources only if NEXIS data is completely unavailable
  if (!details && !sections) {
    const [ghDetails, ghProjects] = await Promise.all([
      fetchGitHubDetails().catch(() => null),
      fetchGitHubProjects().catch(() => []),
    ]);
    details = ghDetails;
    if (projects.length === 0) {
      projects = ghProjects;
    }
  }

  return (
    <HeroClient
      initialDetails={details}
      initialProjects={projects}
      initialStats={null}
      initialSections={sections}
    />
  );
}
