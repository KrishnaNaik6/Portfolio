import { useLayoutEffect, useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';

const App = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [completed, setCompleted] = useState(false);

  useLayoutEffect(() => {
    if (!completed) return;

    const sectionIds = [
      'about',
      'education',
      'experience',
      'projects',
      'skills',
      'interest',
      'git-stats',
      'contact',
    ];

    const startObserver = () => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

          if (visible.length > 0) {
            setActiveSection(visible[0].target.id);
          }
        },
        {
          threshold: [0.25, 0.5, 0.75],
          rootMargin: '-20% 0px -40% 0px',
        }
      );

      sectionIds
        .map(id => document.getElementById(id))
        .filter(Boolean)
        .forEach(section => observer.observe(section));

      return observer;
    };

    // ✅ If sections already exist, start immediately
    if (sectionIds.every(id => document.getElementById(id))) {
      const observer = startObserver();
      return () => observer.disconnect();
    }

    // 🟡 Otherwise wait until they appear
    const domObserver = new MutationObserver(() => {
      if (sectionIds.every(id => document.getElementById(id))) {
        const observer = startObserver();
        domObserver.disconnect();
      }
    });

    domObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => domObserver.disconnect();
  }, [completed]);


  return (
    <div className="bg-bg-main min-h-screen transition-colors duration-500">
      <Header activeSection={activeSection} />
      <Hero completed={() => setCompleted(true)} />
    </div>
  );
};

export default App;
