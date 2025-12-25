// import './Interest.css'
import { itemVariants } from '../../../data/Data'
import GlassCard from '../../Cards/GlassCard'
import { motion } from 'framer-motion';

const Interest = ({ Interest }) => {

    console.log("Interestss", Interest)
    return (
        <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-neon-cyan mb-6">What Drives Me</h3>
            <ul className="list-disc list-outside space-y-4 pl-5 text-lg text-text-primary">
                {Interest.map((item, index) => (
                    <motion.li key={index} variants={itemVariants} className="leading-relaxed">
                        {item}
                    </motion.li>
                ))}
            </ul>
        </GlassCard>
    )
}

export default Interest;