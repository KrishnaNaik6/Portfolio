import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import './Hero.css';
import Welcome from "./Welcome/Welcome";
import Animated from "./AnimatedBlock/Animated";
import SwipeCards from "../SwipeCards/SwipeCards";
import Projects from "./Projects/Projects";
import Education from "./Education/Education";

import { Octokit } from "@octokit/core";
import Experience from "./Experience/Experience";
import Skills from "./Skills/Skills";
import Contact from "./Contact/Contact";
const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN
});


const popUp = {
    hidden: { opacity: 0, scale: 0.7, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
};


const Hero = () => {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState([]);
    const [Show, setShow] = useState(false)

    const block = [
        <section className="anim_sec wai">
            <h3>~\KrishnaNaik6{'>'}who am i?</h3>
            <p style={{ display: 'flex', justifyContent: 'flex-end', alignContent: 'center', textAlign: 'center' }}>
                Computer Science (AI & ML) student at Ramaiah Institute of Technology with skills in Python,
                React.js, Node.js, and SQL. Experienced in building full-stack applications including multilingual news and
                enterprise platforms. Passionate about AI, problem-solving, and developing scalable real-world solutions.
            </p>
        </section>,
        <section className="anim_sec proj_div">
            <h3>~\KrishnaNaik6{'>'} echo $projects</h3>
            <Projects load={() => setLoading(false)} />
            {/* <Projects load={() => setLoading(false)} /> */}
        </section>,

    ];
    const cond_block = [
        <section className="anim_sec educ">
            <h3>~\KrishnaNaik6{'>'} echo $education</h3>
            <Education eduData={details['education']} />
        </section>,
        <section className="anim_sec exp">
            <h3>~\KrishnaNaik6{'>'} echo $experience</h3>
            <Experience expData={details['experience']} />
        </section>,
        <section>
            <h3>~\skills{'>'} ls</h3>
            <Skills skillData={details['skills']} />
        </section>,
        <section>
            <h3>Reach Out</h3>
            <p>“Don’t hesitate to say hello 👋. I enjoy networking and learning from people across the world.”</p>
            <Contact contact={details['contact']} />
        </section>,
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, impedit!",
    ]

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const response = await octokit.request(
                    "GET /repos/{owner}/{repo}/contents/{path}",
                    {
                        owner: "KrishnaNaik6",
                        repo: "Education",
                        path: "education.json",
                        headers: {
                            "X-GitHub-Api-Version": "2022-11-28"
                        }
                    }
                );

                // GitHub returns Base64 content
                const content = atob(response.data.content);
                const jsonData = JSON.parse(content);

                setDetails(jsonData);
                setLoading(false)
            } catch (error) {
                setLoading(true)
                console.error("Error fetching education:", error);
            }
        };

        fetchEducation();
    }, [loading, Show]);

    const blocks = loading ? block : [
        ...block, ...cond_block
    ]

    return (
        <div className="hero min-h-screen bg-gray-100 p-10 space-y-20">
            <Welcome show={() => setShow(true)} />
            {
                Show &&
                blocks.map((text, i) => (
                    <Animated key={i}>
                        {text}
                    </Animated>
                ))
            }

        </div>
    )
}

export default Hero;
