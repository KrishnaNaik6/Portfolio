import './Experience.css'

const Experience = ({ expData }) => {
    return (
        <>
            {expData.map((data, i) => (
                <div key={i} className="p-4 border rounded-lg shadow-md bg-white mb-4">
                    {console.log("experience data", data)}
                    <h2 className="text-xl font-semibold">
                        <a
                            href={data.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            {data.company}
                        </a>
                    </h2>
                    <p className="text-gray-700">
                        <strong>{data.role}</strong> | {data.tenure_period}
                    </p>
                    <ul className="list-disc list-inside mt-2 text-gray-600">
                        {data.works.map((work, index) => (
                            <li key={index}>{work}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </>
    )
}

export default Experience;
