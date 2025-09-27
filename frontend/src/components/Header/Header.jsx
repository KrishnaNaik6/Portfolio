import React, { useRef, useEffect, useState } from "react";
import "./Header.css";
import Clock from "../Clock/Clock";
import { Sun, Moon, Menu, X } from "lucide-react";

const Header = ({ toParent, activeSection }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(
        true
    );
    const navbarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    // 🌙 Dark mode effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkMode]);

    return (
        <div className={`header ${darkMode ? "dark-header" : ""}`}>
            <div id="name" className={`name ${!darkMode ? "dark" : ""}`}>
                <h2 style={{ fontFamily: "serif" }}>KRISHNA</h2>
            </div>

            <ul
                ref={navbarRef}
                id="navbar"
                className={`navbar ${!darkMode ? "dark-mode" : ""} ${menuOpen ? "open" : ""
                    }`}>
                <li className={activeSection === "about" ? "navactive" : ""}>
                    <a href="#about">About</a>
                </li>
                <li className={activeSection === "education" ? "navactive" : ""}>
                    <a href="#education">Education</a>
                </li>
                <li className={activeSection === "experience" ? "navactive" : ""}>
                    <a href="#experience">Experience</a>
                </li>
                <li className={activeSection === "projects" ? "navactive" : ""}>
                    <a href="#projects">Projects</a>
                </li>
                <li className={activeSection === "skill" ? "navactive" : ""}>
                    <a href="#skill">Skills</a>
                </li>
                <li className={activeSection === "interest" ? "navactive" : ""}>
                    <a href="#interest">Interest</a>
                </li>
                <li className={activeSection === "contact" ? "navactive" : ""}>
                    <a href="#contact">Contact</a>
                </li>
            </ul>

            <div className={`mode ${menuOpen ? "swipe" : ""}`}>
                {darkMode ? (
                    <Sun
                        className="rotater"
                        onClick={() => {
                            setDarkMode(false);
                            toParent(false);
                        }}
                    />
                ) : (
                    <Moon
                        className="bouncer"
                        onClick={() => {
                            setDarkMode(true);
                            toParent(true);
                        }}
                    />
                )}
            </div>

            <div className="div_clock">
                <Clock />
            </div>

            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </div>
        </div>
    );
};

export default Header;
