// import './Footer.css'
const Footer = () => {
    const year = new Date()
    const date = `${year.toLocaleString('en-US', { month: 'long' })} ${year.getDate()}, - ${year.getFullYear()}`
    return (
        <footer className="py-8 border-t border-border-color/50 text-center text-sm text-text-secondary font-inter mt-12">
            <div className="max-w-7xl mx-auto px-6">
                <p>&copy; {new Date().getFullYear()} Krishna Naik. All rights reserved.</p>
                <p className="mt-1">Designed & Developed with <span className="text-neon-cyan">React + vite</span> and <span className="text-neon-purple">Tailwind CSS</span>.</p>
            </div>
        </footer>
    )
}

export default Footer;