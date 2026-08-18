'use client';

import React from 'react';

interface AnchorLinkProps {
  to: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const AnchorLink: React.FC<AnchorLinkProps> = ({ to, children, onClick, className = '' }) => (
  <a
    href={`#${to.toLowerCase()}`}
    onClick={(e) => {
      e.preventDefault();
      const target = document.getElementById(to.toLowerCase());
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      if (onClick) onClick();
    }}
    className={`
      transition-all duration-300 ease-out
      hover:text-neon-cyan
      hover:scale-105
      transform
      rounded-md p-1
      ${className}
    `}
  >
    {children}
  </a>
);

export default AnchorLink;
