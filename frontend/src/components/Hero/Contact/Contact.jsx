import './Contact.css'
import { Phone, Instagram, Linkedin, Mail, MessageCircle } from 'lucide-react'

const Contact = ({ contact }) => {
    console.log("Contact details", contact)

    return (
        <div className='contacts'>
            <div className='contact'>
                <p>Drop a message</p>

                {/* Direct message section */}
                <div>
                    <h4>Reach me anytime</h4>
                    {Object.entries(contact.msg).map(([key, value]) => {
                        if (key === "Phone") {
                            return (
                                <div key={key}>
                                    <a href={`https://wa.me/91${value}`} target="_blank" rel="noreferrer">
                                        <MessageCircle color="green" /> Say hello
                                    </a>
                                    <a href={`tel:+91${value}`}>
                                        <Phone color="orange" /> Let's Talk
                                    </a>
                                </div>
                            )
                        }
                        if (key === "Mail") {
                            return (
                                <div key={key}>
                                    <a href={`mailto:${value}`}>
                                        <Mail color="red" /> {value}
                                    </a>
                                </div>
                            )
                        }
                        return null
                    })}
                </div>

                <div>
                    <h4>Follow me on</h4>
                    {/* Socials section */}
                    {Object.entries(contact.follow).map(([key, value]) => {
                        if (key === "Instagram") {
                            return (
                                <div key={key}>
                                    <a href={value} target="_blank" rel="noreferrer">
                                        <Instagram color="#E1306C" />
                                    </a>
                                </div>
                            )
                        }
                        if (key === "Linkedin") {
                            return (
                                <div key={key}>
                                    <a href={`https://${value}`} target="_blank" rel="noreferrer">
                                        <Linkedin color="#0077B5" />
                                    </a>
                                </div>
                            )
                        }
                        return null
                    })}
                </div>

            </div>
            <p className='pstyle' style={{alignSelf:"center"}}>I usually reply within 24–48 hours</p>
        </div>
    )
}

export default Contact
