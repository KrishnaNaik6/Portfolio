import './Footer.css'
import Instagram from "../Instagram/Instagram";
const Footer = () => {
    const year = new Date()
    const date = `${year.toLocaleString('en-US', { month: 'long' })} ${year.getDate()}, - ${year.getFullYear()}`
    return (
        <div className="footer">
            <footer className="w-full bg-slate-950 text-slate-400">
                <div className="mx-auto max-w-6xl px-4 py-6 text-center">
                    <small>© Krishna Naik. All rights reserved. last Updated : {date}</small> 
                </div>
            </footer>
        </div>
    )
}

export default Footer;