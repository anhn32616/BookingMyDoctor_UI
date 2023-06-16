import React, { useEffect, useState } from 'react'
import './index.scss'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import InputField from 'components/InputFiled'
import { FaUser } from 'react-icons/fa'
import RadioGroup from 'components/RadioGroup'
import { MdEmail, MdLocationPin } from 'react-icons/md'
import {
    BsFillCalendarFill,
    BsFillTelephoneFill
} from 'react-icons/bs'
import { AiFillPlusCircle } from 'react-icons/ai'
import { useNavigate, useParams } from 'react-router-dom'
import scheduleApi from 'api/scheduleApi'
import strftime from 'strftime'
import convertTZ from 'utils/convertTZ'
import doctorApi from 'api/doctorApi'
import Loading from 'components/Loading'
import appointmentApi from 'api/appointmentApi'
import { toast } from 'react-toastify'
import { path } from 'constants/path'

function BookAppointment() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const idSchedule = useParams().id
    const [scheduleDetail, setScheduleDetail] = useState({})
    const [doctorDetail, setDoctorDetail] = useState({})
    const getDoctorDetail = async id => {
        try {
            const respone = await doctorApi.getDetailDoctor(id)
            setDoctorDetail(respone.data)
        } catch (err) {
            return err.message
        }
    }
    useEffect(() => {
        (async () => {
            try {
                const respone = await scheduleApi.getDetailSchedule(
                    idSchedule
                )
                setScheduleDetail(respone.data)
                await getDoctorDetail(respone.data.doctorId)
                setIsLoading(false)
            } catch (err) {
                return err.message
            }
        })()
    }, [idSchedule])
    const userData = useSelector(state => state.user.profile)
    const form = useForm({
        defaultValues: {
            phoneNumber: userData.phoneNumber,
            email: userData.email,
            fullname: userData.fullName,
            gender: userData.gender === true ? '1' : '0',
            birthday: userData.birthDay.split('T')[0],
            address: [userData.address, userData.ward, userData.district, userData.city].join(', '),
            symptoms: '',
            user_id: userData.id,
            scheduleId: idSchedule
        }
    })
    const handleSubmit = value => {
        const valueSubmit = {
            scheduleId: Number(value.scheduleId),
            symptoms: value.symptoms
        };
        (async () => {
            try {
                await appointmentApi.createAppointment(
                    valueSubmit
                )
                toast.success('Tạo cuộc hẹn thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                navigate(path.myAppointment)
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Đặt lịch khám'
    }, [])
    if (isLoading) return <Loading />
    return (
        <div className="bookAppointment">
            <div className="bookAppointment__container">
                <header className="bookAppointment__Info">
                    <div className="bookAppointment__Info-img">
                        <img
                            src={doctorDetail.user.image}
                            alt="bacsi"
                        />
                    </div>
                    <div className="bookAppointment__Info-content">
                        <span>Đặt lịch khám</span>
                        <span>
                            Bác sĩ: {doctorDetail.user.fullName}
                        </span>
                        <span>
                            Chuyên khoa: {doctorDetail.speciatly.name}
                        </span>
                        <span>
                            {scheduleDetail.id &&
                                <h4>{`${strftime(
                                    '%d/%m/%Y',
                                    convertTZ(scheduleDetail.endTime)
                                )} ${strftime(
                                    '%H:%M',
                                    convertTZ(scheduleDetail.startTime)
                                )} - ${strftime(
                                    '%H:%M',
                                    convertTZ(scheduleDetail.endTime)
                                )}`}</h4>}
                        </span>
                    </div>
                </header>
                <form
                    className="form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <div className="form__element">
                        <div>
                            <InputField
                                name="fullname"
                                type="input"
                                form={form}
                                placeholder="Họ và tên"
                                disabled={true}
                                icon={<FaUser />}
                            />
                        </div>
                    </div>
                    <div className="form__element">
                        <RadioGroup
                            name="gender"
                            form={form}
                            disabled={false}
                            mode="gender"
                            optionData={[
                                { label: 'Nam', value: Number(1) },
                                { label: 'Nữ', value: Number(0) }
                            ]}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="email"
                            type="email"
                            form={form}
                            placeholder="Email"
                            disabled={true}
                            icon={<MdEmail />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="birthday"
                            type="date"
                            form={form}
                            placeholder="Ngày sinh"
                            disabled={false}
                            icon={<BsFillCalendarFill />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="phoneNumber"
                            type="input"
                            form={form}
                            placeholder="Số điện thoại"
                            disabled={false}
                            icon={<BsFillTelephoneFill />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="address"
                            type="input"
                            form={form}
                            placeholder="Địa chỉ"
                            disabled={false}
                            icon={<MdLocationPin />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="symptoms"
                            type="textarea"
                            form={form}
                            placeholder="Lí do khám"
                            icon={<AiFillPlusCircle />}
                        />
                    </div>
                    <div className="form__price">
                        <div className="form__price-price">
                            <span>Giá khám</span>
                            <span>{scheduleDetail.cost} đ</span>
                        </div>
                        <div className="form__price-book">
                            <span>Phí đặt lịch</span>
                            <span>Miễn phí</span>
                        </div>
                        <div className="form__price-total">
                            <span>Tổng cộng</span>
                            <span>{scheduleDetail.cost} đ</span>
                        </div>
                    </div>
                    <span className="description">
                        Quý khách vui lòng điền đầy đủ thông tin để
                        tiết kiệm thời gian làm thủ tục khám
                    </span>
                    <div className="form__btn">
                        <button className="btnSuccess btnBook">
                            Xác nhận đặt lịch khám
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BookAppointment
