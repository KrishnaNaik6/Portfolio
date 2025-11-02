import React, { useEffect, useState } from "react";
import './Clock.css'


const Clock = () => {
    const [Hour, setHour] = useState('00');
    const [Minute, setMinute] = useState('00');
    const [Second, setSecond] = useState('00');
    const [Hr, setHr] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            var now = new Date();
            setHr(now.getHours())
            setHour(String(now.getHours() % 12 || 12).padStart('2', 0));
            setMinute(String(now.getMinutes()).padStart('2', 0));
            setSecond(String(now.getSeconds()).padStart('2', 0));
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div id="clock" className="clock">
            <p className="time">{Hour}</p>:<p className="time">{Minute}</p>:<p className="time">{Second}</p>&nbsp;<p className="time">{Hr >= 12 ? 'PM' : 'AM'}</p>
        </div>
    )
}

export default Clock;