import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'

function SpecialistItem({ data, mode }) {
    const navigate = useNavigate()
    const handleClick = () => {
        navigate(`/detailSpecialist/${data.id}`)
    }
    return (
        <div className={`${mode === 'column' ? 'specialistItem--column ': '' }specialistItem`} onClick = {handleClick}>
            <div className="specialistItem__img">
                <img src={data.imageUrl} alt="specialistItem image" />
            </div>
            <span className="specialistItem__title">
                {data.name}
            </span>
        </div>
    )
}

export default SpecialistItem
