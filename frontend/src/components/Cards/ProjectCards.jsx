import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Monitor } from 'lucide-react';
import { itemVariants } from '../../data/Data';

const ProjectCard = ({ project }) => {
  console.log("project details--------------", project)
  const ref = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxChars = 50;

  // FIX: Safely access description, defaulting to a placeholder string if null/undefined/empty
  const safeDescription = project.description || 'No description provided.';

  const needsTruncation = safeDescription.length > maxChars;

  const displayDescription = isExpanded || !needsTruncation
    ? safeDescription
    : safeDescription.substring(0, maxChars); // Removed '...' from here, now handled by the button text

  // Mouse position state (0.5 is center)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Initial values for a slight, static tilt (for aesthetic)
  const initialRotateX = -2;
  const initialRotateY = 2;

  // Spring animations for smooth tilt response
  const springConfig = { damping: 20, stiffness: 150, mass: 1 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  // Calculate rotation (mapping mouse position values to degrees, relative to initial tilt)
  const rotateX = useTransform(sy, [0, 1], [8, -8]);
  const rotateY = useTransform(sx, [0, 1], [-15, 15]);

  // Combine static initial tilt with dynamic mouse-driven tilt for the final style application
  const finalRotateX = useTransform(rotateX, (rx) => `calc(${rx}deg + ${initialRotateX}deg)`);
  const finalRotateY = useTransform(rotateY, (ry) => `calc(${ry}deg + ${initialRotateY}deg)`);

  // Handle mouse move event
  const handleMouseMove = (e) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width);
    y.set(mouseY / height);
  };

  // Handle mouse leave event (reset rotation to center of the card, which combines with the initial static tilt)
  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchEnd={handleMouseLeave}
      onTouchCancel={handleMouseLeave}
      // FIX 1 & 2: Use whileHover to elevate Z-index, ensuring it overlaps neighbors.
      whileHover={{ scale: 1.05, z: 100 }}
      // FIX 3: Apply the combined static and dynamic rotation via the style prop
      style={{
        rotateX: finalRotateX,
        rotateY: finalRotateY,
        scale: useTransform(sx, [0, 1], [1, 1.05]), // Scale change remains dynamic
        transformStyle: 'preserve-3d',
      }}
      className="rounded-xl transition-shadow duration-500 will-change-transform perspective-1000 relative z-10"
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        // Inner card content for the visual effects (Added inner shadows)
        className={`
          relative p-8 rounded-xl h-full flex flex-col justify-between
          bg-card-bg backdrop-blur-md border border-glass
          shadow-lg shadow-inner-dark
          group overflow-hidden
        `}
        style={{
          // Apply a subtle Z translation for the lift effect
          translateZ: 50,
        }}
      >
        {/* Neon Border Effect (Simulated Glow) */}
        {/* Note: Tilt effect is applied via Framer Motion transform above */}
        <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-500 group-hover:ring-2 group-hover:ring-neon-purple/80 group-hover:shadow-[0_0_20px_var(--shadow-purple)]" />

        <div className="flex flex-col gap-3">
          <h3 className="text-2xl font-bold text-neon-cyan group-hover:text-neon-pink transition-colors duration-300">
            {project.name}
          </h3>
          <p className="text-sm uppercase text-text-secondary font-medium tracking-wider">{project.type}</p>
          <p className="text-text-primary mt-2">
            {displayDescription}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-neon-cyan hover:text-neon-pink ml-1 text-sm font-semibold transition-colors duration-200 focus:outline-none"
              >
                {isExpanded ? '(Read Less)' : '...'}
              </button>
            )}
            {/* Displaying a default message if the original description was null/empty */}
            {!safeDescription && <span className="text-text-secondary">No description provided.</span>}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          {project.link.live ? (
            <a
              href={project.link.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-neon-purple/20 text-neon-purple hover:bg-neon-purple hover:text-bg-main transition-all duration-300 flex items-center"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Live Website
            </a>
          ) : (
            <button
              disabled
              className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-600/20 text-gray-500 cursor-not-allowed flex items-center"
            >
              <Monitor className="w-4 h-4 mr-2" />
              Not Hosted
            </button>
          )}

          <a
            href={project.link.git}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color text-text-secondary hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 flex items-center"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub Link
          </a>

        </div>

      </motion.div>
    </motion.div>
  );
};

export default ProjectCard;