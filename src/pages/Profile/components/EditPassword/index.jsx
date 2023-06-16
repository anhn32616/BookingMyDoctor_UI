import InputField from 'components/InputFiled'
import React from 'react'
import { useForm } from 'react-hook-form'
import './index.scss'
import { RiLockPasswordFill } from 'react-icons/ri'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import userApi from 'api/userApi'
import { logout } from 'pages/Auth/userSlice'
function EditPassword({ onClose }) {
    const dispatch = useDispatch()
    const { id } = useSelector(state => state.user.profile)
    const schema = yup.object().shape({
        password: yup
            .string()
            .required('Nhập mật khẩu cũ')
            .min(5, 'Mật khẩu 5 - 15 kí tự')
            .max(15, 'Mật khẩu 5 - 15 kí tự'),
        newPassword: yup
            .string()
            .required('Nhập mật khẩu mới')
            .min(5, 'Mật khẩu 5 - 15 kí tự')
            .max(15, 'Mật khẩu 5 - 15 kí tự'),
        retypeNewPassword: yup
            .string()
            .required('Vui lòng nhập lại mật khẩu')
            .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp')
    })
    const form = useForm({
        defaultValues: {
            password: '',
            newPassword: '',
            retypeNewPassword: ''
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = value => {
        const valueSubmit = { id: id, ...value }
        delete valueSubmit.retypeNewPassword
        ;(async () => {
            try {
                await userApi.changePassword(valueSubmit, {
                    headers: {
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    }
                })
                toast.success('Thay đổi mật khẩu thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                dispatch(logout())
            } catch (error) {
                toast.error(error.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    return (
        <div className="editPassword">
            <div className="editPassword__container">
                <h1>Thay đổi mật khẩu</h1>
                <form onSubmit={form.handleSubmit(handleSubmitForm)}>
                    <div className="form__element">
                        <InputField
                            name="password"
                            type="password"
                            form={form}
                            placeholder="Mật khẩu cũ"
                            icon={<RiLockPasswordFill />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="newPassword"
                            type="password"
                            form={form}
                            placeholder="Mật khẩu mới"
                            icon={<RiLockPasswordFill />}
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            name="retypeNewPassword"
                            type="password"
                            form={form}
                            placeholder="Nhập lại mật khẩu mới"
                            icon={<RiLockPasswordFill />}
                        />
                    </div>
                    <div className="editPassword__action">
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

export default EditPassword
