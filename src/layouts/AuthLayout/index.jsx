import React from 'react'
import PropTypes from 'prop-types'
import Header from 'components/Header'
import Footer from 'components/Footer'
import './index.scss'
import images from '../../assets'
import { Outlet } from 'react-router-dom'
AuthLayout.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ])
}

function AuthLayout() {
    return (
        <>
            <Header />
            <div className="content-layout">
                <div className="content-layout-content">
                    <div className="content-layout-content-banner">
                        <img
                            src={images.bannerAuth}
                            alt="banner"
                            className="content-layout-banner-img"
                        />
                    </div>
                    <div className="content-layout-content-form">
                        <Outlet />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AuthLayout
