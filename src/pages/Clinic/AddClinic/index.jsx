import { yupResolver } from '@hookform/resolvers/yup'
import clinicApi from 'api/clinicApi'
import InputField from 'components/InputFiled'
import PreviewUploadImg from 'components/PreviewUploadImg'
import { path } from 'constants/path'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import './index.scss'
function AddClinic() {
    const navigate = useNavigate()
    const schema = yup.object().shape({
        name: yup.string().required('Thêm tên phòng khám'),
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
                await clinicApi.addClinic(
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
                toast.success('Thêm phòng khám thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                navigate(path.clinicManagement)
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Thêm phòng khám'
    }, [])
    return (
        <div className="addClinic">
            <div className="addClinic__container">
                <header>Thêm phòng khám mới</header>
                <form
                    className="form addClinic__form"
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                    <div className="form__element">
                        <PreviewUploadImg form={form} name="image" />
                    </div>
                    <div className="form__element">
                        <InputField
                            form={form}
                            name="name"
                            placeholder="Tên phòng khám"
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
                    <div className="addClinic__action">
                        <button type="submit" className="btnSuccess">
                            Thêm phòng khám
                        </button>
                        <button
                            onClick={() => navigate(path.clinicManagement)}
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

export default AddClinic