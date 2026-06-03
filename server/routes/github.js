import express from "express";

const router = express.Router();

const OWNER = "KrishnaNaik6";

const ghHeaders = () => ({
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

// ── /api/github/profile ─────────────────────────────────────────────────────
router.get("/profile", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${OWNER}`,
      { headers: ghHeaders() }
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── /api/github/repos ────────────────────────────────────────────────────────
router.get("/repos", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${OWNER}/repos?per_page=100`,
      { headers: ghHeaders() }
    );
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── /api/github/details ──────────────────────────────────────────────────────
// Fetches education.json from the private KrishnaNaik6/Education repo,
// decodes it, and returns the parsed JSON to the frontend.
router.get("/details", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${OWNER}/Education/contents/education.json`,
      { headers: ghHeaders() }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error("[/details] GitHub API error:", response.status, err);
      return res.status(response.status).json({ error: err.message || "Failed to fetch details" });
    }

    const file = await response.json();
    // GitHub returns file content as base64
    const decoded = Buffer.from(file.content, "base64").toString("utf-8");
    const jsonData = JSON.parse(decoded);

    return res.status(200).json(jsonData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── /api/github/projects ─────────────────────────────────────────────────────
// Returns repos with has_projects=true + collaborator count, plus one org repo.
router.get("/projects", async (req, res) => {
  try {
    // 1. Fetch all repos the authenticated user can see (includes private)
    const reposRes = await fetch(
      `https://api.github.com/user/repos?affiliation=owner,collaborator&visibility=public&per_page=100`,
      { headers: ghHeaders() }
    );

    if (!reposRes.ok) {
      const err = await reposRes.json();
      return res.status(reposRes.status).json({ error: err.message || "Failed to fetch repos" });
    }

    const allRepos = await reposRes.json();

    // 2. Filter: has_projects flag and exclude a specific repo
    const filtered = allRepos.filter(
      (repo) => repo.has_projects && repo.name !== "Internship-2024-exercise-1"
    );

    // 3. Fetch collaborators for each repo
    const withCollabs = await Promise.all(
      filtered.map(async (repo) => {
        try {
          const collabRes = await fetch(
            `https://api.github.com/repos/${repo.owner.login}/${repo.name}/collaborators`,
            { headers: ghHeaders() }
          );
          const collabs = collabRes.ok ? await collabRes.json() : [];
          return {
            name: repo.name,
            description: repo.description,
            link: { git: repo.html_url, live: repo.homepage },
            collabed: Array.isArray(collabs) && collabs.length > 1,
          };
        } catch {
          return {
            name: repo.name,
            description: repo.description,
            link: { git: repo.html_url, live: repo.homepage },
            collabed: false,
          };
        }
      })
    );

    // 4. Append the specific org repo
    try {
      const orgRepoRes = await fetch(
        `https://api.github.com/repos/Canara-Tech-Labs/sprentzo-webapp`,
        { headers: ghHeaders() }
      );
      if (orgRepoRes.ok) {
        const orgRepo = await orgRepoRes.json();
        withCollabs.push({
          name: orgRepo.name,
          description: orgRepo.description,
          link: { git: orgRepo.html_url, live: orgRepo.homepage },
          collabed: true,
        });
      }
    } catch {
      // Org repo unavailable — continue without it
    }

    return res.status(200).json(withCollabs);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ── /api/github/stats/:username ──────────────────────────────────────────────
// Powers the GitHubStats component — returns user, repos, and search counts.
router.get("/stats/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const headers = ghHeaders();

    // User profile
    const userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    if (userRes.status === 403) return res.status(403).json({ error: "API Rate Limit Exceeded." });
    if (!userRes.ok) return res.status(404).json({ error: "User node not found." });
    const user = await userRes.json();

    // Repos — use authenticated endpoint if the username matches the token owner
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
});

export default router;
