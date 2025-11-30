// import './Contact.css';
import GlassCard from '../../Cards/GlassCard';
import { Phone, Instagram, Linkedin, Mail, Github } from 'lucide-react';

const Contact = ({ contact }) => {
    console.log('Contact details', contact);
    const { msg, follow } = contact;
    const mail = msg.Mail;
    const phone = msg.Phone;
    const linkedin = follow.Linkedin;
    const instagram = follow.Instagram;
    const github = follow.Github || '#';

    return (

        <>
            <p className="text-center text-text-primary text-lg mb-8 italic max-w-xl mx-auto">
                "Don't hesitate to say hello 👋. I enjoy networking and learning from people across the world."
            </p>

            <GlassCard className="p-8 md:p-12 max-w-2xl mx-auto text-center relative overflow-hidden">

                {/* Neon Border Effect (Green/Cyan Glow) */}
                <div className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-500 ring-2 ring-neon-cyan/50 shadow-[0_0_30px_var(--shadow-cyan)]" />

                <h3 className="text-2xl font-extrabold text-neon-cyan mb-6 font-sor border-b border-neon-cyan/50 pb-2 inline-block">
                    Drop a message
                </h3>

                <p className="text-md text-text-primary mb-10">
                    I'm always open to feedback, opportunities, and collaborations in tech, AI, and development. Feel free to drop a message below!
                </p>

                <div className="grid grid-cols-2 text-left gap-y-6">

                    {/* Column 1: Reach me anytime */}
                    <div>
                        <h4 className="text-lg font-bold text-text-primary mb-4">Reach me anytime</h4>
                        <div className="space-y-4">

                            {/* Say hello (Mail Link) */}
                            <a href={`mailto:${mail}`} className="relative z-50 flex items-center group text-text-primary hover:text-neon-cyan transition-colors">
                                <Mail className="w-5 h-5 mr-3 text-neon-cyan group-hover:text-neon-pink" />
                                <span>Say hello</span>
                            </a>

                            {/* Let's Talk (Phone Link) */}
                            <a href={`tel:${phone}`} className="flex items-center group text-text-primary hover:text-neon-cyan transition-colors">
                                <Phone className="w-5 h-5 mr-3 text-neon-cyan group-hover:text-neon-pink" />
                                <span>Let's Talk</span>
                            </a>

                            {/* Email Address (Matching the position and red box icon in the image) */}
                            <div className="flex items-center group text-text-primary pt-2">
                                <Mail className="w-5 h-5 mr-3 text-neon-pink" />
                                <span className="text-base">{mail}</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Follow me on */}
                    <div>
                        <h4 className="text-lg font-bold text-text-primary mb-4">Follow me on</h4>
                        <div className="space-y-4">

                            {/* Instagram */}
                            <a href={instagram} target="_blank" rel="noopener noreferrer" className="flex items-center group text-text-primary hover:text-neon-pink transition-colors">
                                <Instagram className="w-5 h-5 mr-3 text-neon-pink" />
                                <span>Instagram</span>
                            </a>

                            {/* LinkedIn */}
                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center group text-text-primary hover:text-neon-cyan transition-colors">
                                <Linkedin className="w-5 h-5 mr-3 text-neon-cyan" />
                                <span>Linkedin</span>
                            </a>

                            {/* GitHub (Not in image, but standard for dev portfolio - keeping subtle) */}
                            <a href={github} target="_blank" rel="noopener noreferrer" className="flex items-center group text-text-secondary hover:text-neon-cyan transition-colors">
                                <Github className="w-5 h-5 mr-3 text-text-secondary" />
                                <span>GitHub</span>
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-text-secondary mt-12 italic">
                    I usually reply within 24–48 hours
                </p>
            </GlassCard>

            {/* Resume Link (Outside the card, matching the image structure) */}
            <a href="/resume.pdf" target='_blank' className="mt-6 inline-block text-neon-cyan hover:text-neon-pink border-b border-dashed border-transparent hover:border-neon-cyan transition-colors duration-300">
                --- My Resume 🚀 ---
            </a>
        </>

    );
};

export default Contact;
