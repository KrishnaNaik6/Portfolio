import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import AnchorLink from '../AnchorLink/AnchorLink';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Theme State: 'dark' or 'light'
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for Active Section Highlighting
  const sections = ['home', 'about', 'education', 'experience', 'projects', 'skills', 'contact'];
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -40% 0px', threshold: 0.3 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const navItems = [
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'Experience', id: 'experience' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
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
          <AnchorLink to="home" className="text-3xl font-extrabold font-sor text-text-primary tracking-widest">
            <span className="text-neon-cyan">K</span>RISHNA
          </AnchorLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 bg-card-bg backdrop-blur-sm rounded-full p-2 border border-glass shadow-xl">
            {navItems.map((item) => (
              <AnchorLink
                key={item.id}
                to={item.id}
                className={`
                  relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full
                  ${activeSection === item.id ? 'text-bg-main' : 'text-text-secondary hover:text-text-primary'}
                `}
              >
                {activeSection === item.id && (
                  <motion.div
                    layoutId="underline"
                    className="absolute inset-0 bg-neon-cyan rounded-full z-0 shadow-neon-cyan"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </AnchorLink>
            ))}
          </div>

          {/* Clock and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm font-mono text-text-secondary">
              <span className="text-neon-cyan mr-1">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }).slice(0, 5)}
              </span>
              <span className="text-neon-pink">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }).slice(5, 7)}
              </span>
            </div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-text-primary hover:text-neon-cyan transition-colors duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </button>
            
            <button
              className="lg:hidden text-text-primary hover:text-neon-cyan"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                <AnchorLink key={item.id} to={item.id} onClick={() => setIsOpen(false)} className="text-lg font-medium text-text-primary hover:text-neon-cyan p-2 rounded-lg">
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