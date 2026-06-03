import { useEffect, useState } from 'react'
import Animated from '../AnimatedBlock/Animated';
import SectionWrapper from '../../SectionWrapper/SectionWrapper';
import ProjectCard from '../../Cards/ProjectCards';

const API_URL = import.meta.env.VITE_API_URL ?? "";

const Projects = () => {
    const [loading, setLoading] = useState(true);
    const [repos, setRepos] = useState([]);

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/github/projects`);
                if (!res.ok) throw new Error(`Server error: ${res.status}`);
                const data = await res.json();
                setRepos(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching projects:", err);
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
