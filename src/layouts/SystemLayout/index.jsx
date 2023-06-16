import images from 'assets'
import { path } from 'constants/path'
import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import './index.scss'
import MenuSystem from './MenuSystem'

function SystemLayout() {
    return (
        <div className="systemLayout">
            <div className="systemLayout__container">
                <div className="systemLayout__left">
                    <div className="systemLayout__logo">
                        <Link to={path.home}>
                            <img
                                src={images.logo}
                                alt="logo"
                                className="logo"
                            />
                        </Link>
                    </div>
                    <div className="systemLayout__menu">
                        <MenuSystem />
                    </div>
                </div>

                <div className="systemLayout__content">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default SystemLayout