import React, { useState } from 'react'
import { AiFillStar } from 'react-icons/ai'
import './index.scss'
function ReviewDialog({ onClose, appointmentData, handleSubmitReviewForm }) {
    const handleOnClick = e => {
        if (e.target.className === 'reviewDialog') onClose()
    }
    const [rate, setRate] = useState(5)
    const arr = [1, 2, 3, 4, 5]

    return (
        <div className="reviewDialog" onClick={handleOnClick}>
            <div className="reviewDialog__container">
                <header>Đánh giá bác sĩ</header>
                <div className="reviewDialog__listStar">
                    {arr.map((item) => {
                        if (item <= rate) {
                            return (
                                <span
                                    key={item}
                                    onClick={() => {
                                        setRate(item)
                                    }}
                                >
                                    <AiFillStar className="star icon__active" />
                                </span>
                            )
                        }
                        return (
                            <span
                                key={item}
                                onClick={() => {
                                    setRate(item)
                                }}
                            >
                                <AiFillStar className="star" />
                            </span>
                        )
                    })}
                </div>
                <div className="reviewDialog__message">
                    Mời bạn đánh giá chất lượng dịch vụ của chúng tôi !
                </div>
                <div className= "reviewDialog__button">
                    <button type="submit" onClick={() => handleSubmitReviewForm(appointmentData.id, rate)} className = " btnReview">
                        Đánh giá
                    </button>
                </div>

            </div>
        </div>
    )
}

export default ReviewDialog
