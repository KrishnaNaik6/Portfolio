'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Monitor, Terminal, CheckCircle2 } from 'lucide-react';
import { SkillData } from '@/lib/types';
import SectionWrapper, { staggerContainer } from '../ui/SectionWrapper';
import GlassCard from '../cards/GlassCard';

interface SkillsSectionProps {
  skillData?: SkillData;
  sectionRef?: React.RefObject<HTMLElement | null>;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skillData, sectionRef }) => {
  const technicalSkills = skillData?.Technical || {};
  const softSkills = skillData?.['Soft Skills'] || [];
  const technicalCategories = Object.keys(technicalSkills);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Programming & Development':
        return <Code className="w-6 h-6 text-neon-purple" />;
      case 'Databases & Tools':
        return <Monitor className="w-6 h-6 text-neon-cyan" />;
      case 'DevOps':
        return <Zap className="w-6 h-6 text-neon-pink" />;
      default:
        return <Terminal className="w-6 h-6 text-neon-cyan" />;
    }
  };

  return (
    <SectionWrapper ref={sectionRef} id="skills" title="Skills" terminalCommand="ls -l $skills">
      {technicalCategories.length > 0 ? (
        <>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalCategories.map((category, index) => (
              <GlassCard key={index} className="flex flex-col justify-between shadow-2xl group hover:border-neon-cyan/40 transition-colors">
                <div>
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                    <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/10 shrink-0 group-hover:scale-110 transition-transform">
                      {getCategoryIcon(category)}
                    </div>
                    <h3 className="text-xl font-bold font-sora text-text-primary tracking-tight">{category}</h3>
                  </div>

                  <ul className="space-y-3">
                    {Object.keys(technicalSkills[category] || {}).map((skillName, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-text-secondary hover:text-neon-cyan transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mr-3 shadow-[0_0_8px_rgba(0,245,212,0.8)]" />
                        <span className="font-mono text-text-primary">{skillName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {softSkills.length > 0 && (
            <motion.div variants={staggerContainer} className="mt-10 max-w-2xl mx-auto">
              <GlassCard className="p-8 text-center shadow-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-pink/15 border border-neon-pink/30 text-neon-pink text-xs font-mono uppercase tracking-widest mb-6">
                  <Zap size={14} />
                  <span>Soft Skills & Competencies</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {softSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/60 border border-white/10 text-xs font-sora font-semibold text-text-primary hover:border-neon-pink/40 hover:text-neon-pink transition-all"
                    >
                      <CheckCircle2 size={14} className="text-neon-pink" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </>
      ) : (
        <div className="text-center text-text-secondary font-mono py-8">
          Loading skills inventory...
        </div>
      )}
    </SectionWrapper>
  );
};

export default SkillsSection;
