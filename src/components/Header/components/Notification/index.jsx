import React from 'react'
import { useSelector } from 'react-redux'
import NotificationItem from '../NotificationItem'
import './index.scss'
function Notification() {
    const notificationList = useSelector(state => state.notification.notificationList)
    return (
        <div className="notification">
            <div className="notification__container">
                <header>Thông báo</header>
                <ul className = "notification__list">
                    {
                        notificationList.map (notify => <NotificationItem key={notify.id} notify = {notify} />)
                    }
                </ul>
            </div>
        </div>
    )
}

export default Notification
