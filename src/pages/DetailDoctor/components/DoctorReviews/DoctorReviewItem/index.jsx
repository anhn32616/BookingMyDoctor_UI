import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import './index.scss'
import { TiTick } from 'react-icons/ti'

function DoctorReviewItem() {
    return (
        <li className="doctorReviewItem">
            <div className="doctorReviewItem__container">
                <span className="doctorReviewItem__infoUser">
                    <span className="name">Nguyễn Văn A</span>
                    <span className="tick">
                        <TiTick />
                    </span>
                    <span>Đã khám ngày 10/9/2022</span>
                </span>
                <span className="doctorReviewItem__rate-point">
                    <span>
                        <AiFillStar />
                    </span>
                    <span>
                        <AiFillStar />
                    </span>
                    <span>
                        <AiFillStar />
                    </span>
                    <span>
                        <AiFillStar />
                    </span>
                </span>
                <span className="doctorReviewItem__message">
                    Bác sĩ rất nhiệt tình
                </span>
            </div>
        </li>
    )
}

export default DoctorReviewItem
