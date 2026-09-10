'use client';

import React, { useEffect, useState, useRef } from 'react';

interface TypingTextProps {
  children: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingText: React.FC<TypingTextProps> = ({ children, speed = 40, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated without restarting the typing effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const text = typeof children === 'string' ? children : String(children);
    setDisplayedText('');
    setIsComplete(false);

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      currentIndex += 1;
      setDisplayedText(text.slice(0, currentIndex));

      if (currentIndex >= text.length) {
        clearInterval(intervalId);
        setIsComplete(true);
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [children, speed]);

  return (
    <>
      <span data-testid="typing-text">{displayedText}</span>
      {!isComplete && (
        <span
          aria-hidden="true"
          className="inline-block w-1.5 h-8 ml-1 bg-neon-cyan animate-pulse align-middle"
        />
      )}
    </>
  );
};

export default TypingText;
