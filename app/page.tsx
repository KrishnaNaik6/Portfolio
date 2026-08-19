import { fetchGitHubDetails, fetchGitHubProjects, fetchGitHubUserStats } from '@/lib/github';
import HeroClient from '@/components/hero/HeroClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [details, projects, stats] = await Promise.all([
    fetchGitHubDetails(),
    fetchGitHubProjects(),
    fetchGitHubUserStats('KrishnaNaik6').catch((err) => {
      console.error('Failed to prefetch GitHub stats on server:', err);
      return null;
    }),
  ]);

  return (
    <HeroClient
      initialDetails={details}
      initialProjects={projects}
      initialStats={stats}
    />
  );
}


