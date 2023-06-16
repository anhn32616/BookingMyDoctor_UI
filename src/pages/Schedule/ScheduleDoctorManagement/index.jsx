import React, { useEffect, useMemo, useState } from 'react'
import './index.scss'
import { useSelector } from 'react-redux'
import scheduleApi from 'api/scheduleApi'
import { toast } from 'react-toastify'
import convertTZ7Str from 'utils/convertTZ7Str'
import Pagination from 'components/Pagination'
import queryString from 'query-string'
import { useLocation, useNavigate } from 'react-router-dom'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker from 'react-datepicker'
import strftime from 'strftime'
import AddMultiSchedule from '../AddMultiSchedule'
import { BsFillTrashFill } from 'react-icons/bs'
import doctorApi from 'api/doctorApi'
import Select from 'react-select'
function ScheduleDoctorManagement() {
    const navigate = useNavigate()
    const user = useSelector(state => state.user.profile)
    const [doctorId, setDoctorId] = useState(
        () => user.doctor && user.doctor.id
    )
    const [listDoctor, setListDoctor] = useState([])
    useEffect(() => {
        (async () => {
            try {
                const data = await doctorApi.getAllDoctor({
                    page: 0,
                    limit: 100
                })
                const dataDoctor = [...data.doctor]
                const dataDoctorShow = dataDoctor.map(doctor => {
                    return {
                        value: doctor.id,
                        label: `${doctor.user.firsname} ${doctor.user.lastname}`
                    }
                })
                setListDoctor(dataDoctorShow)
            } catch (err) {
                alert(err)
            }
        })()
    }, [])
    const handleDoctorChange = value => {
        setDoctorId(value.value)
    }
    const [showAddMultiSchedule, setShowAddMultiSchedule] =
        useState(false)
    const toggleShowAddMultiSchedule = () =>
        setShowAddMultiSchedule(!showAddMultiSchedule)
    const [scheduleSearchResult, setScheduleSearchResult] = useState(
        []
    )
    const [pagination, setPagination] = useState({
        size: 10,
        totalPages: 3,
        totalElements: 11,
        page: 0
    })
    const handlePageChange = page => {
        const filters = { ...queryParams, page: page }
        navigate(`?${queryString.stringify(filters)}`)
    }
    const location = useLocation()
    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search)
        return {
            page: Number.parseInt(params.page) || 0,
            size: Number.parseInt(params.size) || 10,
            startDate:
                params.startDate ||
                new Date(
                    strftime('%Y-%m-%dT00:00:00', new Date())
                ).toISOString(),
            endDate:
                params.endDate ||
                new Date(
                    strftime('%Y-%m-%dT23:59:00', new Date())
                ).toISOString()
        }
    }, [location.search])
    const getAllSchedule = async () => {
        try {
            const respone = await scheduleApi.getSchedule(doctorId, {
                params: { ...queryParams }
            })
            setScheduleSearchResult(respone.schedules)
            setPagination(respone.page)
        } catch (err) {
            toast.error(err.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    useEffect(() => {
        getAllSchedule()
        // eslint-disable-next-line
    }, [queryParams, doctorId])

    const [selectedDate, setSelectedDate] = useState(new Date())
    const handleDateChange = date => {
        setSelectedDate(date)
        const startDate = new Date(
            strftime('%Y-%m-%dT00:00:00', date)
        ).toISOString()
        const endDate = new Date(
            strftime('%Y-%m-%dT23:59:00', date)
        ).toISOString()
        const filters = {
            ...queryParams,
            startDate: startDate,
            endDate: endDate
        }
        navigate(`?${queryString.stringify(filters)}`)
    }
    const deleteSchedule = id => {
        (async () => {
            try {
                await scheduleApi.deleteSchedule(id, {
                    headers: {
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    }
                })
                toast.success('Xóa lịch khám thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                getAllSchedule()
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Quản lí lịch khám'
    }, [])
    return (
        <div className="scheduleDoctorManagement">
            <div className="scheduleDoctorManagement__container">
                <header>Quản lí lịch khám</header>
                <div className="scheduleDoctorManagement__action">
                    <div>
                        <ReactDatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                        />
                    </div>
                    {user.role.id === 2 && (
                        <div className="scheduleDoctorManagement__action--select">
                            <Select
                                options={listDoctor}
                                onChange={handleDoctorChange}
                            />
                        </div>
                    )}

                    {user.doctor && (
                        <div>
                            <button
                                className="btnSuccess"
                                onClick={toggleShowAddMultiSchedule}
                            >
                                Thêm lịch khám mới
                            </button>
                        </div>
                    )}
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Bắt đầu</th>
                            <th>Kết thúc</th>
                            <th>Giá</th>
                            <th>Tình trạng</th>
                            <th></th>
                        </tr>
                    </thead>
                    {scheduleSearchResult.length > 0 ? (
                        <tbody>
                            {scheduleSearchResult.map(schedule => (
                                <tr key={schedule.id}>
                                    <td>{schedule.id}</td>
                                    <td>
                                        {
                                            convertTZ7Str(
                                                schedule.begin
                                            ).split('T')[0]
                                        }
                                    </td>
                                    <td>
                                        {`${
                                            convertTZ7Str(
                                                schedule.begin
                                            ).split('T')[1]
                                        } - ${
                                            convertTZ7Str(
                                                schedule.end
                                            ).split('T')[1]
                                        }`}
                                    </td>
                                    <td>{schedule.cost}</td>
                                    <td>
                                        {schedule.status ? (
                                            <span className="label__confirm">
                                                Đã đặt
                                            </span>
                                        ) : (
                                            'Trống'
                                        )}
                                    </td>
                                    <td>
                                        <BsFillTrashFill
                                            className="icon-trash"
                                            onClick={() =>
                                                deleteSchedule(
                                                    schedule.id
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <></>
                    )}
                </table>
                {scheduleSearchResult.length > 0 && (
                    <div className="scheduleDoctorManagement__pagination">
                        <Pagination
                            totalPage={pagination.totalPages}
                            currentPage={pagination.page}
                            onClick={handlePageChange}
                        />
                    </div>
                )}
            </div>
            {showAddMultiSchedule && (
                <AddMultiSchedule
                    onClose={toggleShowAddMultiSchedule}
                />
            )}
        </div>
    )
}

export default ScheduleDoctorManagement
