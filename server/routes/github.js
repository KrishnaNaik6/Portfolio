import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/profile", async (req, res) => {
  try {
    const user = "KrishnaNaik6";

    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    };

    const response = await fetch(
      `https://api.github.com/users/${user}`,
      { headers }
    );

    const data = await response.json();

    console.log("TOKEN EXISTS:", !!process.env.GITHUB_TOKEN);
    console.log("GitHub API status:", response.status);

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/repos", async (req, res) => {
  try {
    const user = "KrishnaNaik6";

    const headers = {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json"
    };

    const response = await fetch(
      `https://api.github.com/users/${user}/repos?per_page=100`,
      { headers }
    );

    const data = await response.json();

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
