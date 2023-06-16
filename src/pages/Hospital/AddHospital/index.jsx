import { yupResolver } from '@hookform/resolvers/yup'
import hospitalApi from 'api/hospitalApi'
import InputField from 'components/InputFiled'
import PreviewUploadImg from 'components/PreviewUploadImg'
import { path } from 'constants/path'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import './index.scss'
function AddHospital() {
    const navigate = useNavigate()
    const schema = yup.object().shape({
        name: yup.string().required('Thêm tên bệnh viện'),
        street: yup.string().required('Thêm đường'),
        city: yup.string().required('Thêm tỉnh, thành phố')
    })
    const form = useForm({
        defaultValues: {
            image: '',
            name: '',
            street: '',
            city: ''
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = value => {
        const formData = new FormData()
        for (let key in value) {
            formData.append(key, value[key])
        }
        (async () => {
            try {
                await hospitalApi.addHospital(
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `${localStorage.getItem(
                                'access_token'
                            )}`
                        }
                    }
                )
                toast.success('Thêm bệnh viện thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                navigate(path.hospitalManagement)
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Thêm bệnh viện'
    }, [])
    return (
        <div className="addHospital">
            <div className="addHospital__container">
                <header>Thêm bệnh viện mới</header>
                <form
                    className="form addHospital__form"
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                    <div className="form__element">
                        <PreviewUploadImg form={form} name="image" />
                    </div>
                    <div className="form__element">
                        <InputField
                            form={form}
                            name="name"
                            placeholder="Tên bệnh viện"
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            form={form}
                            name="street"
                            placeholder="Đường"
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            form={form}
                            name="city"
                            placeholder="Tỉnh, thành phố"
                        />
                    </div>
                    <div className="addHospital__action">
                        <button type="submit" className="btnSuccess">
                            Thêm bệnh viện
                        </button>
                        <button
                            onClick={() => navigate(path.hospitalManagement)}
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

export default AddHospital