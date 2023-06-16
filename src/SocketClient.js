import { SocketContext } from 'App'
import { getNotifies } from 'components/Header/components/Notification/notificationSlice'
import React, { useContext, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setListUser } from 'pages/MessageApp/listUserSlice'
function SocketClient() {
    const token = localStorage.getItem('access_token')
    const socket = useContext(SocketContext)
    const { user } = useSelector(state => state)
    const dispatch = useDispatch()
    const listUser = useSelector(state => state.listUser.listUser)

    useEffect(() => {
        const userSubmit = { _id: user.id }
        socket.emit('joinUser', userSubmit)
    }, [socket, user])
    useEffect(() => {
        socket.on('getUsers', users => {
            dispatch(setListUser(users))
        })
    }, [socket, dispatch])

    // Notification
    useEffect(() => {
        socket.on('createNotifyToClient', msg => {
            dispatch(
                getNotifies({ userId: user.id, token: token })
            )
            toast.info(msg.message, {
                position: toast.POSITION.BOTTOM_RIGHT,
                autoClose: 2000
            })
        })

        return () => socket.off('createNotifyToClient')
    }, [socket, dispatch, user, token])

    //nhan
    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            if (!(window.location.href).includes(`messageApp/${msg.from_user}`)
            ) {
                const user = listUser.find(
                    user => user.id === msg.from_user
                )
                const msgShow = `${user.firsname} ${user.lastname}: ${msg.text}`
                toast.info(msgShow, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })

        return () => socket.off('addMessageToClient')
    }, [socket, listUser])
    return <></>
}

export default SocketClient
