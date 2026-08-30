import { fetchNexisPortfolio } from '@/lib/nexis';
import { fetchGitHubDetails, fetchGitHubProjects, fetchGitHubUserStats } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';
import { isSectionIdEnabled } from '@/lib/nexisSchema';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const nexisData = await fetchNexisPortfolio().catch((err) => {
    console.warn('[HomePage] NEXIS prefetch failed:', err?.message);
    return null;
  });

  const sections = nexisData?.sections ?? null;
  const isGitHubEnabled = sections ? isSectionIdEnabled(sections, 'github') : true;

  // Only prefetch GitHub stats if the GitHub Intelligence section is actually enabled
  const stats = isGitHubEnabled
    ? await fetchGitHubUserStats('KrishnaNaik6').catch((err) => {
        console.error('Failed to prefetch GitHub stats on server:', err);
        return null;
      })
    : null;

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
      initialStats={stats}
      initialSections={sections}
    />
  );
}
