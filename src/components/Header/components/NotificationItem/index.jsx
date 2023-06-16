import notificationApi from 'api/notificationApi'
import { path } from 'constants/path'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getNotifies } from '../Notification/notificationSlice'
import './index.scss'
function NotificationItem({ notify }) {
    const user = useSelector(state => state.user.profile)
    const dispath = useDispatch()
    const navigate = useNavigate()
    const handleNotifyItemClick = () => {
        (async () => {
            await notificationApi.changeStatus(notify.id, {
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token')}`
                }
            })
        })()
        dispath(getNotifies({ userId: user.id, token: localStorage.getItem('access_token') }))
        if (user.role.name === 'ROLE_DOCTOR' || user.role.name === 'ROLE_ADMIN')
            navigate(path.appointmentManagement)
        else navigate(path.myAppointment)
    }
    return <li className="notification__list-item" onClick={handleNotifyItemClick}>
        <div className="notification__list-item-img">
        </div>
        <div className="notification__list-item-content">
            {notify.message}
        </div>
        <div>
            <span className={`${!notify.status ? 'notification__list-item-unRead' : 'notification__list-item-Read'}`}>.</span>
        </div>
    </li>
}

export default NotificationItem
