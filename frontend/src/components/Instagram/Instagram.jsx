import React, { useEffect, useState } from "react";

const Instagram = () => {
    const followers = 300;  // target followers
    const following = 350;  // target following

    const [count, setCount] = useState(followers - 100);
    const [count2, setCount2] = useState(following - 100);

    // Animate followers
    useEffect(() => {
        if (count < followers) {
            const interval = setInterval(() => {
                setCount(prev => {
                    if (prev < followers) return prev + 1;
                    clearInterval(interval);
                    return prev;
                });
            }, 20); // adjust speed
            return () => clearInterval(interval);
        }
    }, [count, followers]);

    // Animate following
    useEffect(() => {
        if (count2 < following) {
            const interval = setInterval(() => {
                setCount2(prev => {
                    if (prev < following) return prev + 1;
                    clearInterval(interval);
                    return prev;
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [count2, following]);

    return (
        <div className="insta"  >
            <p>Followers: {count}</p>
            <p>Following: {count2}</p>
        </div>
    );
};

export default Instagram;
