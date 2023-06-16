import React, { useEffect } from 'react'
import ProfileInfo from './components/ProfileInfo'
import './index.scss'
function Profile() {
    useEffect(() => {
        document.title = 'Trang cá nhân'
    }, [])
    return (
        <div className="profile">
            <ProfileInfo />
        </div>
    )
}

export default Profile
