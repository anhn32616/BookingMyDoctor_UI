import React from 'react'
import './index.scss'
import { useNavigate } from 'react-router-dom'
function UserChatItem({ user, setUserReceiveFunc }) {
    const navigate = useNavigate()
    const handleUserClick = () => {
        setUserReceiveFunc(user)
        navigate(`/messageApp/${user.id}`)
    }
    return (
        <li className="userChatItem" onClick={handleUserClick}>
            <div className="userChatItem__container">
                <div className="userChatItem__img">
                    <img src={user && user.image} />
                </div>
                <div className="userChatItem__content">
                    <span>{user && `${user.firsname} ${user.lastname}`}</span>
                    {/* <span>{user && user['message.text']}</span> */}
                </div>
            </div>
        </li>
    )
}

export default UserChatItem
