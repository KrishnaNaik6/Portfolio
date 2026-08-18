import { fetchGitHubDetails, fetchGitHubProjects } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [details, projects] = await Promise.all([
    fetchGitHubDetails(),
    fetchGitHubProjects(),
  ]);

  return <HeroClient initialDetails={details} initialProjects={projects} />;
}

