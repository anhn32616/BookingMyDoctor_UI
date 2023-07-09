import { Rate } from 'antd';
import React from 'react';
import strftime from 'strftime';
import './Comment.scss'

function Comment({ rate }) {
    return (
        <div className='PatientComment'>
            <div className='PatientComment__info'>
                <strong>{rate.patientName}</strong>
                <span className='PatientComment__info-date'><i className="fa-solid fa-circle-check" style={{color: '#45c3d2'}}></i> Đã khám ngày {strftime('%d/%m/%Y',new Date(rate.date))}</span>
            </div>
            <div className="PatientComment__content">
                <Rate style={{fontSize: 15}} value={rate.point} disabled />
                <p>{rate.comment}</p>
            </div>
        </div>
    );
}

export default Comment;