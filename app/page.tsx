import { fetchNexisPortfolio } from '@/lib/nexis';
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


  return (
    <HeroClient
      initialDetails={details}
      initialProjects={projects}
      initialStats={details?.githubIntelligence || null}
      initialSections={sections}
    />
  );
}
