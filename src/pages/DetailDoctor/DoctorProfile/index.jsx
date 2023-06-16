import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { Rate } from 'antd'
DoctorProfile.propTypes = {}

function DoctorProfile({ doctor }) {
    const arr = [1, 2, 3, 4, 5]
    const navigate = useNavigate()
    const handleMessage = () => {
        navigate(`/messageApp/${doctor.user_id}`)
    }
    return (
        <div className="doctorProfile">
            <div className="doctorProfile__container">
                <div className="doctorProfile__info">
                    <div className="doctorProfile__info-img">
                        <img src={doctor.user.image} alt="doctor" />
                    </div>
                    <div className="doctorProfile__info-content" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>
                            Bác sĩ {doctor.user.fullName}
                        </span>
                        <p>
                            Bệnh viện: {doctor.hospital.name}
                        </p>
                        <p>
                            Phòng khám: {doctor.clinic.name}
                        </p>
                        <p>
                            Chuyên khoa: {doctor.speciatly.name}
                        </p>
                        <button style={{ marginTop: 10, width: 'fit-content' }} className="btnReview" onClick={handleMessage}>Nhắn tin</button>

                    </div>
                </div>
                <div className="doctorProfile__rate">
                    <span className="doctorProfile__rate-point">
                        <Rate disabled value={doctor.rate}></Rate>
                    </span>
                    <span className="doctorProfile__rate-count">
                        {doctor.numberOfReviews ? (<>{doctor.numberOfReviews} đánh giá</>) : (<>0 đánh giá</>)}
                    </span>
                    <div className="doctorProfile__rate-list">
                        {doctor.rate > 0 && arr.map(item => {
                            if (item <= Math.floor(doctor.rate)) {
                                return (
                                    <span key={item}>
                                        <AiFillStar className="star icon__active" />
                                    </span>
                                )
                            }
                            return (
                                <span key={item}>
                                    <AiFillStar className="star" />
                                </span>
                            )
                        })}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile
