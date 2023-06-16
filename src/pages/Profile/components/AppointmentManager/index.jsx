import appointmentApi from 'api/appointmentApi'
import { SocketContext } from 'App'
import Pagination from 'components/Pagination'
import ReviewDialog from 'components/ReviewDialog'
import AppointmentDetail from 'pages/Appointment/AppointmentDetail'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import convertTZ7Str from 'utils/convertTZ7Str'
import './index.scss'
AppointmentManager.propTypes = {}

function AppointmentManager() {
    const socket = useContext(SocketContext)
    const [listAppointment, setListAppointment] = useState([])
    const [pagination, setPagination] = useState([])
    const userData = useSelector(state => state.user.profile)
    const getAllAppointmentFromAPI = async (page) => {
        const respone =
            await appointmentApi.getAllAppointmentOfUser(
                userData.id,
                {
                    headers: {
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    },
                    params: { page: page || 0 }
                }
            )
        setPagination(respone.page)
        setListAppointment(respone.appointment)
    }
    useEffect(() => {
        getAllAppointmentFromAPI()
    // eslint-disable-next-line
    }, [userData.id])
    const cancelAppointment = async (idAppointment) => {
        try {
            await appointmentApi.cancelAppointment(idAppointment, {
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token'
                    )}`
                }
            })
            getAllAppointmentFromAPI()
            toast.success('Huỷ lịch hẹn thành công', {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
        }
        catch (err) {
            toast.error(err.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
        }
    }
    const confirmAppointment = (idAppointment) => {
        try {
            ( async () => {
                const respone = await appointmentApi.confirmAppointment(
                    idAppointment,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem(
                                'access_token'
                            )}`
                        }
                    }
                )
                getAllAppointmentFromAPI()
                toast.success('Chấp nhận cuộc hẹn thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000
                })
                respone.message.forEach(element => {
                    if (element !== {})
                        socket.emit('createNotify', element)
                })
            })()
        }
        catch (err) {
            toast.error(err.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
        }
    }
    const [AppointmentItemDetail, setAppointmentItemDetail] = useState({})
    const [isShowAppointmentItemDetail, setIsShowAppointmentItemDetail] = useState(false)
    const toggleShowItem = () => setIsShowAppointmentItemDetail(!isShowAppointmentItemDetail)
    const showAppointmentItemDetail = (item) => {
        toggleShowItem()
        setAppointmentItemDetail(item)
    }
    const [isShowReview, setIsShowReview] = useState(false)
    const toggleShowReview = () => setIsShowReview(!isShowReview)
    const showReviewItem = (item) => {
        toggleShowReview()
        setAppointmentItemDetail(item)
    }
    const handlePageChange = (page) => {
        getAllAppointmentFromAPI(page)
    }
    const handleSubmitReviewForm = (appointmentDataId, rate) => {
        try {
            ( async () => {
                await appointmentApi.ratingAppointment(
                    appointmentDataId,
                    { scores: rate },
                    {
                        headers: {
                            Authorization: `${localStorage.getItem(
                                'access_token'
                            )}`
                        }
                    }
                )
                // fetchListAppointment(queryParams)
                toast.success('Đánh giá thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 2000
                })
                setIsShowReview(false)
                getAllAppointmentFromAPI()
            })()
        }
        catch (err) {
            toast.error(err.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
        }
    }
    useEffect(() => {
        document.title = 'Quản lí cuộc hẹn'
    }, [])
    return (
        <div className="appointmentManager">
            <div className="appointmentManager__container">
                <header>Quản lí cuộc hẹn</header>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            {userData.role.name === 'ROLE_DOCTOR' ? (<th>Bệnh nhân</th>) : (<th>Bác sĩ</th>)}
                            <th>Ngày</th>
                            <th>Thời gian</th>
                            <th>Tình trạng</th>
                            <th>Chi tiết</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listAppointment.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    {userData.role.name === 'ROLE_DOCTOR' ? (<td>{`${item.patient.user.firsname} ${item.patient.user.lastname}`}</td>) : (<td>{`${item.schedule.doctor.user.firsname} ${item.schedule.doctor.user.lastname}`}</td>)}
                                    <td>{convertTZ7Str(item.schedule.begin).split('T')[0]}</td>
                                    <td>{`${convertTZ7Str(item.schedule.begin).split('T')[1]} - ${convertTZ7Str(item.schedule.end).split('T')[1]}`}</td>
                                    {item.status.id === 1 && <td><span className="label__pending">Chờ xử lí</span></td>}
                                    {item.status.id === 2 && <td><span className="label__confirm">Đã chấp nhận</span></td>}
                                    {item.status.id === 4 && <td><span className="label__cancel">Đã hủy</span></td>}
                                    {item.status.id === 3 && <td><span className="label__done">Hoàn thành</span></td>}
                                    {item.status.id === 5 && <td><span className="label__cancel">Admin xử lí ...</span></td>}
                                    {item.status.id === 6 && <td><span className="label__cancel">Vi phạm</span></td>}
                                    <td><button className="btnDetail" onClick={() => showAppointmentItemDetail(item)}>Chi tiết</button></td>
                                    <td>
                                        {userData.role.name === 'ROLE_DOCTOR' && item.status.name === 'NEW' && <button className="btnSuccess" onClick={() => confirmAppointment(item.id)}>Xác nhận</button>}
                                        {userData.role.name === 'ROLE_PATIENT' && item.status.name === 'NEW' && <button className="btnCancel" onClick={() => cancelAppointment(item.id)}>Hủy cuộc hẹn</button>}
                                        {userData.role.name === 'ROLE_PATIENT'&& item.status.id === 3 && item.rating === null && <button className="btnReview" onClick={() => showReviewItem(item)}>Đánh giá</button>}
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <Pagination totalPage={pagination.totalPages} currentPage={pagination.page} onClick = {handlePageChange}/>
            </div>
            {isShowAppointmentItemDetail && <AppointmentDetail appointmentData = {AppointmentItemDetail} onClose = {toggleShowItem} confirmAppointment = {confirmAppointment}/>}
            {isShowReview && <ReviewDialog appointmentData = {AppointmentItemDetail} onClose = {toggleShowReview} handleSubmitReviewForm = {handleSubmitReviewForm} />}
        </div>
    )
}

export default AppointmentManager
