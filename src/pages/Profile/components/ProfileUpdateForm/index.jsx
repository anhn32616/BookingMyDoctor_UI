import InputField from 'components/InputFiled'
import RadioGroup from 'components/RadioGroup'
import React, { useEffect } from 'react'
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
import { yupResolver } from '@hookform/resolvers/yup'
import PreviewUploadImg from 'components/PreviewUploadImg'
import { toast } from 'react-toastify'
import { update } from 'pages/Auth/userSlice'
import { unwrapResult } from '@reduxjs/toolkit'
// eslint-disable-next-line no-useless-escape
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
function ProfileUpdateForm({ onClose }) {
    const userData = useSelector(state => state.user.profile)
    const dispatch = useDispatch()
    const schema = yup.object().shape({
        phoneNumber: yup
            .string()
            .required('Vui lòng nhập số điện thoại')
            .matches(phoneRegExp, 'Vui lòng nhập số điện thoại')
            .min(10, 'Số điện thoại không hợp lệ')
            .max(10, 'Số điện thoại không hợp lệ'),
        firsname: yup.string().required('Vui lòng nhập họ'),
        lastname: yup.string().required('Vui lòng nhập tên'),
        email: yup
            .string()
            .required('Vui lòng nhập Email')
            .email('Email không hợp lệ'),
        birthday: yup.string().required('Vui lòng nhập ngày sinh'),
        address: yup.string().required('Vui lòng nhập địa chỉ')
    })
    const form = useForm({
        defaultValues: {
            image: userData.image,
            phoneNumber: '' || userData.phoneNumber,
            email: '' || userData.email,
            firsname: '' || userData.firsname,
            lastname: '' || userData.lastname,
            gender: userData.gender === true ? '1' : '0',
            birthday: userData.birthDay.split('T')[0],
            address: userData.address
        },
        resolver: yupResolver(schema)
    })
    useEffect(() => {
        form.setValue('phoneNumber', userData.phoneNumber)
        form.setValue('address', userData.email)
        form.setValue('firsname', userData.firsname)
        form.setValue('lastname', userData.lastname)
        form.setValue('gender', userData.gender == 1 ? '1' : '0')
        form.setValue('birthday', userData.birthday.split('T')[0])
        form.setValue('address', userData.address)
    }, [userData, form])
    const handleSubmitForm = value => {
        const submitValue = { ...value, id: userData.id }
        submitValue.gender = submitValue.gender === '1' ? 1 : 0
        const formData = new FormData()
        for (let key in submitValue) {
            formData.append(key, submitValue[key])
        }
        (async () => {
            try {
                const datares = await dispatch(update(formData))
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
    return (
        <div className="profileUpdateForm">
            <div className="profileUpdateForm__container">
                <h1>Chỉnh sửa thông tin</h1>
                <form
                    className="profileUpdateForm__form"
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                    <div className="authform__form-element">
                        <PreviewUploadImg form={form} name="image" />
                    </div>
                    <div className="form__element">
                        <div>
                            <InputField
                                name="fullname"
                                type="input"
                                form={form}
                                placeholder="Họ"
                                icon={<FaUser />}
                            />
                        </div>
                    </div>
                    <div className="form__element">
                        <RadioGroup
                            name="gender"
                            mode = "gender"
                            form={form}
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
                            icon={<MdEmail />}
                            disabled = {true}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="birthday"
                            type="date"
                            form={form}
                            placeholder="Ngày sinh"
                            icon=<BsFillCalendarFill />
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
                        <InputField
                            name="address"
                            type="input"
                            form={form}
                            placeholder="Địa chỉ"
                            icon={<MdLocationPin />}
                        />
                    </div>
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