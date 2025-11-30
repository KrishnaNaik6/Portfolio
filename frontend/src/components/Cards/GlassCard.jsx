import { motion } from 'framer-motion';
import { itemVariants } from '../../data/Data';


const GlassCard = ({ children, className = '' }) => (
  <motion.div
    variants={itemVariants}
    className={`
      bg-card-bg backdrop-blur-md rounded-xl p-6
      border border-glass
      shadow-lg shadow-inner-dark hover:shadow-neon-cyan/30 hover:scale-[1.01]
      transition-all duration-500
      ${className}
    `}
  >
    {/* Inner highlight for realism */}
    <div style={{ translateZ: 50 }} className="absolute inset-0 rounded-xl pointer-events-none shadow-inner-light" />
    {children}
  </motion.div>
);

export default GlassCard;