const ghHeaders = () => ({
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    // 1. Fetch all repos the authenticated user can see
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
}
