import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import AnchorLink from '../AnchorLink/AnchorLink';

const Header = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
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

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 backdrop-blur-md bg-bg-main/90 shadow-lg border-b border-border-color/50"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center h-16">
          <AnchorLink
            to="home"
            className="text-3xl font-extrabold font-sor text-text-primary tracking-widest"
          >
            <span className="text-neon-cyan">K</span>RISHNA
          </AnchorLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 bg-card-bg backdrop-blur-sm rounded-full p-2 border border-glass shadow-xl">
            {navItems.map((item) => (
              <AnchorLink key={item.id} to={item.id}>
                {/* REAL positioning container */}
                <div className="relative px-4 py-1.5 text-sm font-medium cursor-pointer">
                  {/* Text */}
                  <span
                    className={`relative z-10 transition-colors duration-300 ${activeSection === item.id
                      ? 'text-text-primary'
                      : 'text-text-secondary hover:text-text-primary'
                      }`}
                  >
                    {item.name}
                  </span>

                  {/* Underline */}
                  <span
                    className={`absolute left-0 -bottom-1 h-[2px] w-full bg-blue-500
                    transform transition-transform duration-300 ease-out origin-left
                    ${activeSection === item.id
                        ? 'scale-x-100'
                        : 'scale-x-0'
                      }`}
                  />
                </div>
              </AnchorLink>
            ))}
          </div>

          {/* Clock + Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-mono text-text-secondary">
              <span className="text-neon-cyan mr-1">
                {currentTime
                  .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })
                  .slice(0, 5)}
              </span>
              <span className="text-neon-pink">
                {currentTime
                  .toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    hour12: true,
                  })
                  .slice(5, 7)}
              </span>
            </div>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-text-primary hover:text-neon-cyan transition-colors duration-300"
            >
              {theme === 'dark' ? <Moon /> : <Sun />}
            </button>

            <button
              className="lg:hidden text-text-primary hover:text-neon-cyan"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden p-4 bg-bg-main/95 backdrop-blur-lg shadow-xl"
          >
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <AnchorLink
                  key={item.id}
                  to={item.id}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium text-text-primary hover:text-neon-cyan p-2 rounded-lg"
                >
                  {item.name}
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
