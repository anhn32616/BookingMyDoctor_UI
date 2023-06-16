import React, { useEffect, useState } from 'react'
import images from 'assets'
import './index.scss'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { path } from 'constants/path'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from 'pages/Auth/userSlice'
import { FiMenu } from 'react-icons/fi'
import { useSystemAuthenticated } from 'hooks/useSystemAuthenticated'
import { IoIosNotifications } from 'react-icons/io'
import Notification from './components/Notification'
import { AiFillMessage } from 'react-icons/ai'
import useComponentVisible from 'hooks/useComponentVisible'
function Header() {
    const isSystem = useSystemAuthenticated()
    const location = useLocation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const userData = useSelector(state => state.user.profile)
    const notificationList = useSelector(
        state => state.notification.notificationList
    )
    const notificationCount = notificationList.filter(
        item => item.status === false
    ).length
    const [showDropdown, setShowDropdown] = useState(false)
    const toggleDropdownProfile = () => {
        setShowDropdown(!showDropdown)
    }
    const [showNotification, setShowNotification] = useState(false)
    const toggleNotifications = () =>
        setShowNotification(!showNotification)
    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }
    const handleProfile = () => {
        navigate(path.profile)
        setShowDropdown(false)
    }
    const handleSystem = () => {
        navigate(path.system)
        setShowDropdown(false)
    }
    const handleAppoinment = () => {
        navigate(path.myAppointment)
        setShowDropdown(false)
    }
    const handleToMessage = () => navigate(path.messageAppLayout)

    const { ref, isComponentVisible } = useComponentVisible(false)
    const { ref: refMenu, isComponentVisible: isComponentVisibleMenu } = useComponentVisible(false)
    useEffect(() => {
        if (isComponentVisible) setShowNotification(true)
        else setShowNotification(false)
    }, [isComponentVisible])
    useEffect(() => {
        if (isComponentVisibleMenu) setShowDropdown(true)
        else setShowDropdown(false)
    }, [isComponentVisibleMenu])
    return (
        <header className="header">
            <div className="header__left">
                <div className="header__logo">
                    <Link to={path.home}>
                        <img
                            src={images.logo}
                            alt="logo"
                            className="logo"
                        />
                    </Link>
                </div>
                <div className="header__menu-mobile">
                    <span>
                        <FiMenu />
                    </span>
                </div>
            </div>
            <div className="header__center">
                <ul className="header__menu">
                    <li className="header__menu-item">
                        <Link
                            to={path.headerSpecialist}
                            className="header__menu-item-link"
                        >
                            Chuyên khoa
                            <span>Tìm bác sĩ theo khoa</span>
                        </Link>
                    </li>
                    <li className="header__menu-item">
                        <Link
                            to={path.headerClinic}
                            className="header__menu-item-link"
                        >
                            Cơ sở y tế
                            <span>Chọn bác sĩ theo phòng khám</span>
                        </Link>
                    </li>
                    <li className="header__menu-item">
                        <Link
                            to={path.headerDoctor}
                            className="header__menu-item-link"
                        >
                            Bác sĩ
                            <span>Chọn bác sĩ giỏi</span>
                        </Link>
                    </li>
                </ul>
                <div className="header__logo-center">
                    <Link to={path.home}>
                        <img
                            src={images.logo}
                            alt="logo"
                            className="logo"
                        />
                    </Link>
                </div>
            </div>
            <div className="header__right">
                <div className="header__action">
                    {userData.id && (
                        <>
                            <div className="header__action-notify" ref={ref}>
                                <span className="header__action-notify-count">
                                    {notificationCount}
                                </span>
                                <span onClick={toggleNotifications}>
                                    <IoIosNotifications />
                                </span>

                                {showNotification && isComponentVisible && (
                                    <div className="header__action-notify-area">
                                        <Notification />
                                    </div>
                                )}
                            </div>
                            <div className="header__action-message">
                                <span onClick={handleToMessage}>
                                    <AiFillMessage />
                                </span>
                            </div>
                            <div className="header__profile" ref={refMenu}>
                                <img
                                    className="header__profile-img"
                                    src={userData.image}
                                    onClick={toggleDropdownProfile}
                                />
                                {showDropdown && isComponentVisibleMenu && (
                                    <ul className="header__profile-dropdown">
                                        {isSystem && (
                                            <li
                                                className="header__profile-dropdown-item"
                                                onClick={handleSystem}
                                            >
                                                Quản lí
                                            </li>
                                        )}

                                        <li
                                            className="header__profile-dropdown-item"
                                            onClick={handleProfile}
                                        >
                                            Trang cá nhân
                                        </li>
                                        {!isSystem && (
                                            <li
                                                className="header__profile-dropdown-item"
                                                onClick={
                                                    handleAppoinment
                                                }
                                            >
                                                Quản lí cuộc hẹn
                                            </li>
                                        )}

                                        <li
                                            className="header__profile-dropdown-item"
                                            onClick={handleLogout}
                                        >
                                            Đăng xuất
                                        </li>
                                    </ul>
                                )}
                            </div>
                        </>
                    )}
                    {!userData.email && (
                        <div className="header__action-auth">
                            {location.pathname === '/login' ? (
                                <Link to={path.register}>
                                    <button className="header__action-auth-button">
                                        Đăng ký
                                    </button>
                                </Link>
                            ) : (
                                <Link to={path.login}>
                                    <button className="header__action-auth-button">
                                        Đăng nhập
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
