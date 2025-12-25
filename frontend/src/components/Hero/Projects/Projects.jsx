import { useEffect, useState } from 'react'
import { Octokit } from "@octokit/core";
import Animated from '../AnimatedBlock/Animated';
import Etext from '../../ExpandableText/EText';
import SectionWrapper from '../../SectionWrapper/SectionWrapper';
import ProjectCard from '../../Cards/ProjectCards';

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

                <Animated width='auto'>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                        {repos.map((project, i) => (
                            <ProjectCard key={i} project={project} />
                        ))}
                    </div>
                </Animated>

            )}
        </div>
    );
};

export default Projects;
