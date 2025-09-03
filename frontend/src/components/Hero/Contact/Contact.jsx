import './Contact.css'
import { Phone, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react'

const Contact = ({ contact }) => {
    console.log("Contact details", contact)

    return (
        <div className='contacts'>
            {/* <div className='contact'>
                <p>Drop a message</p>
                {contact.map((c, i) => {
                    c == 'Phone' ? <>
                        <a href="https://wa.me/919353640765"><MessageCircle />Say hello</a>
                        <a href="tel:+91 9353640765"><Phone />Say hello</a>
                    </>
                        : ''

                })}
            </div> */}

        </div>
    )
}

export default Contact;