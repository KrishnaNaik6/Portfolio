import React, { useEffect, useState, useRef } from "react";

const TypingText = ({ children, speed = 40, onComplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        const text = typeof children === "string" ? children : String(children);
        setDisplayedText("");
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
            {displayedText}
            {!isComplete && <span className="blinking-cursor">|</span>}
        </>
    );
};

export default TypingText;