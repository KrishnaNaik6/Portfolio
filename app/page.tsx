import { fetchNexisPortfolio } from '@/lib/nexis';
import HeroClient from '@/components/hero/HeroClient';
import { FALLBACK_PORTFOLIO_DATA } from '@/lib/fallbackData';

export const revalidate = 30;

export default async function HomePage() {
  // External portfolio services are enhancements, never prerequisites for rendering.
  // All failures are contained so the homepage always has an instantly renderable UI.
  let nexisData = null;
  try {
    nexisData = await fetchNexisPortfolio();
  } catch (err) {
    console.warn('[HomePage] NEXIS prefetch failed:', err instanceof Error ? err.message : err);
  }

  const details = nexisData?.details || FALLBACK_PORTFOLIO_DATA.details;
  const projects = nexisData?.projects && nexisData.projects.length > 0
    ? nexisData.projects
    : FALLBACK_PORTFOLIO_DATA.projects;
  const sections = nexisData?.sections && nexisData.sections.length > 0
    ? nexisData.sections
    : FALLBACK_PORTFOLIO_DATA.sections;

  return (
    <HeroClient
      initialDetails={details}
      initialProjects={projects}
      initialStats={details?.githubIntelligence || null}
      initialSections={sections}
    />
  );
}
