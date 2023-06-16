import scheduleApi from 'api/scheduleApi'
import BaseTableItem from 'components/BaseTableItem.jsx'
import listTimes from 'constants/listTimes'
import weekdays from 'constants/weekdays'
import React, { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import strftime from 'strftime'
import getDaysOfWeekBetweenDates from 'utils/getDaysBetweenTwoDates'
import './index.scss'

function AddMultiSchedule({ onClose }) {
    const userDoctor = useSelector(state => state.user.profile)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState((new Date()).setDate((new Date()).getDate() + 1))
    const [weekdaysSubmit, setWeekDaysSubmit] = useState(
        () => [...weekdays]
    )
    const [scheduleSubmit, setScheduleSubmit] = useState(
        () => [...listTimes]
    )
    const [cost, setCost] = useState(100000)
    const handleOnClick = e => {
        if (e.target.className === 'addMultiSchedule') onClose()
    }
    const handleStartDateChange = date => {
        setStartDate(date)
    }
    const handleEndDateChange = date => {
        setEndDate(date)
    }
    const handleCostChange = e => {
        setCost(e.target.value)
    }
    const handleweekdayOnClick = id => {
        const weekdaysChange = [...weekdaysSubmit]
        const weekdaysItemChange = weekdaysChange.find(
            item => item.id === id
        )
        weekdaysItemChange.status = !weekdaysItemChange.status
        setWeekDaysSubmit(weekdaysChange)
    }
    const handleScheduleOnClick = id => {
        const schedulesChange = [...scheduleSubmit]
        const schedulesItemChange = schedulesChange.find(
            item => item.id === id
        )
        schedulesItemChange.status = !schedulesItemChange.status
        setScheduleSubmit(schedulesChange)
    }
    const handleSubmit = () => {
        if (startDate > endDate) {
            toast.error('Ngày chưa hợp lệ', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
            return
        }
        const valueToSubmit = {
            weekdays: [],
            schedules: [],
            beginDate: '',
            endDate: '',
            doctor_id: userDoctor.doctor.id,
            cost: Number(cost)
        }
        weekdaysSubmit.map(weekday => {
            if (weekday.status)
                valueToSubmit.weekdays.push(weekday.label)
        })
        scheduleSubmit.map(schedule => {
            if (schedule.status)
                valueToSubmit.schedules.push(schedule.value)
        })
        if (valueToSubmit.weekdays.length <= 0 || valueToSubmit.schedules.length <=0) {
            toast.error('Nhập thiếu thông tin thứ ngày hoặc khung giờ', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
            return
        }
        valueToSubmit.beginDate = strftime('%Y-%m-%d', startDate)
        valueToSubmit.endDate = strftime('%Y-%m-%d', endDate)
        ;(
            async () => {
                try {
                    await scheduleApi.addMultiSchedule(valueToSubmit,
                        {
                            headers: {
                                Authorization: `${localStorage.getItem(
                                    'access_token'
                                )}`
                            }
                        }
                    )
                    toast.success('Tạo lịch khám thành công', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000
                    })
                    onClose()
                }
                catch (err) {
                    toast.error(err.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000
                    })
                }
            }
        )()
    }
    useEffect(() => {
        const daysBetweenTwoDates = getDaysOfWeekBetweenDates(startDate, endDate)
        const weekdaysShow = []
        weekdays.forEach(element => {
            if (daysBetweenTwoDates.find(day => day === element.id) !== undefined)
                weekdaysShow.push(element)
        })
        setWeekDaysSubmit(weekdaysShow)
    }, [startDate, endDate])
    useEffect(() => {
        document.title = 'Tạo lịch khám'
    }, [])
    return (
        <div className="addMultiSchedule" onClick={handleOnClick}>
            <div className="addMultiSchedule__container">
                <header>Tạo lịch khám mới</header>
                <div className="addMultiSchedule__content">
                    <div className="addMultiSchedule__content-left">
                        <div className="addMultiSchedule__content-left-time">
                            <div>
                                <label>Từ</label>
                                <ReactDatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    minDate = {new Date()}
                                />
                            </div>
                            <div>
                                <label>Đến</label>
                                <ReactDatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    minDate = {(new Date()).setDate((new Date()).getDate() + 1)}
                                />
                            </div>
                        </div>
                        <div className="addMultiSchedule__content-left-weekdays">
                            <label>Ngày</label>
                            <ul>
                                {weekdaysSubmit.map(item => (
                                    <BaseTableItem
                                        key={item.id}
                                        data={item}
                                        onClick={handleweekdayOnClick}
                                    />
                                ))}
                            </ul>
                        </div>
                        <div className="addMultiSchedule__content-left-cost">
                            <label>Giá khám</label>
                            <input
                                value={cost}
                                onChange={handleCostChange}
                                type="number"
                            />
                        </div>
                    </div>
                    <div className="addMultiSchedule__content-right">
                        <label>Khung giờ</label>
                        <ul>
                            {scheduleSubmit.map(item => (
                                <BaseTableItem
                                    key={item.id}
                                    data={item}
                                    onClick={handleScheduleOnClick}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="addMultiSchedule__action">
                    <button
                        className="btnSuccess"
                        onClick={handleSubmit}
                    >
                        Tạo lịch khám
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddMultiSchedule
