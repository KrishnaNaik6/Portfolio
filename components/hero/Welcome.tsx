'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TypingText from '../ui/TypingText';
import { ArrowDownRight, FileText, Send } from 'lucide-react';
import AnchorLink from '../ui/AnchorLink';
import dynamic from 'next/dynamic';
import { ProfileData, SectionConfig } from '@/lib/types';
import { isSectionEnabled } from '@/lib/sectionConfig';

const Hero3DCanvas = dynamic(() => import('./Hero3DCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[320px] sm:h-[380px] md:h-[450px] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-neon-indigo/20 border-t-neon-indigo rounded-full animate-spin" />
    </div>
  ),
});

interface WelcomeProps {
  onComplete: () => void;
  profile?: ProfileData;
  sections?: SectionConfig[] | null;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete, profile, sections }) => {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) {
      onComplete();
    }
  }, [complete, onComplete]);

  const badges = ['Full-Stack Dev', 'AI & ML Systems', 'React 19 / Next.js 15', 'TypeScript', 'Python'];

  const headline = profile?.headline
    ? `01 / ${profile.headline.toUpperCase()}`
    : '01 / CREATIVE DEVELOPER & AI ENGINEER';

  const resumeHref = profile?.resumeUrl || '/KrishnaNaik.pdf';

  const isProjectsActive = useMemo(() => isSectionEnabled(sections, 'projects'), [sections]);
  const isContactActive = useMemo(() => isSectionEnabled(sections, 'contact'), [sections]);
  const workTarget = isProjectsActive ? 'projects' : 'about';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8 pb-16 px-4 max-w-7xl mx-auto relative z-10">
      {/* Left Column: Asymmetric Editorial Typography & Hero Copy */}
      <div className="lg:col-span-7 flex flex-col text-left space-y-6">
        {/* Editorial Subtitle Pill */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/20 dark:bg-slate-900/60 border border-neon-indigo/30 text-neon-indigo text-xs font-mono tracking-widest uppercase w-fit shadow-[0_0_20px_rgba(99,102,241,0.2)]"
        >
          <span className="w-2 h-2 rounded-full bg-neon-indigo animate-ping" />
          <span>{headline}</span>
        </motion.div>

        {/* Display Title with Typing Effect */}
        <h1
          className="
            text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-sora
            bg-gradient-to-r from-neon-indigo via-text-primary to-neon-cyan
            text-transparent bg-clip-text
            tracking-tight select-none leading-[1.1]
          "
        >
          <span className="sr-only">
            Krishna Naik | Krishna — Full-Stack Developer &amp; AI/ML Engineer Portfolio
          </span>
          <span aria-hidden="true">
            <TypingText speed={40} onComplete={() => setComplete(true)}>
              Hey there!! Welcome to my Portfolio
            </TypingText>
          </span>
        </h1>

        {/* Short Editorial Intro Paragraph */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-text-secondary text-base md:text-lg max-w-2xl leading-relaxed font-normal"
        >
          {profile?.bio ? (
            profile.bio.includes('Krishna') ? (
              profile.bio
            ) : (
              <>
                I am <strong className="text-text-primary font-semibold">{profile.fullName || 'Krishna Naik'}</strong> (<strong className="text-text-primary font-semibold">Krishna</strong>) — {profile.bio}
              </>
            )
          ) : (
            <>
              I am <strong className="text-text-primary font-semibold">Krishna Naik</strong> (<strong className="text-text-primary font-semibold">Krishna Umesh Naik</strong>), a Computer Science student specializing in AI & ML at Ramaiah Institute of Technology. Crafting intelligent systems, full-stack web applications, and immersive digital experiences.
            </>
          )}
        </motion.p>

        {/* Interactive Tech Badge Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-wrap gap-2.5 pt-2"
        >
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-card-bg border border-border-color text-text-secondary hover:text-neon-indigo hover:border-neon-indigo/40 transition-all cursor-default shadow-sm"
            >
              #{badge}
            </span>
          ))}
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap items-center gap-4 pt-4"
        >
          <AnchorLink to={workTarget}>
            <div className="px-7 py-4 rounded-full bg-neon-indigo text-white font-bold text-sm font-sora flex items-center gap-2.5 hover:bg-neon-indigo/90 transition-all shadow-[0_0_25px_rgba(99,102,241,0.4)] hover:scale-105 cursor-pointer">
              <span>EXPLORE WORK</span>
              <ArrowDownRight size={18} />
            </div>
          </AnchorLink>

          {isContactActive && (
            <AnchorLink to="contact">
              <div className="px-7 py-4 rounded-full bg-card-bg border border-border-color text-text-primary font-semibold text-sm font-sora flex items-center gap-2 hover:border-neon-cyan hover:text-neon-cyan transition-all hover:scale-105 cursor-pointer">
                <Send size={16} />
                <span>CONNECT</span>
              </div>
            </AnchorLink>
          )}

          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-4 rounded-full bg-card-bg border border-border-color text-text-secondary font-semibold text-sm font-sora flex items-center gap-2 hover:border-neon-rose hover:text-neon-rose transition-all hover:scale-105"
          >
            <FileText size={16} />
            <span>RESUME</span>
          </a>
        </motion.div>
      </div>

      {/* Right Column: Interactive 3D Cosmic Core Visual */}
      <div className="lg:col-span-5 w-full">
        <Hero3DCanvas />
      </div>
    </div>
  );
};

export default Welcome;
