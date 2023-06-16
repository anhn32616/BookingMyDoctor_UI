import React from 'react'
import { useNavigate } from 'react-router-dom'
import strftime from 'strftime'
import convertTZ from 'utils/convertTZ'
import './index.scss'

function TimeTableItem({ data }) {
    const navigate = useNavigate()
    const handleOnClick = () => {
        if (data.status === true) return
        navigate(`/bookAppointment/${data.id}`)
    }
    return (
        <li className="timeTableItem" onClick={handleOnClick}>
            <span>{`${strftime('%H:%M', convertTZ(data.startTime))} : ${strftime('%H:%M', convertTZ(data.endTime))}`}</span>
        </li>
    )
}

export default TimeTableItem
