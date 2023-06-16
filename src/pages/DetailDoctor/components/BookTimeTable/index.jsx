import React, { useEffect, useMemo, useState } from 'react'
import { BsFillCalendarFill } from 'react-icons/bs'
import './index.scss'
import TimeTableItem from './TimeTableItem'
import strftime from 'strftime'
import { toast } from 'react-toastify'
import scheduleApi from 'api/scheduleApi'
import { useParams } from 'react-router-dom'
import ReactDatePicker from 'react-datepicker'

function BookTimeTable({ doctor }) {
    const doctorId = useParams().id
    const dataDay = useMemo(() => {
        const tomorrow = new Date()
        const tomorrow2 = new Date()
        const tomorrow3 = new Date()

        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow2.setDate(tomorrow2.getDate() + 2)
        tomorrow3.setDate(tomorrow3.getDate() + 3)

        return [
            {
                value: strftime('%Y-%m-%d', tomorrow),
                label: strftime('%Y-%m-%d', tomorrow)
            },
            {
                value: strftime('%Y-%m-%d', tomorrow2),
                label: strftime('%Y-%m-%d', tomorrow2)
            },
            {
                value: strftime('%Y-%m-%d', tomorrow3),
                label: strftime('%Y-%m-%d', tomorrow3)
            }
        ]
    }, [])
    const [day, setDay] = useState(dataDay[0].value)
    const [listTimeTable, setListTimeTable] = useState([])
    useEffect(() => {
        let date = new Date(day)
        const valueSubmit = {
            date: new Date(strftime('%Y-%m-%d', date)).toISOString(),
            doctorId: doctorId,
            status: 'Available'
        };
        (async () => {
            try {
                const respone = await scheduleApi.getAllSchedule(
                    { ...valueSubmit }
                )
                setListTimeTable(respone.data.listItem.reverse())
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }, [day, doctorId])
    const [selectedDate, setSelectedDate] = useState(new Date(dataDay[0].value))
    const handleDateChange = date => {
        setSelectedDate(date)
        setDay(strftime('%Y-%m-%d', date))
    }
    return (
        <div className="bookTimeTable">
            <div className="bookTimeTable__container">
                <div className="bookTimeTable__bookDay">
                    <header>
                        <span>
                            <BsFillCalendarFill />
                        </span>
                        Lịch khám
                    </header>
                    <div className="bookTimeTable__bookDay-time">
                        <div>
                            <ReactDatePicker
                                selected={selectedDate}
                                onChange={handleDateChange}
                                minDate={new Date(dataDay[0].value)}
                            />
                        </div>
                    </div>
                    <ul className="bookTimeTable__bookDay-list">
                        {
                            listTimeTable.map(item => <TimeTableItem key={item.id} data={item} />)
                        }
                    </ul>
                </div>
                <div className="bookTimeTable__outside">
                    <span className="address_doctor">
                        <header>Địa chỉ khám</header>
                        <h4>
                            {doctor.clinic.name}
                        </h4>
                        <span>
                            {doctor.clinic.address}, {doctor.clinic.ward}, {doctor.clinic.district}, {doctor.clinic.city}
                        </span>
                    </span>
                    <span className="price">
                        <span>Giá khám từ: </span> 100.000đ
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BookTimeTable
