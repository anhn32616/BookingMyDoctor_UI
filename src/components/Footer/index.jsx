import React from 'react'
import images from 'assets'
import './index.scss'

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer__app-info">
                    <div className="footer__app-info-logo">
                        <img
                            src={images.logo}
                            alt="logo"
                            className="logo"
                        />
                    </div>
                    <span className="footer__app-info-companyname">
                        Công ty cổ phần công nghệ BookingMyDoctor
                    </span>
                    <span>
                        60 Ngô Sĩ Liên, Hòa Minh, Liên Chiểu, Đà Nẵng
                    </span>
                </div>
                <div className="footer__services">
                    <span className="footer__services-title">
                        Dịch vụ
                    </span>
                    <ul className="footer__services-list">
                        <li className="footer__services-item">
                            <a
                                href="/#"
                                className="footer__services__link"
                            >
                                Tìm bác sĩ theo chuyên khoa
                            </a>
                        </li>
                        <li className="footer__services-item">
                            <a
                                href="/#"
                                className="footer__services__link"
                            >
                                Tìm bác sĩ giỏi
                            </a>
                        </li>
                        <li className="footer__services-item">
                            <a
                                href="/#"
                                className="footer__services__link"
                            >
                                Tìm bác sĩ theo bệnh viện, phòng khám
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="footer__support">
                    <span className="footer__services-title">
                        Hỗ trợ
                    </span>
                    <span className="footer__support-hotline">
                        Hotline: 1900-9999
                    </span>
                    <span className="footer__support-time">
                        8:30 - 20:30 (T2 đến T7)
                    </span>
                    <span className="footer__support-customer">
                        cskh@bookmydoctor.com
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
