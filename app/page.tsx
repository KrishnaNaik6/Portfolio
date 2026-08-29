import { fetchNexisPortfolio } from '@/lib/nexis';
import { fetchGitHubDetails, fetchGitHubProjects, fetchGitHubUserStats } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [nexisData, stats] = await Promise.all([
    fetchNexisPortfolio().catch((err) => {
      console.warn('[HomePage] NEXIS prefetch fallback triggered:', err?.message);
      return null;
    }),
    fetchGitHubUserStats('KrishnaNaik6').catch((err) => {
      console.error('Failed to prefetch GitHub stats on server:', err);
      return null;
    }),
  ]);

  let details = nexisData?.details || null;
  let projects = nexisData?.projects || [];
  const sections = nexisData?.sections || undefined;

  // Fallback to GitHub legacy data sources only if NEXIS data is completely unavailable
  if (!details) {
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
      initialStats={stats}
      initialSections={sections}
    />
  );
}
