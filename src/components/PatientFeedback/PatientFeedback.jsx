import React from 'react';
import Comment from './Comment/Comment';

function PatientFeedback({rates}) {
    return (
        <div className='PatientFeedback' style={{padding: '30px',borderTop: '1px solid rgb(0 0 0 / 22%)'}}>
            <h4 style={{fontSize: 24, color: '#575555'}}>Phản hồi của bệnh nhân sau khi đi khám</h4>
            {rates.map((rate, index) => (
                <Comment key={index} rate={rate}/>
            ))}
        </div>
    );
}

export default PatientFeedback;