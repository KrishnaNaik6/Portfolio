import React from "react";
import './Skills.css'

const Skills = ({ skillData }) => {
    return (
        <div className="skills">
            {/* Technical Skills */}
            <div className="technical">
                <h3 className="heading">Technical Skills</h3>
                <div className="tskills">
                    {Object.entries(skillData.Technical).map(([category, items], i) => (
                        <div key={i} className="easeElem">
                            <h4>{category}</h4>
                            <ul className="Scard">
                                {Object.entries(items).map(([skill, icon], index) => (
                                    <li key={index} className="skill-item">
                                        <i className={icon}></i>
                                        <span>{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Soft Skills */}
            <div className="soft">
                <h3 className="heading">Soft Skills</h3>
                <ul className="Scard easeElem">
                    {skillData["Soft Skills"].map((softSkill, i) => (
                        <li key={i}>{softSkill}</li>
                    ))}
                </ul>
            </div>
            <p style={{alignSelf:"center"}}>Always learning, Always building..</p>
        </div>
    );
};

export default Skills;
