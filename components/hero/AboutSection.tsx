'use client';

import React from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';

interface AboutSectionProps {
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const AboutSection: React.FC<AboutSectionProps> = ({ sectionRef }) => {
  return (
    <SectionWrapper ref={sectionRef} id="about" title="About" terminalCommand="whoami">
      <GlassCard className="p-8 md:p-12 text-center max-w-4xl mx-auto shadow-2xl">
        <p className="text-lg md:text-xl text-text-primary mb-6 leading-relaxed font-medium">
          I'm <strong className="text-neon-cyan font-bold">Krishna Naik</strong>, a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. I enjoy building full-stack applications and experimenting with intelligent systems that bridge the gap between technology and real-world impact.
        </p>
        <p className="text-text-secondary leading-relaxed mb-6 text-base md:text-lg">
          With hands-on experience in web development, backend systems, and AI-driven projects, I'm passionate about solving problems through innovation and creativity. My goal is to explore how AI can transform everyday life while sharpening my skills as a developer and researcher.
        </p>
        <p className="text-text-secondary leading-relaxed text-base md:text-lg">
          Outside of coding, I love exploring emerging tech trends and challenging myself with projects that push the boundaries of what's possible.
        </p>
      </GlassCard>
    </SectionWrapper>
  );
};

export default AboutSection;
