'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Monitor, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import AnchorLink from '../ui/AnchorLink';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Interest', id: 'interest' },
    { name: 'Git Stats', id: 'git-stats' },
    { name: 'Contact', id: 'contact' },
  ];

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else if (theme === 'light') setTheme('system');
    else setTheme('dark');
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor size={14} className="text-neon-cyan" />;
    if (resolvedTheme === 'dark') return <Moon size={14} className="text-neon-indigo" />;
    return <Sun size={14} className="text-neon-rose" />;
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-4 left-0 right-0 z-50 px-4 max-w-7xl mx-auto pointer-events-none"
      >
        <div className="pointer-events-auto backdrop-blur-2xl bg-card-bg border border-white/10 dark:border-white/10 rounded-full px-5 py-2.5 shadow-2xl flex justify-between items-center transition-all duration-300">
          {/* Editorial Logo Tag */}
          <AnchorLink
            to="about"
            className="text-xl md:text-2xl font-extrabold font-sora tracking-widest flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-full bg-neon-indigo/15 border border-neon-indigo/30 flex items-center justify-center text-neon-indigo group-hover:scale-110 transition-transform">
              <Sparkles size={15} />
            </div>
            <span className="text-text-primary group-hover:text-neon-indigo transition-colors font-sora">
              <span className="text-xs font-mono text-neon-indigo mr-1.5 font-normal">01 /</span>KRISHNA
            </span>
          </AnchorLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/20 dark:bg-slate-950/40 rounded-full p-1.5 border border-white/5 shadow-inner">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <AnchorLink key={item.id} to={item.id}>
                  <div className="relative px-3.5 py-1.5 text-xs font-mono tracking-wider cursor-pointer rounded-full transition-colors">
                    <span
                      className={`relative z-10 transition-colors duration-300 ${
                        isActive
                          ? 'text-neon-indigo font-bold'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Animated Capsule Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-neon-indigo/15 border border-neon-indigo/30 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </div>
                </AnchorLink>
              );
            })}
          </nav>

          {/* Controls: Clock + Theme Switcher + Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            {mounted && currentTime && (
              <div className="hidden sm:flex items-center text-xs font-mono text-text-secondary bg-slate-950/20 dark:bg-slate-950/40 px-3.5 py-1.5 rounded-full border border-white/5">
                <span className="text-neon-indigo mr-1.5 font-bold">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                </span>
              </div>
            )}

            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={cycleTheme}
                aria-label={`Current theme: ${theme}. Click to switch theme.`}
                title={`Theme: ${theme?.toUpperCase()}`}
                className="p-2 rounded-full text-text-primary hover:text-neon-indigo transition-all bg-slate-950/20 dark:bg-slate-950/40 border border-white/10 hover:border-neon-indigo/40 focus-visible:ring-2 focus-visible:ring-neon-indigo flex items-center gap-1.5 px-3"
              >
                <motion.div key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
                  {getThemeIcon()}
                </motion.div>
                <span className="text-[10px] font-mono uppercase text-text-secondary hidden md:inline">
                  {theme}
                </span>
              </button>
            )}

            <button
              className="lg:hidden p-2 rounded-full text-text-primary hover:text-neon-indigo bg-slate-950/20 dark:bg-slate-950/40 border border-white/10 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Cybernetic Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 lg:hidden p-6 backdrop-blur-2xl bg-card-bg/95 border border-white/10 rounded-3xl shadow-2xl max-w-md mx-auto"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <AnchorLink
                  key={item.id}
                  to={item.id}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-mono tracking-wider p-3 rounded-2xl transition-all flex items-center justify-between ${
                    activeSection === item.id
                      ? 'bg-neon-indigo/15 text-neon-indigo font-bold border border-neon-indigo/30'
                      : 'text-text-primary hover:text-neon-indigo hover:bg-slate-900/40'
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-xs text-text-secondary font-mono">/0{navItems.indexOf(item) + 1}</span>
                </AnchorLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
