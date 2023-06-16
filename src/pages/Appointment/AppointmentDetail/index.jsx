import InputShow from 'components/InputShow'
import React from 'react'
import { AiFillStar } from 'react-icons/ai'
import { useSelector } from 'react-redux'
import convertTZ7Str from 'utils/convertTZ7Str'
import './index.scss'

function AppointmentDetail({
    appointmentData,
    onClose,
    confirmAppointment
}) {
    const userData = useSelector(state => state.user.profile)
    const handleOnClick = e => {
        if (e.target.className === 'appointmentDetail') onClose()
    }
    const arr = [1, 2, 3, 4, 5]
    return (
        <div className="appointmentDetail" onClick={handleOnClick}>
            <div className="appointmentDetail__container">
                <header>
                    <span>Thông tin cuộc hẹn</span>
                    {appointmentData.status.id === 1 && (
                        <span className="appointmentDetail__status-pending">
                            Chờ xử lí
                        </span>
                    )}
                    {appointmentData.status.id === 2 && (
                        <span className="appointmentDetail__status-confirm">
                            Đã chấp nhận
                        </span>
                    )}
                    {appointmentData.status.id === 3 && (
                        <span className="appointmentDetail__status-confirm">
                            Hoàn thành
                        </span>
                    )}
                    {appointmentData.status.id === 4 && (
                        <span className="appointmentDetail__status-cancel">
                            Đã hủy
                        </span>
                    )}
                </header>
                <div className="appointmentDetail__content">
                    <div className="appointmentDetail__content-rating">
                        {appointmentData.rating && arr.map(item => {
                            if (
                                item <= appointmentData.rating
                            ) {
                                return (
                                    <span key={item}>
                                        <AiFillStar className="star icon__active" />
                                    </span>
                                )
                            }
                            return (
                                <span key={item}>
                                    <AiFillStar className="star" />
                                </span>
                            )
                        })}
                    </div>
                    <div className="appointmentDetail__content-row">
                        <div>
                            <InputShow
                                title="Bệnh nhân"
                                content={`${appointmentData.patient.user.firsname} ${appointmentData.patient.user.lastname}`}
                            />
                        </div>
                        <div>
                            <InputShow
                                title="Điện thoại"
                                content={
                                    appointmentData.patient.user
                                        .phoneNumber
                                }
                            />
                        </div>
                        <div>
                            <InputShow
                                title="Email"
                                content={
                                    appointmentData.patient.user.email
                                }
                            />
                        </div>
                    </div>
                    <div className="appointmentDetail__content-row">
                        <div>
                            <InputShow
                                title="Ngày sinh"
                                content={
                                    appointmentData.patient.user.birthday.split(
                                        'T'
                                    )[0]
                                }
                            />
                        </div>
                        <div>
                            <InputShow
                                title="Giới tính"
                                content={
                                    appointmentData.patient.user
                                        .gender
                                        ? 'Nam'
                                        : 'Nữ'
                                }
                            />
                        </div>
                        <div>
                            <InputShow
                                title="Địa chỉ"
                                content={
                                    appointmentData.patient.user
                                        .address
                                }
                            />
                        </div>
                    </div>
                    <div className="appointmentDetail__content-row">
                        <div>
                            <InputShow
                                title="Ngày khám"
                                content={
                                    convertTZ7Str(
                                        appointmentData.schedule.begin
                                    ).split('T')[0]
                                }
                            />
                        </div>
                        <div>
                            <InputShow
                                title="Thời gian"
                                content={`${
                                    convertTZ7Str(
                                        appointmentData.schedule.begin
                                    ).split('T')[1]
                                } - ${
                                    convertTZ7Str(
                                        appointmentData.schedule.end
                                    ).split('T')[1]
                                }`}
                            />
                        </div>
                        <div>
                            <InputShow
                                title="Giá khám"
                                content={
                                    appointmentData.schedule.cost
                                }
                            />
                        </div>
                    </div>
                    <div className="appointmentDetail__content-row">
                        <div>
                            <InputShow
                                title="Triệu chứng"
                                content={appointmentData.symptoms}
                            />
                        </div>
                    </div>
                    {(userData.role.name === 'ROLE_ADMIN' ||
                        userData.role.name === 'ROLE_PATIENT') && (
                        <>
                            <div className="appointmentDetail__content-row">
                                <div>
                                    <InputShow
                                        title="Tên bác sĩ"
                                        content={`${appointmentData.schedule.doctor.user.firsname} ${appointmentData.schedule.doctor.user.lastname}`}
                                    />
                                </div>
                                <div>
                                    <InputShow
                                        title="Điện thoại"
                                        content={
                                            appointmentData.schedule
                                                .doctor.user
                                                .phoneNumber
                                        }
                                    />
                                </div>
                                <div>
                                    <InputShow
                                        title="Email"
                                        content={
                                            appointmentData.schedule
                                                .doctor.user.email
                                        }
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    {userData.role.name === 'ROLE_DOCTOR' &&
                        appointmentData.status.id === 1 && (
                        <div className="appointmentDetail__content-row-footer">
                            <div>
                                <button
                                    className="btnSuccess"
                                    onClick={() => {
                                        confirmAppointment(
                                            appointmentData.id
                                        )
                                        onClose()
                                    }}
                                >
                                    Chấp nhận lịch khám
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AppointmentDetail
