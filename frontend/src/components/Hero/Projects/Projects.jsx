import './Projects.css'
import { useEffect, useState } from 'react'
import { Octokit } from "@octokit/core";
import Animated from '../AnimatedBlock/Animated';

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
});

const Projects = () => {
    const [loading, setLoading] = useState(true);
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await octokit.request("GET /user/repos", {
                    affiliation: "owner,collaborator",
                    visibility: "public",
                    per_page: 100,
                });

                let filtered = res.data.filter(repo =>
                    repo.has_projects && repo.name !== "Internship-2024-exercise-1"
                );

                const withCollabs = await Promise.all(
                    filtered.map(async (repo) => {
                        try {
                            const collabs = await octokit.request(
                                "GET /repos/{owner}/{repo}/collaborators",
                                {
                                    owner: repo.owner.login,
                                    repo: repo.name,
                                    headers: { "X-GitHub-Api-Version": "2022-11-28" },
                                }
                            );

                            return {
                                name: repo.name,
                                description: repo.description,
                                link: { git: repo.html_url, live: repo.homepage },
                                collabed: collabs.data.length > 1,
                            };
                        } catch (err) {
                            return {
                                name: repo.name,
                                description: repo.description,
                                link: { git: repo.html_url, live: repo.homepage },
                                collabed: false,
                            };
                        }
                    })
                );

                try {
                    const specificRepo = await octokit.request(
                        "GET /repos/{owner}/{repo}",
                        {
                            owner: "Canara-Tech-Labs",
                            repo: "sprentzo-webapp",
                        }
                    );

                    withCollabs.push({
                        name: specificRepo.data.name,
                        description: specificRepo.data.description,
                        link: { git: specificRepo.data.html_url, live: specificRepo.data.homepage },
                        collabed: true,
                    });
                } catch (err) {
                    console.warn("Error fetching specific repo:", err);
                }

                setRepos(withCollabs);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching repos:", err);
                setLoading(true);
            }
        };

        fetchRepos();
    }, []);

    return (
        <div className='projects'>
            {loading ? (
                <p>Loading...</p>
            ) : (
                repos.map((card, i) => (
                    <Animated key={i} width='auto'>
                        <div className='card easeElem'>
                            <h3>{card.name}</h3>
                            <p>{card.description}</p>
                            <p className="collabed">{card.collabed ? 'Collaborated Project' : 'Solo Project'}</p>
                            {card.link.live ? (
                                card.link.live.length !== 0 ?
                                    <button onClick={() => window.open(card.link.live)}>Live Website</button>
                                    : <p className='collabed'>Not Hosted</p>
                            ) : <p className='collabed'>Not Hosted</p>}
                            <button onClick={() => window.open(card.link.git)}>GitHub link</button>
                        </div>
                    </Animated>
                ))
            )}
        </div>
    );
};

export default Projects;
