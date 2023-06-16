
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import InputField from 'components/InputFiled'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import userApi from 'api/userApi'
import { toast } from 'react-toastify'

function ForgotPassWordForm() {
    const schema = yup.object().shape({
        email: yup
            .string()
            .required('Vui lòng nhập Email')
            .email('Email không hợp lệ')
    })
    const form = useForm({
        defaultValues: {
            email: ''
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = value => {
        (async () => {
            try {
                await userApi.resetPassword(value)
                toast.success('Reset mật khẩu thành công, mời vào mail xem mật khẩu', {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000
                })
            }
            catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT,
                    autoClose: 1000
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Quên mật khẩu'
    }, [])
    return (
        <div className="authform">
            <div className="authform__content">
                <span className="authform__content-title">
                    Lấy mật khẩu
                </span>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className="authform__form-element">
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            form={form}
                            placeholder="Nhập địa chỉ Email"
                        />
                    </div>
                    <div className="button-submit">
                        <button
                            type="submit"
                            className="button-submit-login"
                        >
                            Lấy mật khẩu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ForgotPassWordForm
