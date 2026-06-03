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
}
