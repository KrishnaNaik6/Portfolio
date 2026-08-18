'use client';

import React, { useEffect, useState } from 'react';

const Footer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const year = new Date().getFullYear();

  useEffect(() => {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    setCurrentDate(dateString);
  }, []);

  return (
    <footer id="footer" className="py-12 border-t border-white/5 text-center font-inter mt-16 bg-bg-main">
      <div className="max-w-7xl mx-auto px-6 space-y-3">
        {/* Line 1: Copyright and Live Date */}
        <p className="text-xs uppercase tracking-widest text-text-secondary font-mono">
          © {year} <span className="text-text-primary font-semibold">Krishna Naik</span>{' '}
          <span className="mx-3 text-slate-700">//</span>{' '}
          <span className="text-neon-cyan">{currentDate}</span>
        </p>

        {/* Line 2: Tech Stack Credits */}
        <p className="text-[11px] text-text-secondary uppercase tracking-[0.15em]">
          Built with <span className="text-neon-cyan font-medium">Next.js 15 + React</span>{' '}
          <span className="mx-2 text-slate-700">&</span>{' '}
          <span className="text-neon-purple font-medium">Tailwind CSS</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
