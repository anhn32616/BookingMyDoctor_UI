import React from 'react'
import './index.scss'
import DoctorReviewItem from './DoctorReviewItem'
DoctorReviews.propTypes = {}

function DoctorReviews() {
    return (
        <div className="doctorReviews">
            <div className="doctorReviews__container">
                <header>Đánh giá bác sĩ</header>
                <ul className="doctorReviews__list">
                    <DoctorReviewItem />
                    <DoctorReviewItem />
                    <DoctorReviewItem />
                    <DoctorReviewItem />
                    <DoctorReviewItem />
                    <DoctorReviewItem />
                </ul>
            </div>
        </div>
    )
}

export default DoctorReviews
