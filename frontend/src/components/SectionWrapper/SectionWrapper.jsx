import React, {useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeIn, staggerContainer } from '../../data/Data';

const SectionWrapper = ({ id, title, terminalCommand, children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id={id.toLowerCase()} className="py-5 md:py-24 relative z-10" ref={ref}>
      <motion.div
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeIn}
        className="max-w-7xl mx-auto px-6 lg:px-8"
      >
        {/* Terminal Header */}
        <h2 className="text-xl md:text-2xl font-mono mb-8 group">
          <span className="text-neon-cyan">~KrishnaNaik6</span>
          <span className="text-gray-400 group-hover:text-neon-pink transition-colors duration-300">{' > '}</span>
          <span className="text-neon-pink group-hover:text-neon-cyan transition-colors duration-300">{terminalCommand}</span>
          <div className="w-full h-px bg-neon-cyan/50 mt-1" />
        </h2>

        {/* Content */}
        <motion.div
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={staggerContainer}
          className="mt-12"
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SectionWrapper;