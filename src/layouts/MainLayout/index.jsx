import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Header from 'components/Header'
import Footer from 'components/Footer'
import './index.scss'
import images from 'assets'
import { Outlet, useNavigate } from 'react-router-dom'
import BoxChat from 'components/chat/BoxChat'
import { useSelector } from 'react-redux'

MainLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
}

function MainLayout() {
    const navigate = useNavigate()
  const currentUser = useSelector(states => states.user.profile)
    return (
        <>
            <Header />
            <div className="mainlayout-content"><Outlet /></div>
            <div className="mainlayout-banner">
                <div className="mainlayout-banner-content">
                    <div className="mainlayout-banner-content-slogan">
                        <div className="mainlayout-banner-content-slogan-content">
                            <span>Know Your Health</span>
                            <span>
                                Trải nghiệm ứng dụng BookingMyDoctor
                            </span>
                        </div>
                    </div>
                    <div className="mainlayout-banner-content-img">
                        <img
                            src={images.bannerHand}
                            alt="hand-banner"
                        />
                    </div>
                </div>
            </div>
            {currentUser && <BoxChat/>}
            <Footer />
        </>
    )
}

export default MainLayout
