import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.scss'
function HospitalItem({ mode, data }) {
    const navigate = useNavigate()
    return (
        <div className="clinicItem" onClick={() => navigate(`/detailHospital/${data.id}`)}>
            <div className="clinicItem__container">
                <div className={`${mode === 'cpm-list' ? 'clinicItem__content--list ': ''}clinicItem__content`}>
                    <div className={`${mode === 'cpm-list' ? 'clinicItem__content-img-list ' : ''}clinicItem__content-img`}>
                        <img src = {data.imageUrl} alt = "clinic Ex"/>
                    </div>
                    <span>{data.name}</span>
                </div>
            </div>
        </div>
    )
}

export default HospitalItem
