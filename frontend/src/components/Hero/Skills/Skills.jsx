import React from "react";
// import './Skills.css'
import { motion } from 'framer-motion';
import { Code, Zap, Monitor } from 'lucide-react';
import { staggerContainer } from "../../../data/Data";
import GlassCard from "../../Cards/GlassCard";
const Skills = ({ skillData }) => {

    const technicalSkills = skillData.Technical;
    const softSkills = skillData['Soft Skills'] || [];
    const technicalCategories = Object.keys(technicalSkills);

    // Helper to determine the icon for the category (using Lucide)
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Programming & Development':
                return <Code className="w-8 h-8 text-neon-purple mb-4" />;
            case 'Databases & Tools':
                return <Monitor className="w-8 h-8 text-neon-cyan mb-4" />;
            case 'DevOps':
                return <Zap className="w-8 h-8 text-neon-pink mb-4" />;
            default:
                return <Code className="w-8 h-8 text-neon-purple mb-4" />;
        }
    };

    return (
        <>
            {/* Technical Skills: Render the three main categories */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {technicalCategories.map((category, index) => (
                    <GlassCard key={index}>
                        {getCategoryIcon(category)}
                        <h3 className="text-xl font-bold text-text-primary mb-4">{category}</h3>
                        <ul className="space-y-2 text-text-primary">
                            {Object.keys(technicalSkills[category]).map((skillName, i) => (
                                <li key={i} className="flex items-center text-sm">
                                    <span className="text-neon-cyan mr-2 font-mono">{'>'}</span> {skillName}
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                ))}
            </motion.div>

            {/* Soft Skills Card spans one column, centered */}
            <motion.div variants={staggerContainer} className="mt-8 grid grid-cols-1 max-w-sm mx-auto">
                <GlassCard>
                    <Zap className="w-8 h-8 text-neon-pink mb-4" />
                    <h3 className="text-xl font-bold text-text-primary mb-4">Soft Skills</h3>
                    <ul className="space-y-2 text-text-primary">
                        {softSkills.map((skill, i) => (
                            <li key={i} className="flex items-center text-sm">
                                <span className="text-neon-cyan mr-2 font-mono">{'>'}</span> {skill}
                            </li>
                        ))}
                    </ul>
                </GlassCard>
            </motion.div>
        </>
    );
};

export default Skills;
