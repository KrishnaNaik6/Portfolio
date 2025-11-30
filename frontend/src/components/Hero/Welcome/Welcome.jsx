import { useEffect, useState } from 'react';
import TypingText from '../../TypingText/Typing';

const Welcome = ({ show }) => {
  const [complete, setComplete] = useState(false);

  const completed = () => {
    setComplete(true);
  };

  useEffect(() => {
    if (complete) {
      show();
    }
  }, [complete, show]);

  return (
    <div className="flex flex-col content-center items-center justify-center bg-transparent">
      <h1
        className="
          text-4xl sm:text-9xl md:text-10xl font-bold 
          bg-linear-to-r from-[#ff7575] via-[#d5c2bd] to-[#6fe3e3]
          text-transparent bg-clip-text
          text-center select-none
        "
      >
        <TypingText speed={52} onComplete={completed}>
          Hey there!! Welcome to my Portfolio
        </TypingText>
      </h1>
    </div>
  );
};

export default Welcome;
