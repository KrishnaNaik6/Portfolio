import React, { useEffect, useState } from "react";

const TypingText = ({ children, speed = 50, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [complete, setComplete] = useState(false);

    useEffect(() => {
        const text = children.toString();
        
        if (currentIndex < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);

            return () => clearTimeout(timeoutId);
        } else if (!complete) {
            setComplete(true);
            if (onComplete) onComplete();
        }
    }, [currentIndex, children, speed, complete, onComplete]);

    return (
        <>
            {displayedText}
            {!complete && <span className="blinking-cursor">|</span>}
        </>
    );
};

export default TypingText;