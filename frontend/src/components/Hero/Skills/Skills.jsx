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
                        <div key={i}>
                            <h4 className="">{category}</h4>
                            <ul className="">
                                {items.map((skill, index) => (
                                    <li key={index}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Soft Skills */}
            <div className="soft">
                <h3 className="heading">Soft Skills</h3>
                <ul className="">
                    {skillData["Soft Skills"].map((softSkill, i) => (
                        <li key={i}>{softSkill}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Skills;
