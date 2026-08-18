'use client';

import React, { useEffect, useState } from 'react';
import TypingText from '../ui/TypingText';

interface WelcomeProps {
  onComplete: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onComplete }) => {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    if (complete) {
      onComplete();
    }
  }, [complete, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center bg-transparent py-10 px-4 min-h-[30vh] text-center">
      <h1
        className="
          text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold 
          bg-gradient-to-r from-[#dd750e] via-[#d5c2bd] to-[#6fe3e3]
          text-transparent bg-clip-text
          tracking-tight select-none leading-tight max-w-5xl mx-auto
        "
      >
        <TypingText speed={45} onComplete={() => setComplete(true)}>
          Hey there!! Welcome to my Portfolio
        </TypingText>
      </h1>
    </div>
  );
};

export default Welcome;
