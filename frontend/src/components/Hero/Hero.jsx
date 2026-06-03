import React, { useState, useEffect } from "react";
import Welcome from "./Welcome/Welcome";
import Animated from "./AnimatedBlock/Animated";
import Projects from "./Projects/Projects";
import Education from "./Education/Education";
import Experience from "./Experience/Experience";
import Skills from "./Skills/Skills";
import Contact from "./Contact/Contact";
import Interest from "./Interest/Interest";
import Footer from "../Footer/Footer";
import useInViewCustom from "../../hooks/useInViewCustom";
import { CircleArrowDown, CircleArrowUp } from 'lucide-react';
import SectionWrapper from "../SectionWrapper/SectionWrapper";
import GlassCard from "../Cards/GlassCard";
import GitHubStats from "./GitHubStats/GitHubStats";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Hero = ({ completed }) => {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState([]);
  const [showContent, setShowContent] = useState(false); // Renamed to avoid conflict
  
  showContent ? completed() : ""

  const [ref1, inView1] = useInViewCustom({ threshold: 0.3 });
  const [ref2, inView2] = useInViewCustom({ threshold: 0.3 });
  const [ref3, inView3] = useInViewCustom({ threshold: 0.3 });
  const [ref4, inView4] = useInViewCustom({ threshold: 0.3 });
  const [ref5, inView5] = useInViewCustom({ threshold: 0.3 });
  const [ref6, inView6] = useInViewCustom({ threshold: 0.3 });
  const [ref7, inView7] = useInViewCustom({ threshold: 0.5 });
  const [ref8, inView8] = useInViewCustom({ threshold: 0.5 });
  const [ref9, inView9] = useInViewCustom({ threshold: 0.5 });

  // useEffect(() => {
  //   if (!showContent) return;

  //   const sections = document.querySelectorAll("section[id]");
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           onSectionChange(entry.target.id);
  //         }
  //       });
  //     },
  //     { threshold: 0.7 }
  //   );

  //   sections.forEach((section) => observer.observe(section));
  //   return () => {
  //     sections.forEach((section) => observer.unobserve(section));
  //   };
  // }, [showContent, onSectionChange]);

  const block = [
    <SectionWrapper ref={ref1} id="about" title="About" terminalCommand="whoami">
      <GlassCard className="p-8 md:p-12 text-center max-w-4xl mx-auto">
        <p className="text-lg md:text-xl text-text-primary mb-6 leading-relaxed">
          I'm **Krishna Naik**, a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. I enjoy building full-stack applications and experimenting with intelligent systems that bridge the gap between technology and real-world impact.
        </p>
        <p className="text-text-secondary leading-relaxed mb-6">
          With hands-on experience in web development, backend systems, and AI-driven projects, I'm passionate about solving problems through innovation and creativity. My goal is to explore how AI can transform everyday life while sharpening my skills as a developer and researcher.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Outside of coding, I love exploring emerging tech trends and challenging myself with projects that push the boundaries of what's possible.
        </p>
      </GlassCard>

    </SectionWrapper>,
    <div style={{ display: 'flex', justifyContent: 'center' }} key="loading">
      {loading && <p>Loading...</p>}
    </div>
  ];

  const cond_block = [
    <SectionWrapper ref={ref2} id="education" title="Education" terminalCommand="echo $education">
      <Education eduData={details['education']} />
    </SectionWrapper>
    ,
    <SectionWrapper ref={ref3} id="experience" title="Experience" terminalCommand="echo $experience">
      <Experience expData={details['experience']} />
    </SectionWrapper>
    ,
    <SectionWrapper ref={ref4} id="projects" title="Projects" terminalCommand="echo $projects">
      <Projects />
    </SectionWrapper>
    ,
    <SectionWrapper ref={ref5} id="skills" title="Skills" terminalCommand="ls -l $skills">
      <Skills skillData={details['skills']} />
    </SectionWrapper>
    ,
    <SectionWrapper ref={ref6} id="interest" title="Interest" terminalCommand="cat $interest">
      <Interest Interest={details['interest']} />
    </SectionWrapper>
    ,
    <SectionWrapper ref={ref8} id="git-stats" title="Git Stats" terminalCommand="show $gitStats">
      <GitHubStats
        initialUsername="KrishnaNaik6"
      />
    </SectionWrapper>,
    <SectionWrapper ref={ref7} id="contact" title="Contact" terminalCommand="ssh reachout@krishna">
      <Contact contact={details['contact']} />
    </SectionWrapper>,
    <section ref={ref9} id="footer" key="footer">
      <Footer />
    </section>
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/api/github/details`);
        if (!response.ok) throw new Error(`Server error: ${response.status}`);
        const jsonData = await response.json();

        console.log("got all data");

        setDetails(jsonData);
        setLoading(false);
      } catch (error) {
        setLoading(true);
        console.error("Error fetching details:", error);
      }
    };

    if (showContent) {
      fetchDetails();
    }
  }, [showContent]);

  const blocks = loading ? block : [...block, ...cond_block];

  return (
    <div className="mt-30 bg-bg-main transition-colors">
      <Welcome show={() => setShowContent(true)} />
      {showContent && blocks.map((text, i) => (
        <div key={i}> {/* Added key prop */}
          <Animated key={i}>{text}</Animated>
        </div>
      ))}

      {showContent && (
        <section
          id="scroll"
          className="fixed bottom-30 left-1/2 -translate-x-1/2 z-50"
        >
          {inView9 ? (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full bg-gray-800/40 backdrop-blur-lg shadow-lg animate-bounce text-neon-cyan">
              <a href="#about"><CircleArrowUp /></a>
            </div>
          ) : (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full bg-gray-800/40 backdrop-blur-lg shadow-lg animate-bounce text-neon-cyan">
              <a href="#footer"><CircleArrowDown /></a>
            </div>
          )}
        </section>
      )}

    </div>
  );
};

export default Hero;