/* eslint-disable no-useless-escape */
import { yupResolver } from '@hookform/resolvers/yup'
import authApi from 'api/authApi'
import InputField from 'components/InputFiled'
import RadioGroup from 'components/RadioGroup'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/

function Register() {
    const [disableButton, setDisabledButton] = useState(false)
    const navigate = useNavigate()
    const schema = yup.object().shape({
        fullName: yup.string().required('Vui lòng nhập họ và tên'),
        email: yup
            .string()
            .required('Vui lòng nhập Email')
            .email('Email không hợp lệ'),
        password: yup
            .string()
            .required('Vui lòng nhập mật khẩu')
            .min(5, 'Mật khẩu 5 - 15 kí tự')
            .max(15, 'Mật khẩu 5 - 15 kí tự'),
        // birthday: yup.string().required('Vui lòng nhập ngày sinh'),
        passwordConfirm: yup
            .string()
            .required('Vui lòng nhập lại mật khẩu')
            .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
        // phoneNumber: yup
        //     .string()
        //     .required('Vui lòng nhập số điện thoại')
        //     .matches(phoneRegExp, 'Vui lòng nhập số điện thoại')
        //     .min(10, 'Số điện thoại không hợp lệ')
        //     .max(10, 'Số điện thoại không hợp lệ'),
        // address: yup.string().required('Vui lòng nhập địa chỉ')
    })
    const form = useForm({
        defaultValues: {
            email: '',
            fullName: '',
            password: '',
            passwordConfirm: '',
            // phoneNumber: '',
            // gender: '0',
            // birthday: '',
            // address: ''
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = value => {
        console.log(value);
        const valueSubmit = {}
        valueSubmit.email = value.email;
        valueSubmit.password = value.password;
        valueSubmit.fullName = value.fullName;
        (async () => {
            try {
                setDisabledButton(true)
                // eslint-disable-next-line no-unused-vars
                const data = await authApi.signup(valueSubmit, {
                    header: {'Content-Type': 'application/json'},
                })
                toast.success(
                    'Đăng ký thành công, mời bạn vào mail để xác nhận',
                    {
                        position: toast.POSITION.BOTTOM_RIGHT,
                        autoClose: 5000
                    },
                )
                navigate('/login')
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
            setDisabledButton(false)
        })()
    }
    useEffect(() => {
        document.title = 'Đăng kí'
    }, [])
    return (
        <div className="authform">
            <div className="authform__content">
                <span className="authform__content-title">
                    Đăng ký
                </span>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className="authform__form-element">
                        <InputField
                            label="Họ và tên"
                            name="fullName"
                            type="input"
                            form={form}
                            placeholder="Họ và tên"
                        />
                    </div>
                    <div className="authform__form-element">
                        <InputField
                            label="Email"
                            name="email"
                            type="input"
                            form={form}
                            placeholder="Email"
                        />
                    </div>
                    {/* <div className="authform__form-element">
                        <InputField
                            label="Số điện thoại"
                            name="phoneNumber"
                            form={form}
                            placeholder="Số điện thoại"
                            type="input"
                        />
                    </div>
                    <div className="authform__form-element">
                        <RadioGroup
                            title="Giới tính"
                            name="gender"
                            form={form}
                            mode="gender"
                            optionData={[
                                { label: 'Nam', value: Number(1) },
                                { label: 'Nữ', value: Number(0) }
                            ]}
                        />
                    </div>
                    <div className="authform__form-element">
                        <InputField
                            label="Ngày sinh"
                            name="birthday"
                            form={form}
                            type="date"
                        />
                    </div>
                    <div className="authform__form-element">
                        <InputField
                            label="Địa chỉ"
                            name="address"
                            form={form}
                            placeholder="Địa chỉ"
                            type="input"
                        />
                    </div> */}
                    <div className="authform__form-element">
                        <InputField
                            label="Mật khẩu"
                            name="password"
                            form={form}
                            placeholder="Mật khẩu"
                            type="password"
                        />
                    </div>
                    <div className="authform__form-element">
                        <InputField
                            label="Nhập lại mật khẩu"
                            name="passwordConfirm"
                            form={form}
                            placeholder="Nhập lại mật khẩu"
                            type="password"
                        />
                    </div>
                    <div className="button-submit">
                        <button
                            type="submit"
                            className="button-submit-login"
                            disabled={disableButton}
                            // onClick={handleSubmitForm}
                        >
                            Đăng ký
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
