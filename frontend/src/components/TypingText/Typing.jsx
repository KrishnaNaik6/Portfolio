// import React, { useState, useEffect } from 'react';

// const TypingText = ({ text, speed = 50 }) => {
//     const [displayedText, setDisplayedText] = useState('');

//     useEffect(() => {
//         let currentIndex = 0;
//         setDisplayedText(text[currentIndex])

//         const intervalId = setInterval(() => {
//             setDisplayedText((prev) => prev + text[currentIndex]);
//             currentIndex++;

//             if (currentIndex === text.length-1) {
//                 clearInterval(intervalId);
//             }
//         }, speed);

//         return () => clearInterval(intervalId); // Cleanup
//     }, [text, speed]);

//     return (
//         <>
//             {displayedText}
//             <span className="blinking-cursor">|</span>
//         </>
//     );
// };

// export default TypingText;


import React, { useEffect, useState } from "react";

const TypingText = ({ children, speed = 50, Oncomplete }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [complete, setComplete] = useState(false)

    useEffect(() => {

        const text = children.toString(); // convert children into string
        let currentIndex = 0;
        setDisplayedText(text[currentIndex])

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => prev + text[currentIndex]);
            currentIndex++;

            if (currentIndex === text.length - 1) {
                clearInterval(intervalId);
                setComplete(true)
                Oncomplete()
            }
        }, speed);

        return () => clearInterval(intervalId); // Cleanup
    }, [children, speed]);

    return (
        <>
            {displayedText}
            {
                complete ? '' : <span className="blinking-cursor">|</span>
            }
        </>
    );

    //   return <span>{displayedText}</span>;
};

export default TypingText;
