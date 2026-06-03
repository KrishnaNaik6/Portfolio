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
      `https://api.github.com/repos/${OWNER}/Education/contents/education.json`,
      { headers: ghHeaders() }
    );

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.message || "Failed to fetch details" });
    }

    const file = await response.json();
    // GitHub returns file content as base64 — decode it server-side
    const decoded = Buffer.from(file.content, "base64").toString("utf-8");
    const jsonData = JSON.parse(decoded);

    return res.status(200).json(jsonData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
