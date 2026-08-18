import { PortfolioDetails, ProjectItem, GitHubStatsResponse, GitHubContributionsResponse } from './types';

const OWNER = 'KrishnaNaik6';

export const getGitHubHeaders = () => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'Krishna-Naik-Portfolio',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim()) {
    headers.Authorization = token.startsWith('Bearer ') || token.startsWith('token ')
      ? token.trim()
      : `token ${token.trim()}`;
  }

  return headers;
};

// Fetches education.json from the KrishnaNaik6/Education repo
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
      console.error('[/api/github/details] GitHub API response:', res.status, res.statusText);
      return null;
    }

    const fileData = await res.json();
    if (!fileData.content) return null;

    // GitHub returns file content as base64
    const decoded = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const jsonData: PortfolioDetails = JSON.parse(decoded);
    return jsonData;
  } catch (err) {
    console.error('[/api/github/details] Error:', err);
    return null;
  }
}

// Returns repos with has_projects=true + collaborator count, plus Canara-Tech-Labs/sprentzo-webapp
export async function fetchGitHubProjects(): Promise<ProjectItem[]> {
  try {
    const headers = getGitHubHeaders();

    // 1. Fetch repos the authenticated user can see (falls back to public repos if token lacks user scope)
    let allRepos: any[] = [];
    const reposRes = await fetch(
      `https://api.github.com/user/repos?affiliation=owner,collaborator&visibility=public&per_page=100`,
      {
        headers,
        next: { revalidate: 3600 },
      }
    );

    if (reposRes.ok) {
      allRepos = await reposRes.json();
    } else {
      const fallbackRes = await fetch(
        `https://api.github.com/users/${OWNER}/repos?per_page=100`,
        {
          headers,
          next: { revalidate: 3600 },
        }
      );
      if (fallbackRes.ok) {
        allRepos = await fallbackRes.json();
      }
    }

    // 2. Filter: has_projects flag and exclude Internship-2024-exercise-1
    const filtered = allRepos.filter(
      (repo) => repo.has_projects && repo.name !== 'Internship-2024-exercise-1'
    );

    // 3. Fetch collaborators for each repo
    const withCollabs: ProjectItem[] = await Promise.all(
      filtered.map(async (repo) => {
        try {
          const collabRes = await fetch(
            `https://api.github.com/repos/${repo.owner?.login || OWNER}/${repo.name}/collaborators`,
            {
              headers,
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

    // 4. Append specific org repo
    try {
      const orgRepoRes = await fetch(
        `https://api.github.com/repos/Canara-Tech-Labs/sprentzo-webapp`,
        {
          headers,
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
      // Org repo unavailable - continue without it
    }

    return withCollabs;
  } catch (err) {
    console.error('[/api/github/projects] Error:', err);
    return [];
  }
}

// Fetches contribution heatmap data
export async function fetchGitHubUserContributions(username: string): Promise<GitHubContributionsResponse | null> {
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}`, {
      headers: {
        'User-Agent': 'Krishna-Naik-Portfolio',
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      total: data.total || {},
      contributions: Array.isArray(data.contributions) ? data.contributions : [],
    };
  } catch (err) {
    console.error('[/api/github/contributions] Error:', err);
    return null;
  }
}

// Powers GitHub Intelligence / Stats section: returns user, repos, commits, PRs, issues
export async function fetchGitHubUserStats(username: string): Promise<GitHubStatsResponse> {
  const headers = getGitHubHeaders();

  // 1. User profile
  const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers,
    next: { revalidate: 1800 },
  });

  if (userRes.status === 403) throw new Error('API Rate Limit Exceeded.');
  if (!userRes.ok) throw new Error('User node not found.');

  const user = await userRes.json();

  // 2. Repositories
  const repoUrl =
    username.toLowerCase() === OWNER.toLowerCase()
      ? `https://api.github.com/user/repos?visibility=all&sort=updated&per_page=100`
      : `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`;

  let repos = [];
  try {
    const reposRes = await fetch(repoUrl, { headers, next: { revalidate: 1800 } });
    if (reposRes.ok) {
      repos = await reposRes.json();
    } else if (username.toLowerCase() === OWNER.toLowerCase()) {
      // Fallback to public repos if token has scope restriction
      const publicReposRes = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
        { headers, next: { revalidate: 1800 } }
      );
      if (publicReposRes.ok) repos = await publicReposRes.json();
    }
  } catch {
    repos = [];
  }

  // 3. Commit / PR / Issue counts via Search API
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

  // 4. Contribution heatmap data
  const contributionsData = await fetchGitHubUserContributions(username).catch(() => null);

  return {
    user,
    repos: Array.isArray(repos) ? repos : [],
    extraStats: { commits, prs, issues },
    contributionsData: contributionsData || undefined,
  };
}
