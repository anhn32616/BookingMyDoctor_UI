import { path } from 'constants/path'
import React from 'react'
import './index.scss'
import { markNotificationAsRead } from 'utils/firebase/NotificationFb'
import { useSelector } from 'react-redux'
import { formatRelative } from 'date-fns/esm'
import vi from 'date-fns/locale/vi';


function formatDate(seconds) {
    let formattedDate = '';

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds), new Date(), {locale: vi});
        // Capitalize first letter AnhNT282
        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }
    return formattedDate;
}

function NotificationItem({ notify }) {
    const user = useSelector(state => state.user.profile)
    const handleNotifyItemClick = async (id) => {
        await markNotificationAsRead(id)
        if (user.roleName === 'ROLE_DOCTOR') window.location = path.appointmentManagement;
        else window.location = path.myAppointment

    }
    return <li className="notification__list-item" onClick={() => { handleNotifyItemClick(notify.id) }}>
        <div className="notification__list-item-img">
        </div>
        <div className="notification__list-item-content">
            {notify.message}
            <div className='notification__list-item-time'>
                <i className="fa-solid fa-clock"></i> {formatDate(notify.dateCreated)}
            </div>
        </div>
        <div>
            {!notify.read && (<i className="fa-solid fa-circle" style={{ color: "#0a60f5" }} />)}
        </div>
    </li>
}

export default NotificationItem
