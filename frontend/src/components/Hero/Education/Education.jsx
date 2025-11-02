import { useEffect, useState } from "react";
import { Octokit } from "@octokit/core";
import './Education.css'

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN
});

const Education = ({ eduData }) => {
    const [educationData, setEducationData] = useState([]);
    // const [loading, setLoading] = useState(true)

    useEffect(() => {
        setEducationData(eduData)
    }, []);

    return (
        <div className="educations">
            {
                console.log("education data", educationData)
            }
            {
                eduData.map((edu, index) => (
                    <div key={index} className="easeElem education">
                        <h4 style={{margin:'0.5em 0', borderBottom:'1px solid rgba(228, 157, 204, 0.2)'}}>{edu.edu}</h4>
                        <p>

                            at {edu.college}
                        </p>
                        <p>

                            {edu.status}{edu.year && `-${edu.year}`}
                        </p>
                    </div>
                ))
            }
        </div>
    );
};

export default Education;