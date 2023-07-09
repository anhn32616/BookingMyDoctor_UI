import InputField from 'components/InputFiled'
import RadioGroup from 'components/RadioGroup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
    BsFillCalendarFill,
    BsFillTelephoneFill
} from 'react-icons/bs'
import { FaUser } from 'react-icons/fa'
import { MdEmail, MdLocationPin } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import './index.scss'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { update } from 'pages/Auth/userSlice'
import { unwrapResult } from '@reduxjs/toolkit'
import ImageUpload from 'components/ImageUpload/ImageUpload'
import listAdress from "../../../../assets/address.json";
import uploadImageApi from 'api/uploadImageApi'

// eslint-disable-next-line no-useless-escape
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
function ProfileUpdateForm({ onClose }) {
    let isGetDataForEdit = true;
    const [citySelected, setCitySelected] = useState();
    const [districtSelected, setDistrictSelected] = useState();
    const [wardSelected, setWardSelected] = useState();
    const userData = useSelector(state => state.user.profile)
    const [image, setImage] = useState();
    const dispatch = useDispatch()
    // const schema = yup.object().shape({
    //     phoneNumber: yup
    //         .string()
    //         .required('Vui lòng nhập số điện thoại')
    //         .matches(phoneRegExp, 'Vui lòng nhập số điện thoại')
    //         .min(10, 'Số điện thoại không hợp lệ')
    //         .max(10, 'Số điện thoại không hợp lệ'),
    //     fullName: yup.string().required('Vui lòng nhập Họ và tên'),
    //     email: yup
    //         .string()
    //         .required('Vui lòng nhập Email')
    //         .email('Email không hợp lệ'),
    //     birthday: yup.string().required('Vui lòng nhập ngày sinh'),
    //     address: yup.string().required('Vui lòng nhập địa chỉ cụ thể')
    // })
    const form = useForm()
    useEffect(() => {
        isGetDataForEdit = true;
        form.setValue('phoneNumber', userData.phoneNumber)
        form.setValue('email', userData.email)
        form.setValue('image', userData.image)
        form.setValue('fullName', userData.fullName)
        form.setValue('gender', userData.gender == true ? 'true' : 'false')
        form.setValue('birthDay', userData.birthDay?.split('T')[0])
        form.setValue('address', userData.address)
        form.setValue('city', userData.city)
        form.setValue('district', userData.district)
        form.setValue('ward', userData.ward)
        const city = listAdress.find(city => city.name === userData?.city);
        const district = city?.districts.find(d => d.name === userData?.district);
        setCitySelected(city);
        setDistrictSelected(district);
        setWardSelected(userData?.ward);
    }, [userData, form])
    const handleSubmitForm = async () => {
        const submitValue = {...form.getValues()}
        if (image) submitValue.image = await uploadImage();
        submitValue.gender = submitValue.gender === 'true' ? true : false;
            (async () => {
                try {
                    const datares = await dispatch(update(submitValue))
                    unwrapResult(datares)
                    toast.success('Cập nhật thành công', {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 2000
                    })
                    onClose()
                } catch (err) {
                    toast.error(err.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                }
            })()
    }

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

    const uploadImage = async () => {
        try {
            console.log(image);
            const url = await uploadImageApi.upload(image);
            return url;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="profileUpdateForm">
            <div className="profileUpdateForm__container">
                <h1>Chỉnh sửa thông tin</h1>
                <form
                    className="profileUpdateForm__form"
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                    <ImageUpload image={image} setImage={setImage} currentImage={userData?.image} />
                    <div className="form__element">
                        <div>
                            <InputField
                                name="fullName"
                                type="input"
                                form={form}
                                placeholder="Họ và tên"
                                icon={<FaUser />}
                            />
                        </div>
                    </div>
                    <div className="form__element">
                        <RadioGroup
                            name="gender"
                            mode="gender"
                            form={form}
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
                            icon={<MdEmail />}
                            disabled={true}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="birthDay"
                            type="date"
                            form={form}
                            placeholder="Ngày sinh"
                            icon={<BsFillCalendarFill />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="phoneNumber"
                            type="input"
                            form={form}
                            placeholder="Số điện thoại"
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
                    </div> }
                    <div className="profileUpdateForm__action">
                        <button className="btnSuccess" type="submit">
                            Cập nhật
                        </button>
                        <button
                            onClick={onClose}
                            className="btnCancel"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ProfileUpdateForm