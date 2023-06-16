import { yupResolver } from '@hookform/resolvers/yup'
import specialistApi from 'api/specialistApi'
import InputField from 'components/InputFiled'
import PreviewUploadImg from 'components/PreviewUploadImg'
import { path } from 'constants/path'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import * as yup from 'yup'
import './index.scss'

function AddSpecialist() {
    const navigate = useNavigate()
    const schema = yup.object().shape({
        name: yup.string().required('Thêm tên chuyên khoa'),
        description: yup.string().required('Thêm mô tả')
    })
    const form = useForm({
        defaultValues: {
            image: '',
            name: '',
            description: ''
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
                await specialistApi.addSpecialist(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    }
                })
                toast.success('Thêm chuyên khoa thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                navigate(path.specialistManagement)
            } catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Thêm chuyên khoa'
    }, [])
    return (
        <div className="addSpecialist">
            <div className="addSpecialist__container">
                <header>Thêm mới chuyên khoa</header>
                <form
                    className="form addSpecialist__form"
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                    <div className="form__element">
                        <PreviewUploadImg form={form} name="image" />
                    </div>
                    <div className="form__element">
                        <InputField
                            form={form}
                            name="name"
                            placeholder="Tên chuyên khoa"
                        />
                    </div>
                    <div className="form__element">
                        <InputField
                            form={form}
                            name="description"
                            placeholder="Mô tả chuyên khoa"
                        />
                    </div>
                    <div className="addSpecialist__action">
                        <button type="submit" className="btnSuccess">
                            Thêm chuyên khoa
                        </button>
                        <button
                            onClick={() => navigate(path.specialistManagement)}
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

export default AddSpecialist