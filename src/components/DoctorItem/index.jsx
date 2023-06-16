import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './index.scss'

function DoctorItem({ data, mode }) {
    const navigate = useNavigate()
    return (
        <div className="doctorItem">
            <div className={`${mode === 'listColumn' ? 'listColumn-item ' : ''}doctorItem__container`}>
                <div className="doctorItem__content">
                    <div className="doctorItem__content-img">
                        <img src={data.user.image} alt="doctor img" />
                    </div>
                    <div className="doctorItem__content-main">
                        <span className="doctorItem__content-main-position">Bác sĩ</span>
                        <span className="doctorItem__content-main-name">{data.user.fullName}</span>
                        <span className="doctorItem__content-main-clinic">{`${data.speciatly.name} • ${data.clinic.name}`}</span>
                    </div>
                </div>
                <div className={`${mode === 'listColumn' ? 'doctorItem__action--column ' : ''}doctorItem__action`}>
                    <button onClick={() => { navigate(`/detailDoctor/${data.id}`) }}><Link to={`/detailDoctor/${data.id}`} className="doctorItem__action-link">Đặt lịch</Link></button>
                </div>
            </div>
        </div>
    )
}

export default DoctorItem