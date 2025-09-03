import './Projects.css'
import { useEffect, useState } from 'react'
import { Octokit } from "@octokit/core";
import SwipeCards from '../../SwipeCards/SwipeCards';
import Animated from '../AnimatedBlock/Animated';

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN, // from .env
});


const Projects = ({ load }) => {
    const [loading, setLoading] = useState(true);
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                // Step 1: Get repos
                const res = await fetch("https://api.github.com/users/KrishnaNaik6/repos");
                const data = await res.json();

                // Step 2: Filter repos that have projects
                const filtered = data.filter(item => item.has_projects);

                // Step 3: For each repo, check collaborators
                const withCollabs = await Promise.all(
                    filtered.map(async (repo) => {
                        try {
                            const collabs = await octokit.request("GET /repos/{owner}/{repo}/collaborators", {
                                owner: "KrishnaNaik6",
                                repo: repo.name,
                                headers: { "X-GitHub-Api-Version": "2022-11-28" },
                            })
                            console.log(`Repo: ${repo.name}, Collaborators: ${collabs.data.length}`);
                            return {
                                name: repo.name,
                                description: repo.description,
                                link: { git: repo.html_url, live: repo.homepage },
                                collabed: collabs.data.length > 1, // true if has collaborators
                            };
                        } catch (err) {
                            if (err.status === 404) {
                                console.warn(`No collaborators found for ${repo.name}`);
                            }
                            return {
                                name: repo.name,
                                description: repo.description,
                                link: { git: repo.html_url, live: repo.homepage },
                                collabed: false,
                            };
                        }
                    })
                );

                setRepos(withCollabs);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching repos:", err);
                setLoading(true);
            }
        };

        fetchRepos().then(() =>
            console.log("the repos", repos)
        )
    }, [loading]);

    return (
        <div className='projects' style={{ width: 'inherit' }}>
            {loading ? '' : load()}
            {loading ? (
                <p>loading..</p>
            ) : (
                repos.map((card, i) =>
                    // <SwipeCards cards={repos} />

                    <Animated key={i}>
                        <div className='card'>
                            <h3>{card.name}</h3>
                            <p>{card.description}</p>
                            <p>{card.collabed ? 'Callabed Project' : 'Solo Project'}</p>
                            {<button onClick={() => window.open(card.link.git)}>GitHub link</button>}
                            {card.link.live != null ? card.link.live.length != 0 ? <button onClick={() => window.open(card.link.live)}>live website</button> : 'Not hosted' : 'Not hosted'}
                        </div>
                    </Animated>
                )

            )}

        </div>
    );
};

export default Projects;
