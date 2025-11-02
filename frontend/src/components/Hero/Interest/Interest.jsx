import './Interest.css'

const Interest = ({ Interest }) => {

    console.log("Interestss", Interest)
    return (

        <div className='interest'>
            <ul>
                {
                    Interest.map((value, i) =>
                        <li key={i}>{value}</li>
                    )
                }
            </ul>
        </div>
    )
}

export default Interest;