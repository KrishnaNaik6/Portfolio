// import './Experience.css'
import { Briefcase } from 'lucide-react';

import { motion } from 'framer-motion';
import { staggerContainer, itemVariants } from '../../../data/Data';
import GlassCard from '../../Cards/GlassCard';

const Experience = ({ expData }) => {
    return (

        <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-8 max-w-3xl mx-auto">
            {expData.map((exp, i) => (
                <GlassCard key={i} className="p-8">
                    <Briefcase className="w-8 h-8 text-neon-cyan mb-4" />
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-2xl font-bold text-text-primary">{exp.role}</h3>
                            <p className="text-xl text-neon-pink">{exp.company}</p>
                        </div>
                        <p className="text-sm font-mono text-text-secondary mt-1">{exp.tenure_period}</p>
                    </div>
                    <ul className="list-disc list-outside space-y-3 pl-5 text-text-primary">
                        {exp.works.map((point, index) => (
                            <motion.li key={index} variants={itemVariants} className="text-base leading-relaxed">
                                {point}
                            </motion.li>
                        ))}
                    </ul>
                </GlassCard>
            ))}
        </motion.div>

    )
}

export default Experience;
