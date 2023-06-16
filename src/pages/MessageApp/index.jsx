import messageApi from 'api/messageApi'
import userApi from 'api/userApi'
import { SocketContext } from 'App'
import images from 'assets'
import ImageFullScreen from 'components/ImageFullScreen'
import { path } from 'constants/path'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { BsImage } from 'react-icons/bs'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import strftime from 'strftime'
import convertTZ from 'utils/convertTZ'
import './index.scss'
import UserChatItem from './UserChatItem'

function MesageApp() {
    const listUser = useSelector(state => state.listUser.listUser)
    const socket = useContext(SocketContext)
    const userSendID = useSelector(state => state.user.profile).profile.id
    const [message, setMessage] = useState('')
    const userId = useParams().id
    const [userReceive, setUserReceive] = useState({})
    const [listUserChat, setListUserChat] = useState([])
    const [listMessageChat, setListMessageChat] = useState([])
    const [pagination, setPagination] = useState({})
    const divRef = useRef(null)
    const messagesEndRef = useRef(null)
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
    const getMessageChat = async (page) => {
        const userReceiveId = userReceive.id || userReceive.user_id
        try {
            const respone = await messageApi.getMessage({
                params: {
                    from_user: userSendID,
                    to_user: userReceiveId,
                    page: page || 0
                },
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token')}`
                }
            })
            if (page)
                setListMessageChat([...listMessageChat, ...respone.messages])
            else
                setListMessageChat(respone.messages)
            setPagination(respone.page)
        }
        catch (err) {
            return err
        }
    }
    useEffect(() => {
        getListUserChat()
    }, [userSendID])

    useEffect(() => {
        if (userId !== ':id') {
            const userChat = listUserChat.find(user => user.id === userId)
            if (userChat)
                setUserReceive(userChat)
            else {
                (async () => {
                    try {
                        const respone = await userApi.getUserById(userId, {
                            headers: {
                                Authorization: `${localStorage.getItem(
                                    'access_token')}`
                            }
                        })
                        setUserReceive(respone.user)
                    }
                    catch (err) {
                        return err.message
                    }
                }
                )()
            }
        }

    }, [listUserChat, userId])

    const handleChangeMessage = (e) => setMessage(e.target.value)

    const handleSendMess = () => {
        if (message === '' && fileImg === '') return
        const userReceiveId = userReceive.user ? userReceive.user.id : userReceive.id
        const valueSubmit = {
            from_user: userSendID,
            to_user: userReceiveId,
            text: message,
            image: fileImg
        }
        const formData = new FormData()
        for (let key in valueSubmit) {
            formData.append(key, valueSubmit[key])
        }
        (async () => {
            try {
                const respone = await messageApi.addMessage(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${localStorage.getItem(
                            'access_token')}`
                    }
                })
                const valueSocket = {
                    to_user: respone.message.to_user,
                    text: respone.message.text,
                    from_user: respone.message.from_user,
                    date: respone.message.date,
                    image:  respone.message.image
                }
                handleDeleteImg()
                socket.emit('addMessage', valueSocket)
                setMessage('')
                if (listMessageChat.length > 19) {
                    const arrTemp = [...listMessageChat, respone.message]
                    arrTemp.splice(0, 1)
                    setListMessageChat(arrTemp)
                }
                else {
                    setListMessageChat([...listMessageChat, respone.message])
                }
                if (!listUserChat.find (user => user.id === userReceive.id))
                    getListUserChat()
            }
            catch (err) {
                return err.message
            }
        })()
    }
    const handleTextEnter = (e) => {
        if (e.key === 'Enter')
            handleSendMess()
    }

    useEffect(() => {
        if (Object.keys(userReceive).length) {
            getMessageChat()
        }

    }, [userSendID, userReceive])

    //nhan
    useEffect(() => {
        socket.on('addMessageToClient', msg => {
            const userReceiveId = userReceive.id || userReceive.user_id

            if (msg.from_user === userReceiveId) {
                if (listMessageChat.length > 19) {
                    const arrTemp = [...listMessageChat, msg]
                    arrTemp.splice(0, 1)
                    setListMessageChat(arrTemp)
                }
                else {
                    setListMessageChat([...listMessageChat, msg])
                }
            }
            else {
                if (!listUserChat.find (user => user.id === userReceive.id)) {
                    getListUserChat()
                }
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
            }
        })

        return () => socket.off('addMessageToClient')
    }, [socket])
    const handleOnScrollMessage = (e) => {
        if (e.currentTarget.scrollTop === 0 && pagination.page < pagination.totalPages - 1)
            getMessageChat(++ pagination.page)
        // e.currentTarget.scrollTop = 50
    }
    const [fileInput, setFileInput] = useState('')
    const [fileImg, setFileImg] = useState('')
    const [previewSource, setPreviewSource] = useState('')
    const handleChangeImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFileImg(e.target.files[0])
            setFileInput(e.target.value)
            previewFile(file)
        }
    }
    const previewFile = file => {
        if (!file)
            return
        const reader = new FileReader(file)
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setPreviewSource(reader.result)
        }
    }
    const handleDeleteImg = () => {
        setFileInput('')
        setPreviewSource('')
        setFileImg('')
    }
    const [isImageShow, setIsImageShow] = useState(false)
    const [imageLink, setImageLink] = useState('')
    const showFullImage = (src) => {
        setIsImageShow(!isImageShow)
        setImageLink(src)
    }
    const closeFullImage = () => {
        setIsImageShow(!isImageShow)
        setImageLink('')
    }
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }, [listMessageChat])
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
                    <header>{userReceive.id && `${userReceive.firsname} ${userReceive.lastname}`}</header>
                    <ul className="messageApp__messageArea-content" ref={divRef} onScroll = {handleOnScrollMessage}>
                        {
                            listMessageChat.length > 0 && listMessageChat.sort((item, item1) => item.id - item1.id).map(mess =>
                                <li key={mess.id} className = {`${mess.from_user === userSendID ? 'li-send' : 'li-receive'}`}>
                                    <span className = {`${mess.from_user === userSendID ? 'text-send' : 'text-receive'}`}>{mess.text}</span>
                                    <span>{mess.image && <img src={mess.image} onClick = {() => showFullImage(mess.image)}/>}</span>
                                    <span>{strftime('%d/%m/%Y, %H:%M:%S', convertTZ(mess.date))}</span>
                                </li>)
                        }
                        <div ref={messagesEndRef}></div>
                    </ul>
                    {
                        previewSource && (<div className="messageApp__messageArea-img">
                            <div><img src= {previewSource}/> <span onClick={handleDeleteImg}>X</span></div>
                        </div>)
                    }

                    <div className="messageApp__messageArea-input">
                        <input placeholder="Nhập tin nhắn" onChange={handleChangeMessage} onKeyDown = {handleTextEnter} value = {message}/>
                        <label className="messageApp__messageArea-input-img" htmlFor="chooseImgMess"><BsImage /></label>
                        <input type="file" onChange={handleChangeImage} value = {fileInput} id = "chooseImgMess" className='inputFile'/>
                        <button className="btnReview" onClick={handleSendMess}>Gửi</button>
                    </div>
                </div>
            </div>
            {isImageShow && <ImageFullScreen sourceImg = {imageLink} onClose = {closeFullImage}/>}
        </div>
    )
}

export default MesageApp
