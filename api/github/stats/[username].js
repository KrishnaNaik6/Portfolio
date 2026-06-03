const OWNER = "KrishnaNaik6";

const ghHeaders = () => ({
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const headers = ghHeaders();

    // User profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (userRes.status === 403) return res.status(403).json({ error: "API Rate Limit Exceeded." });
    if (!userRes.ok) return res.status(404).json({ error: "User node not found." });
    const user = await userRes.json();

    // Repos — use authenticated endpoint when querying the token owner
    const repoUrl =
      username.toLowerCase() === OWNER.toLowerCase()
        ? `https://api.github.com/user/repos?visibility=all&sort=updated&per_page=100`
        : `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`;
    const reposRes = await fetch(repoUrl, { headers });
    const repos = reposRes.ok ? await reposRes.json() : [];

    // Commit / PR / Issue counts via Search API
    const query = encodeURIComponent(`author:${username}`);
    const [commitRes, prRes, issueRes] = await Promise.all([
      fetch(`https://api.github.com/search/commits?q=${query}`, {
        headers: { ...headers, Accept: "application/vnd.github.cloak-preview" },
      }),
      fetch(`https://api.github.com/search/issues?q=${query}+type:pr`, { headers }),
      fetch(`https://api.github.com/search/issues?q=${query}+type:issue`, { headers }),
    ]);

    const [commits, prs, issues] = await Promise.all([
      commitRes.json(),
      prRes.json(),
      issueRes.json(),
    ]);

    return res.status(200).json({
      user,
      repos: Array.isArray(repos) ? repos : [],
      extraStats: {
        commits: commits.total_count || 0,
        prs: prs.total_count || 0,
        issues: issues.total_count || 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
