import { useEffect, useState } from 'react';
import TypingText from '../../TypingText/Typing';
import './Welcome.css'

const Welcome = ({ show }) => {
    const [complete, setComplete] = useState(false)

    const completed = () => {
        setComplete(true)
    }
    
    useEffect(() => {
        if (complete) {
            show();
        }
    }, [complete, show])

    return (
        <div className='welcome' style={{ display: 'block' }}>
            <h1>
                <TypingText speed={52} onComplete={() => completed()}>
                    Hey there!! Welcome to my Portfolio
                </TypingText>
            </h1>
        </div>
    )
}

export default Welcome;