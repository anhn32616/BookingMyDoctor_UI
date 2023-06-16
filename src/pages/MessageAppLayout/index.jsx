import messageApi from 'api/messageApi'
import { SocketContext } from 'App'
import images from 'assets'
import { path } from 'constants/path'
import UserChatItem from 'pages/MessageApp/UserChatItem'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

function MesageAppLayout() {
    const socket = useContext(SocketContext)
    const userSendID = useSelector(state => state.user.profile).profile.id
    const [userReceive, setUserReceive] = useState({})
    const [listUserChat, setListUserChat] = useState([])
    const setUserReceiveFunc = user => setUserReceive(user)
    const getListUserChat = async () => {
        try {
            const respone = await messageApi.getListUserChat(userSendID, {
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token')}`
                }
            })
            setListUserChat(respone.users)
        } catch (err) {
            return err.message
        }
    }
    useEffect(() => {
        getListUserChat()
    }, [userSendID])


    //nhan
    useEffect(() => {
        socket.on('addMessageToClient', () => {
            if (!listUserChat.find (user => user.id === userReceive.id))
                getListUserChat()
        })

        return () => socket.off('addMessageToClient')
    }, [socket])

    useEffect(() => {
        document.title = 'Nhắn tin'
    }, [])
    return (
        <div className="messageApp">
            <div className="messageApp__container">
                <div className="messageApp__infoPeople">
                    <div className="systemLayout__logo">
                        <Link to={path.home}>
                            <img
                                src={images.logo}
                                alt="logo"
                                className="logo"
                            />
                        </Link>
                    </div>
                    <ul className="messageApp__infoPeople-list">
                        {
                            listUserChat.map((user, index) => <UserChatItem key={index} user = {user} setUserReceiveFunc={setUserReceiveFunc} userReceive = {userReceive}/>)
                        }
                    </ul>
                </div>
                <div className="messageApp__messageArea" >
                    <header></header>
                    <ul className="messageApp__messageArea-content">
                    </ul>


                    <div className="messageApp__messageArea-input">
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MesageAppLayout
