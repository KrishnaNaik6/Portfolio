import React, { useState, useEffect } from "react";
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
import Interest from "./Interest/Interest";
import Footer from "../Footer/Footer";
import useInViewCustom from "../../hooks/useInViewCustom";
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN
});

const Hero = ({ onSectionChange }) => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [showContent, setShowContent] = useState(false); // Renamed to avoid conflict

  const [ref1, inView1] = useInViewCustom({ threshold: 0.3 });
  const [ref2, inView2] = useInViewCustom({ threshold: 0.3 });
  const [ref3, inView3] = useInViewCustom({ threshold: 0.3 });
  const [ref4, inView4] = useInViewCustom({ threshold: 0.3 });
  const [ref5, inView5] = useInViewCustom({ threshold: 0.3 });
  const [ref6, inView6] = useInViewCustom({ threshold: 0.3 });
  const [ref7, inView7] = useInViewCustom({ threshold: 0.3 });

  useEffect(() => {
    if (!showContent) return;

    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onSectionChange(entry.target.id);
          }
        });
      },
      { threshold: 0.7 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [showContent, onSectionChange]);

  const block = [
    <section id="about" className="easeElem anim_sec wai" key="about">
      <h2 ref={ref7} className={`border-animate ${inView7 ? "show" : ""}`}>
        ~\KrishnaNaik6{'>'}who am i?
      </h2>
      <p style={{
        textAlign: 'justify',
        lineHeight: '1.5',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        &nbsp;&nbsp;&nbsp;&nbsp;Hi, I'm Krishna Naik, a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. I enjoy building full-stack applications and experimenting with intelligent systems that bridge the gap between technology and real-world impact.
        <br /><br />
        With hands-on experience in web development, backend systems, and AI-driven projects, I'm passionate about solving problems through innovation and creativity. My goal is to explore how AI can transform everyday life while sharpening my skills as a developer and researcher.
        <br /><br />
        Outside of coding, I love exploring emerging tech trends and challenging myself with projects that push the boundaries of what's possible.
      </p>
    </section>,
    <div style={{ display: 'flex', justifyContent: 'center' }} key="loading">
      {loading && <p>Loading...</p>}
    </div>
  ];

  const cond_block = [
    <section id="education" className="anim_sec educ" key="education">
      <h2 ref={ref1} className={`border-animate ${inView1 ? "show" : ""}`}>
        ~\KrishnaNaik6{'>'} echo $education
      </h2>
      <Education eduData={details['education']} />
    </section>,
    <section id="experience" className="anim_sec exp" key="experience">
      <h2 ref={ref3} className={`border-animate ${inView3 ? "show" : ""}`}>
        ~\KrishnaNaik6{'>'} echo $experience
      </h2>
      <Experience expData={details['experience']} />
    </section>,
    <section id="projects" className="anim_sec proj_div" key="projects">
      <h2 ref={ref2} className={`border-animate ${inView2 ? "show" : ""}`}>
        ~\KrishnaNaik6{'>'} echo $projects
      </h2>
      <Projects />
    </section>,
    <section id="skill" key="skills">
      <h2 ref={ref4} className={`border-animate ${inView4 ? "show" : ""}`}>
        ~\skills{'>'} ls
      </h2>
      <Skills skillData={details['skills']} />
    </section>,
    <section id="interest" key="interest">
      <h2 ref={ref6} className={`border-animate ${inView6 ? "show" : ""}`}>
        Interest
      </h2>
      <Interest Interest={details['interest']} />
    </section>,
    <section id="contact" key="contact">
      <h2 ref={ref5} className={`border-animate ${inView5 ? "show" : ""}`}>
        Reach Out
      </h2>
      <p style={{ textAlign: "center" }}>
        "Don't hesitate to say hello 👋. I enjoy networking and learning from people across the world."
      </p>
      <Contact contact={details['contact']} />
    </section>,
    <section id="footer" key="footer">
      <Footer />
    </section>
  ];

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const response = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          {
            owner: "KrishnaNaik6",
            repo: "Education",
            path: "education.json",
            headers: { "X-GitHub-Api-Version": "2022-11-28" }
          }
        );
        const content = atob(response.data.content);
        const jsonData = JSON.parse(content);

        setDetails(jsonData);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error("Error fetching education:", error);
      }
    };

    if (showContent) {
      fetchEducation();
    }
  }, [showContent]); // Removed 'loading' from dependencies

  const blocks = loading ? block : [...block, ...cond_block];

  return (
    <div className="hero min-h-screen bg-gray-100 p-10 space-y-20">
      <Welcome show={() => setShowContent(true)} />
      {showContent && blocks.map((text, i) => (
        <div key={i}> {/* Added key prop */}
          <Animated key={i}>{text}</Animated>
        </div>
      ))}
      
      {showContent && (
        <section id="scroll" className="scroll">
          {inView5 ?
            <div className="bouncer scroll">
              <a href="#about"><CircleArrowUp /></a>
            </div>
            :
            <div className="bouncer scroll">
              <CircleArrowDown />
            </div>
          }
        </section>
      )}
    </div>
  );
};

export default Hero;