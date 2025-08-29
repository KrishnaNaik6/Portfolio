import TypingText from '../../TypingText/Typing';
import './Welcome.css'

const Welcome = () => {
    return (
        <div className='welcome'>
            <TypingText text="Hey there!! Welcome to my Portfolio" speed={120}/>
        </div>
    )
}

export default Welcome;