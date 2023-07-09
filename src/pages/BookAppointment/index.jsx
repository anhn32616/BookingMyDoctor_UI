import React, { useEffect, useState } from 'react'
import './index.scss'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
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
import { addNotification } from 'utils/firebase/NotificationFb'
import listAdress from "../../assets/address.json";
import userApi from 'api/userApi'
import { unwrapResult } from '@reduxjs/toolkit'
import { update } from 'pages/Auth/userSlice'


function BookAppointment() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    const idSchedule = useParams().id
    const [scheduleDetail, setScheduleDetail] = useState({})
    const [doctorDetail, setDoctorDetail] = useState({})
    const [citySelected, setCitySelected] = useState();
    const [districtSelected, setDistrictSelected] = useState();
    const [wardSelected, setWardSelected] = useState();
    let isGetDataForEdit = true;
    const dispatch = useDispatch()


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
            phoneNumber: userData?.phoneNumber,
            email: userData?.email,
            fullname: userData?.fullName,
            gender: userData?.gender === true ? 'true' : 'false',
            birthday: userData?.birthDay?.split('T')[0],
            symptoms: '',
            user_id: userData?.id,
            scheduleId: idSchedule
        }
    })
    useEffect(() => {
        isGetDataForEdit = true;
        form.setValue('phoneNumber', userData?.phoneNumber)
        form.setValue('email', userData?.email)
        form.setValue('image', userData?.image)
        form.setValue('fullName', userData?.fullName)
        form.setValue('gender', userData?.gender == true ? 'true' : 'false')
        form.setValue('birthDay', userData?.birthDay?.split('T')[0])
        form.setValue('address', userData?.address)
        form.setValue('city', userData?.city)
        form.setValue('district', userData?.district)
        form.setValue('ward', userData?.ward)
        const city = listAdress.find(city => city.name === userData?.city);
        const district = city?.districts.find(d => d.name === userData?.district);
        setCitySelected(city);
        setDistrictSelected(district);
        setWardSelected(userData?.ward);
    }, [userData, form])

    useEffect(() => {
        if (!isGetDataForEdit) {
            setDistrictSelected(null);
            form.setFieldsValue({ "district": null })
        }
        // eslint-disable-next-line
    }, [citySelected])

    useEffect(() => {
        if (isGetDataForEdit) {
            isGetDataForEdit = false;
        } else {
            setWardSelected(null);
            form.setFieldsValue({ "ward": null })
        }
        // eslint-disable-next-line
    }, [districtSelected])

    const handleSubmit = async (value) => {
        updateInfo(value)

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
                const message = `Bệnh nhân ${userData.fullName} đã đặt lịch hẹn ngày ${strftime('%d/%m/%Y %Hh%M', new Date(scheduleDetail.startTime))}`
                addNotification(doctorDetail.user.id, message)
                navigate(path.myAppointment)
            } catch (err) {
                if (err.message)
                    toast.error(err.message, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 4000
                    });
                else
                    toast.error("Chỉ tài khoản bệnh nhân mới đặt được lịch", {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 4000
                    })
            }
        })()

    }

    const updateInfo = async (value) => {
        value.gender = value.gender === 'true' ? true : false;
        if (value.phoneNumber !== userData?.phoneNumber
            || value.fullName !== userData?.fullName
            || value.gender !== userData?.gender
            || value.address !== userData?.address
            || value.birthDay !== userData?.birthDay
            || value.city !== userData?.city
            || value.district !== userData?.district
            || value.ward !== userData?.ward) {
            const valueUpdateInfo = {
                'phoneNumber': value.phoneNumber,
                'fullName': value.fullName,
                'gender': value.gender,
                'address': value.address,
                'birthDay': value.birthDay,
                'city': value.city,
                'district': value.district,
                'ward': value.ward,
                'image': userData?.image
            }
            console.log('updateInfo', valueUpdateInfo);
            try {
                const datares = await dispatch(update(valueUpdateInfo))
                unwrapResult(datares)
            } catch (err) {
                console.log(err);
            }
        }
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
                                { label: 'Nam', value: true },
                                { label: 'Nữ', value: false }
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
                            name="birthDay"
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
                        <div className="select-group">
                            <header className="select-group__title">Tỉnh/Thành phố</header>
                            <select {...form.register('city')} onChange={(e) => setCitySelected(listAdress.find(a => a.name === e.target.value))}>
                                {listAdress.map(item => (
                                    <option value={item.name} key={item.code} selected={form.getValues('city') == item.name} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {citySelected && (<div className="form__element">
                        <div className="select-group">
                            <header className="select-group__title">Quận/Huyện</header>
                            <select {...form.register('district')} onChange={(e) => setDistrictSelected(citySelected.districts.find(a => a.name === e.target.value))}>
                                {citySelected.districts?.map((item) => (
                                    <option value={item.name} key={item.code} selected={form.getValues('districts') == item.name} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>)}
                    {districtSelected && (<div className="form__element">
                        <div className="select-group">
                            <header className="select-group__title">Xã/Phường</header>
                            <select {...form.register('ward')} onChange={(e) => setWardSelected(e.target.value)}>
                                {districtSelected.wards?.map((item) => (
                                    <option value={item.name} key={item.code} selected={form.getValues('ward') == item.name} >
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>)}
                    {wardSelected && <div className="form__element">
                        <InputField
                            name="address"
                            type="input"
                            form={form}
                            placeholder="Địa chỉ cụ thể"
                            icon={<MdLocationPin />}
                        />
                    </div>}
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
