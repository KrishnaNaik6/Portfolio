'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Code2, Sparkles, Terminal } from 'lucide-react';

interface HeroPortraitProps {
  avatarUrl?: string | null;
  fullName?: string;
  className?: string;
}

export const HeroPortrait: React.FC<HeroPortraitProps> = ({
  avatarUrl,
  fullName = 'Krishna Naik',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const validAvatar = avatarUrl?.trim() || null;

  const shortName = React.useMemo(() => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 2) {
      return `${parts[0]} ${parts[parts.length - 1]}`;
    }
    return fullName;
  }, [fullName]);

  // Reset state dynamically whenever avatarUrl changes (e.g. fresh CMS publishing)
  useEffect(() => {
    setImgError(false);
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setImgLoaded(true);
      } else {
        setImgError(true);
      }
    } else {
      setImgLoaded(false);
    }
  }, [validAvatar]);

  const altText = fullName
    ? `${fullName} – Full-Stack Developer & AI Engineer Profile Portrait`
    : 'Krishna Naik – Full-Stack Developer & AI Specialist';

  // Ambient entrance animation configuration
  const animateVariants = {
    opacity: 1,
    scale: 1,
    y: 0,
  };

  const transitionConfig = {
    duration: 0.7,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Motion Wrapper: Handles entrance and hover lift smoothly */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={animateVariants}
        transition={transitionConfig}
        whileHover={shouldReduceMotion ? undefined : { y: -4, transition: { duration: 0.3 } }}
        className="relative group w-[250px] xs:w-[280px] sm:w-[320px] md:w-[340px] lg:w-[360px] xl:w-[400px] 2xl:w-[420px] max-w-[calc(100vw-2.5rem)] aspect-[4/5] transform-gpu [backface-visibility:hidden]"
      >
        {/* Floating Chassis Wrapper: Off-thread GPU compositor floating (zero-lag on HUD text) */}
        <div className="relative w-full h-full animate-portrait-float transform-gpu [backface-visibility:hidden] [transform-style:preserve-3d]">
          {/* Layer 1: Ambient Multi-Color Gradient Glow */}
          <div
            aria-hidden="true"
            className="absolute -inset-2 sm:-inset-4 bg-gradient-to-tr from-neon-indigo/35 via-neon-cyan/20 to-neon-purple/25 rounded-[36px] sm:rounded-[44px] blur-2xl sm:blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none -z-10 transform-gpu [backface-visibility:hidden]"
          />

          {/* Layer 2: Subtle Technical Corner Guide Marks */}
          <div
            aria-hidden="true"
            className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-neon-indigo/60 rounded-tl-sm pointer-events-none z-30 opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <div
            aria-hidden="true"
            className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-neon-cyan/60 rounded-tr-sm pointer-events-none z-30 opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-neon-cyan/60 rounded-bl-sm pointer-events-none z-30 opacity-70 group-hover:opacity-100 transition-opacity"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-neon-indigo/60 rounded-br-sm pointer-events-none z-30 opacity-70 group-hover:opacity-100 transition-opacity"
          />

          {/* Layer 3: Layered Glass Bezel Chassis (Crisp dark backing without expensive backdrop-filter repaints) */}
          <div className="relative w-full h-full rounded-[24px] sm:rounded-[34px] p-2 sm:p-2.5 bg-slate-900/90 dark:bg-slate-900/90 border border-neon-indigo/30 group-hover:border-neon-indigo/60 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(47,129,247,0.15)] transition-all duration-500 flex flex-col transform-gpu [backface-visibility:hidden]">
            {/* Layer 4: Inner Portrait Screen Viewport */}
            <div className="relative w-full h-full rounded-[18px] sm:rounded-[28px] overflow-hidden bg-slate-950 flex items-center justify-center transform-gpu [backface-visibility:hidden]">
              {/* Top Micro Tech HUD Badges: Locked zero-lag composite layer */}
              <div className="absolute top-2.5 left-2.5 right-2.5 sm:top-3 sm:left-3 sm:right-3 flex items-center justify-between gap-1.5 z-20 pointer-events-none transform-gpu [backface-visibility:hidden]">
                <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-950/90 border border-white/10 text-[8px] xs:text-[8.5px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest text-text-secondary uppercase shadow-sm shrink-0">
                  <Terminal size={10} className="text-neon-cyan shrink-0 sm:w-3 sm:h-3" />
                  <span className="hidden xs:inline">AI_ENGINEER</span>
                  <span className="xs:hidden">AI_ENG</span>
                </span>

                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-slate-950/90 border border-neon-indigo/40 text-[7.5px] xs:text-[8px] sm:text-[9px] font-mono tracking-wider sm:tracking-widest text-neon-indigo uppercase font-bold shadow-sm shrink-0">
                  <span className="hidden xs:inline">SYS_VERIFIED</span>
                  <span className="xs:hidden">VERIFIED</span>
                </span>
              </div>

              {/* Shimmer Skeleton Placeholder while loading */}
              {!imgLoaded && !imgError && validAvatar && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 bg-slate-900/90 pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  <div className="flex flex-col items-center gap-3 text-text-secondary/50">
                    <div className="w-10 h-10 border-2 border-neon-indigo/20 border-t-neon-indigo rounded-full animate-spin" />
                    <span className="text-[10px] font-mono tracking-widest uppercase">
                      Loading_Visual...
                    </span>
                  </div>
                </div>
              )}

              {/* Profile Image Render */}
              {validAvatar && !imgError ? (
                <img
                  ref={(node) => {
                    imgRef.current = node;
                    if (node && node.complete && !imgLoaded) {
                      if (node.naturalWidth > 0) {
                        setImgLoaded(true);
                      } else if (node.naturalWidth === 0 && node.src) {
                        setImgError(true);
                      }
                    }
                  }}
                  src={validAvatar}
                  alt={altText}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  width={420}
                  height={525}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => {
                    console.warn('[HeroPortrait] Failed to load avatar image:', validAvatar);
                    setImgError(true);
                  }}
                  className="w-full h-full object-cover object-[center_16%] transition-transform duration-700 select-none group-hover:scale-[1.02] transform-gpu [backface-visibility:hidden]"
                />
              ) : (
                /* Fallback Placeholder Presentation (if avatarUrl is null, empty, or fails) */
                <div
                  data-testid="hero-portrait-fallback"
                  className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden"
                >
                  {/* Subtle Geometric Background Watermark */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
                  >
                    <Code2 size={240} className="text-neon-indigo" />
                  </div>

                  {/* Monogram Badge */}
                  <div className="relative mb-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-neon-indigo/20 via-neon-cyan/15 to-neon-purple/20 border border-neon-indigo/40 flex items-center justify-center shadow-[0_0_25px_rgba(47,129,247,0.25)]">
                      <span className="text-2xl sm:text-3xl font-black font-sora bg-gradient-to-r from-neon-indigo via-text-primary to-neon-cyan text-transparent bg-clip-text">
                        {fullName
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase() || 'KN'}
                      </span>
                    </div>
                    <Sparkles
                      size={16}
                      className="absolute -top-1 -right-1 text-neon-cyan animate-pulse"
                    />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-sora text-text-primary tracking-tight mb-1">
                    {fullName}
                  </h3>
                  <p className="text-[11px] font-mono text-neon-indigo tracking-wider uppercase mb-2">
                    Full-Stack &amp; AI Engineer
                  </p>
                  <p className="text-[10px] text-text-secondary max-w-[180px] leading-relaxed font-mono">
                    Autonomous systems, ML models &amp; scalable web platforms.
                  </p>
                </div>
              )}

              {/* Inner Vignette / Rim Highlight */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[20px] sm:rounded-[28px] ring-1 ring-inset ring-white/10 pointer-events-none z-20"
              />

              {/* Bottom Status / Entity HUD Pill: Locked zero-lag composite layer */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 z-20 flex items-center justify-between gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-950/90 border border-white/10 shadow-lg pointer-events-none transform-gpu [backface-visibility:hidden]">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span
                    title={fullName}
                    className="text-[9.5px] xs:text-[10.5px] sm:text-xs font-mono font-medium text-text-primary truncate min-w-0"
                  >
                    <span className="hidden sm:inline">{fullName}</span>
                    <span className="sm:hidden">{shortName}</span>
                  </span>
                </div>
                <span className="text-[8.5px] xs:text-[9px] sm:text-[10px] font-mono tracking-wider sm:tracking-widest text-neon-cyan font-semibold shrink-0 pl-1">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroPortrait;
