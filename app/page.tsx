import { fetchNexisPortfolio } from '@/lib/nexis';
import HeroClient from '@/components/hero/HeroClient';

export const revalidate = 30;

export default async function HomePage() {
  let nexisData = null;
  try {
    nexisData = await fetchNexisPortfolio();
  } catch (err) {
    console.warn('[HomePage] NEXIS prefetch failed:', err instanceof Error ? err.message : err);
  }

  const details = nexisData?.details || null;
  const projects = nexisData?.projects || [];
  const sections = nexisData?.sections || null;

  return (
    <HeroClient
      initialDetails={details}
      initialProjects={projects}
      initialStats={details?.githubIntelligence || null}
      initialSections={sections}
    />
  );
}
