'use client';

import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  children: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ children, speed = 50, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const text = children.toString();

    if (currentIndex < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeoutId);
    } else if (!complete) {
      setComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, children, speed, complete, onComplete]);

  return (
    <>
      <span>{displayedText}</span>
      {!complete && (
        <span className="inline-block w-1.5 h-8 ml-1 bg-neon-cyan animate-pulse align-middle" />
      )}
    </>
  );
};

export default TypingText;
