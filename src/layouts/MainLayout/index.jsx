import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Header from 'components/Header'
import Footer from 'components/Footer'
import './index.scss'
import images from 'assets'
import { Outlet, useNavigate } from 'react-router-dom'
import { BsChatSquareDots } from 'react-icons/bs'
MainLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
}

function MainLayout() {
    const navigate = useNavigate()
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
            <div className="mainlayout-content--iconMess">
                <span onClick={() => navigate(`/messageApp/${2}`)}><BsChatSquareDots /></span>
            </div>
            <Footer />
        </>
    )
}

export default MainLayout
