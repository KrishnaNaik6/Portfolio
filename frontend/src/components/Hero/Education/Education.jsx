import { useEffect, useState } from "react";
import { Octokit } from "@octokit/core";
// import './Education.css'

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { staggerContainer } from "../../../data/Data";
import GlassCard from "../../Cards/GlassCard";

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN
});

const Education = ({ eduData }) => {
    const [educationData, setEducationData] = useState([]);
    // const [loading, setLoading] = useState(true)

    useEffect(() => {
        setEducationData(eduData)
    }, []);

    return (
        <div className="educations">
            {
                console.log("education data", educationData)
            }
            {
                    <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {eduData.map((edu) => (
                            <GlassCard key={edu.id} className="flex flex-col">
                                <GraduationCap className="w-8 h-8 text-neon-pink mb-4" />
                                <h3 className="text-xl font-bold text-text-primary mb-1">{edu.edu}</h3>
                                <p className="text-lg text-neon-cyan mb-2">{edu.college}</p>
                                <p className="text-sm text-text-secondary font-mono italic mb-4">{edu.status}{edu.year && `-${edu.year}`}</p>
                            </GlassCard>
                        ))}
                    </motion.div>
            }
        </div>
    );
};

export default Education;