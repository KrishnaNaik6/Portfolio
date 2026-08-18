import { fetchGitHubDetails, fetchGitHubProjects } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';

export const revalidate = 3600; // Server-side revalidation every hour

export default async function HomePage() {
  const [details, projects] = await Promise.all([
    fetchGitHubDetails(),
    fetchGitHubProjects(),
  ]);

  return <HeroClient initialDetails={details} initialProjects={projects} />;
}
