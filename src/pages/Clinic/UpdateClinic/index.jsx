import React, { useEffect } from 'react'
import * as yup from 'yup'
import './index.scss'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import clinicApi from 'api/clinicApi'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-toastify'
import { path } from 'constants/path'
import PreviewUploadImg from 'components/PreviewUploadImg'
import InputField from 'components/InputFiled'

function UpdateClinic() {
    const location = useLocation()
    const data = location.state.clinicItem
    const navigate = useNavigate()
    const schema = yup.object().shape({
        name: yup.string().required('Thêm tên phòng khám'),
        street: yup.string().required('Thêm đường'),
        city: yup.string().required('Thêm tỉnh, thành phố')
    })
    const form = useForm({
        defaultValues: {
            id: data.id,
            image: data.image,
            name: data.name,
            street: data.street,
            city: data.city
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
                await clinicApi.updateClinic(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    }
                })
                toast.success('Cập nhật phòng khám thành công', {
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
        document.title = 'Cập nhật phòng khám'
    }, [])
    return (
        <div className="updateClinic">
            <div className="updateClinic__container">
                <header>Cập nhật phòng khám</header>
                <form
                    className="form updateClinic__form"
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
                    <div className="updateClinic__action">
                        <button type="submit" className="btnSuccess">
                            Cập nhật phòng khám
                        </button>
                        <button
                            onClick={() =>
                                navigate(path.clinicManagement)
                            }
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

export default UpdateClinic