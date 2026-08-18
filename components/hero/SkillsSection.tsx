'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Monitor, Terminal } from 'lucide-react';
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
        return <Code className="w-7 h-7 text-neon-purple mb-4" />;
      case 'Databases & Tools':
        return <Monitor className="w-7 h-7 text-neon-cyan mb-4" />;
      case 'DevOps':
        return <Zap className="w-7 h-7 text-neon-pink mb-4" />;
      default:
        return <Terminal className="w-7 h-7 text-neon-purple mb-4" />;
    }
  };

  return (
    <SectionWrapper ref={sectionRef} id="skills" title="Skills" terminalCommand="ls -l $skills">
      {technicalCategories.length > 0 ? (
        <>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technicalCategories.map((category, index) => (
              <GlassCard key={index} className="flex flex-col justify-between">
                <div>
                  <div className="p-3 w-fit rounded-xl bg-slate-800/40 border border-white/5 mb-4">
                    {getCategoryIcon(category)}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">{category}</h3>
                  <ul className="space-y-2.5 text-text-primary">
                    {Object.keys(technicalSkills[category] || {}).map((skillName, i) => (
                      <li key={i} className="flex items-center text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
                        <span className="text-neon-cyan mr-2.5 font-mono text-xs">{'>'}</span>
                        <span>{skillName}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            ))}
          </motion.div>

          {softSkills.length > 0 && (
            <motion.div variants={staggerContainer} className="mt-8 grid grid-cols-1 max-w-md mx-auto">
              <GlassCard className="text-center">
                <div className="p-3 w-fit rounded-xl bg-neon-pink/10 border border-neon-pink/20 mb-4 mx-auto">
                  <Zap className="w-7 h-7 text-neon-pink" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-4">Soft Skills</h3>
                <ul className="space-y-2 text-text-primary inline-block text-left">
                  {softSkills.map((skill, i) => (
                    <li key={i} className="flex items-center text-sm font-medium text-text-secondary">
                      <span className="text-neon-pink mr-2.5 font-mono text-xs">⚡</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
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
