import React, { useEffect, useState } from "react";
import "./Header.css";
import Clock from "../Clock/Clock";
import { Sun, Moon, Menu, X } from "lucide-react";

const Header = ({ toParent }) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("theme") === "light" ? false : true
    );

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.remove("active");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.add("active");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <div className={`header ${darkMode ? "dark-header" : ""}`}>
            <div id="name" className={`name ${!darkMode ? "dark" : ""}`}>
                <h2 style={{ fontFamily: "serif" }}>KRISHNA</h2>
            </div>
            <ul id="navbar" className={`navbar ${!darkMode ? "dark-mode" : ""} ${menuOpen ? "open" : ""}`}>
                <li><a href="#about">About</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#interest">Interest</a></li>
                <li><a href="#skill">Skills</a></li>
            </ul>

            <div className="mode">
                {darkMode ? (
                    <Sun onClick={() => { setDarkMode(false); toParent(false); }} />
                ) : (
                    <Moon onClick={() => { setDarkMode(true); toParent(true); }} />
                )}
            </div>

            <div className="div_clock">
                <Clock />
            </div>
            <div className="hamburger" onClick={()=>setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={28} /> : <Menu size={28}/>}
            </div>
        </div>
    );
};

export default Header;
