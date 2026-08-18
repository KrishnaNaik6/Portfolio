import { PortfolioDetails, ProjectItem, GitHubStatsResponse, GitHubContributionsResponse } from './types';

const OWNER = 'KrishnaNaik6';

export const getGitHubHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `token ${token}`;
  }

  return headers;
};

export async function fetchGitHubDetails(): Promise<PortfolioDetails | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/Education/contents/education.json`,
      {
        headers: getGitHubHeaders(),
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      console.error('[fetchGitHubDetails] Failed:', res.status, res.statusText);
      return null;
    }

    const fileData = await res.json();
    if (!fileData.content) return null;

    const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const jsonData: PortfolioDetails = JSON.parse(decoded);
    return jsonData;
  } catch (err) {
    console.error('[fetchGitHubDetails] Error:', err);
    return null;
  }
}

export async function fetchGitHubProjects(): Promise<ProjectItem[]> {
  try {
    const reposRes = await fetch(
      `https://api.github.com/user/repos?affiliation=owner,collaborator&visibility=public&per_page=100`,
      {
        headers: getGitHubHeaders(),
        next: { revalidate: 3600 },
      }
    );

    let allRepos: any[] = [];
    if (reposRes.ok) {
      allRepos = await reposRes.json();
    } else {
      // Fallback to public user repos if /user/repos fails due to scope/token
      const fallbackRes = await fetch(
        `https://api.github.com/users/${OWNER}/repos?per_page=100`,
        {
          headers: getGitHubHeaders(),
          next: { revalidate: 3600 },
        }
      );
      if (fallbackRes.ok) {
        allRepos = await fallbackRes.json();
      }
    }

    const filtered = allRepos.filter(
      (repo) => repo.has_projects && repo.name !== 'Internship-2024-exercise-1'
    );

    const withCollabs: ProjectItem[] = await Promise.all(
      filtered.map(async (repo) => {
        try {
          const collabRes = await fetch(
            `https://api.github.com/repos/${repo.owner?.login || OWNER}/${repo.name}/collaborators`,
            {
              headers: getGitHubHeaders(),
              next: { revalidate: 3600 },
            }
          );
          const collabs = collabRes.ok ? await collabRes.json() : [];
          return {
            name: repo.name,
            description: repo.description || 'No description provided.',
            link: { git: repo.html_url, live: repo.homepage || null },
            collabed: Array.isArray(collabs) && collabs.length > 1,
            type: repo.language || 'Project',
          };
        } catch {
          return {
            name: repo.name,
            description: repo.description || 'No description provided.',
            link: { git: repo.html_url, live: repo.homepage || null },
            collabed: false,
            type: repo.language || 'Project',
          };
        }
      })
    );

    // Append org repo if available
    try {
      const orgRepoRes = await fetch(
        `https://api.github.com/repos/Canara-Tech-Labs/sprentzo-webapp`,
        {
          headers: getGitHubHeaders(),
          next: { revalidate: 3600 },
        }
      );
      if (orgRepoRes.ok) {
        const orgRepo = await orgRepoRes.json();
        withCollabs.push({
          name: orgRepo.name,
          description: orgRepo.description || 'Sprentzo web application.',
          link: { git: orgRepo.html_url, live: orgRepo.homepage || null },
          collabed: true,
          type: orgRepo.language || 'Full Stack',
        });
      }
    } catch {
      // Continue without org repo
    }

    return withCollabs;
  } catch (err) {
    console.error('[fetchGitHubProjects] Error:', err);
    return [];
  }
}

export async function fetchGitHubUserContributions(username: string): Promise<GitHubContributionsResponse | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      total: data.total || {},
      contributions: Array.isArray(data.contributions) ? data.contributions : [],
    };
  } catch (err) {
    console.error('[fetchGitHubUserContributions] Error:', err);
    return null;
  }
}

export async function fetchGitHubUserStats(username: string): Promise<GitHubStatsResponse> {
  const headers = getGitHubHeaders();

  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers,
    next: { revalidate: 1800 },
  });

  if (userRes.status === 403) throw new Error('API Rate Limit Exceeded.');
  if (!userRes.ok) throw new Error('User node not found.');

  const user = await userRes.json();

  const repoUrl =
    username.toLowerCase() === OWNER.toLowerCase()
      ? `https://api.github.com/user/repos?visibility=all&sort=updated&per_page=100`
      : `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`;

  let repos = [];
  try {
    const reposRes = await fetch(repoUrl, { headers, next: { revalidate: 1800 } });
    if (reposRes.ok) repos = await reposRes.json();
  } catch {
    repos = [];
  }

  const query = encodeURIComponent(`author:${username}`);
  let commits = 0;
  let prs = 0;
  let issues = 0;

  try {
    const [commitRes, prRes, issueRes] = await Promise.all([
      fetch(`https://api.github.com/search/commits?q=${query}`, {
        headers: { ...headers, Accept: 'application/vnd.github.cloak-preview' },
      }),
      fetch(`https://api.github.com/search/issues?q=${query}+type:pr`, { headers }),
      fetch(`https://api.github.com/search/issues?q=${query}+type:issue`, { headers }),
    ]);

    if (commitRes.ok) {
      const commitData = await commitRes.json();
      commits = commitData.total_count || 0;
    }
    if (prRes.ok) {
      const prData = await prRes.json();
      prs = prData.total_count || 0;
    }
    if (issueRes.ok) {
      const issueData = await issueRes.json();
      issues = issueData.total_count || 0;
    }
  } catch {
    // Search API optional fail
  }

  const contributionsData = await fetchGitHubUserContributions(username).catch(() => null);

  return {
    user,
    repos: Array.isArray(repos) ? repos : [],
    extraStats: { commits, prs, issues },
    contributionsData: contributionsData || undefined,
  };
}

