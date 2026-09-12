import { fetchNexisPortfolio } from '@/lib/nexis';
import { fetchGitHubDetails, fetchGitHubProjects } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';

export const revalidate = 30;

export default async function HomePage() {
  // External portfolio services are enhancements, never prerequisites for rendering.
  // All failures are contained so the homepage always has a renderable UI.
  let nexisData = null;
  try {
    nexisData = await fetchNexisPortfolio();
  } catch (err) {
    console.warn('[HomePage] NEXIS prefetch failed:', err instanceof Error ? err.message : err);
  }

  let details = nexisData?.details || null;
  let projects = nexisData?.projects || [];
  const sections = nexisData?.sections ?? null;

  // GitHub remains a safe secondary source. It is also fully failure-tolerant.
  if (!details && !sections) {
    try {
      const [ghDetails, ghProjects] = await Promise.all([
        fetchGitHubDetails().catch(() => null),
        fetchGitHubProjects().catch(() => []),
      ]);
      details = ghDetails;
      if (projects.length === 0) projects = ghProjects;
    } catch (err) {
      console.warn('[HomePage] GitHub fallback failed:', err instanceof Error ? err.message : err);
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
