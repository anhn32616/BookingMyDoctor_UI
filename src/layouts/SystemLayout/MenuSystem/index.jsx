import React from 'react'
import { path } from 'constants/path'
import { NavLink } from 'react-router-dom'
import './index.scss'
import {
    FaClinicMedical,
    FaHospital,
    FaUserAlt,
    FaUserNurse
} from 'react-icons/fa'
import { MdDashboard, MdFolderSpecial } from 'react-icons/md'
import { AiFillSchedule } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import { RiMoneyDollarCircleFill } from 'react-icons/ri'

function MenuSystem() {
    const userData = useSelector(state => state.user.profile)
    return (
        <ul className="menuSystem">
            {userData.role.name === 'ROLE_ADMIN' &&<li className="menuSystem-item">
                <NavLink
                    to={path.dashBoard}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <MdDashboard />
                    </span>
                    Tổng quan
                </NavLink>
            </li>}
            <li className="menuSystem-item">
                <NavLink
                    to={path.clinicManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <FaClinicMedical />
                    </span>
                    Phòng khám
                </NavLink>
            </li>
            <li className="menuSystem-item">
                <NavLink
                    to={path.specialistManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <MdFolderSpecial />
                    </span>
                    Chuyên khoa
                </NavLink>
            </li>
            <li className="menuSystem-item">
                <NavLink
                    to={path.hospitalManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <FaHospital />
                    </span>
                    Bệnh viện
                </NavLink>
            </li>
            <li className="menuSystem-item">
                <NavLink
                    to={path.patientManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <FaUserAlt />
                    </span>
                    Bệnh nhân
                </NavLink>
            </li>
            <li className="menuSystem-item">
                <NavLink
                    to={path.doctorManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <FaUserNurse />
                    </span>
                    Bác sĩ
                </NavLink>
            </li>
            <li className="menuSystem-item">
                <NavLink
                    to={path.scheduleManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <AiFillSchedule />
                    </span>
                    Lịch khám
                </NavLink>
            </li>
            {userData.role.name === 'ROLE_DOCTOR' && (
                <li className="menuSystem-item">
                    <NavLink
                        to={path.appointmentManagement}
                        className={({ isActive }) =>
                            isActive
                                ? 'menuSystem-item-link--active menuSystem-item-link'
                                : 'menuSystem-item-link'
                        }
                    >
                        <span className="menuSystem-item-icon">
                            <AiFillSchedule />
                        </span>
                        Cuộc hẹn
                    </NavLink>
                </li>
            )}
            {userData.role.name === 'ROLE_ADMIN' && (
                <li className="menuSystem-item">
                    <NavLink
                        to={path.appointmentManagement}
                        className={({ isActive }) =>
                            isActive
                                ? 'menuSystem-item-link--active menuSystem-item-link'
                                : 'menuSystem-item-link'
                        }
                    >
                        <span className="menuSystem-item-icon">
                            <AiFillSchedule />
                        </span>
                        Cuộc hẹn
                    </NavLink>
                </li>
            )}
            <li className="menuSystem-item">
                <NavLink
                    to={path.revenueManagement}
                    className={({ isActive }) =>
                        isActive
                            ? 'menuSystem-item-link--active menuSystem-item-link'
                            : 'menuSystem-item-link'
                    }
                >
                    <span className="menuSystem-item-icon">
                        <RiMoneyDollarCircleFill />
                    </span>
                    Doanh thu
                </NavLink>
            </li>
        </ul>
    )
}

export default MenuSystem
