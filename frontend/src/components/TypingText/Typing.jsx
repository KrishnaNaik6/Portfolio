import React, { useState, useEffect } from 'react';

const TypingText = ({ text, speed = 100 }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        setDisplayedText(text[currentIndex])

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text[currentIndex]);
            currentIndex++;

            if (currentIndex === text.length-1) {
                clearInterval(intervalId);
            }
        }, speed);

        return () => clearInterval(intervalId); // Cleanup
    }, [text, speed]);

    return (
        <div style={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
            {displayedText}
            <span className="blinking-cursor">|</span>
        </div>
    );
};

export default TypingText;
