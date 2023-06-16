import InputField from 'components/InputFiled'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import './index.scss'
import scheduleApi from 'api/scheduleApi'
import { toast } from 'react-toastify'
const yesterday = new Date(Date.now() - 86400000)
function AddSchedule({ onClose }) {
    const userDoctor = useSelector(state => state.user.profile)
    const schema = yup.object().shape({
        cost: yup
            .number('Nhập số')
            .required('Nhập giá tiền')
            .min(100000, 'Giá tiền tối thiểu 100.000 VNĐ'),
        maxnumber: yup
            .number('Nhập số')
            .required('Nhập số lượng bệnh nhân')
            .min(1, 'Số lượng tối thiểu là 1'),
        begin: yup
            .date()
            .required('Chọn giờ bắt đầu')
            .min(yesterday, 'Bắt đầu từ ngày hôm nay'),
        end: yup
            .date()
            .required('Chọn giờ bắt đầu')
            .min(yesterday, 'Bắt đầu từ ngày hôm nay')
    })
    const form = useForm({
        defaultValues: {
            doctor_id: userDoctor.doctor.id,
            maxnumber: 1,
            cost: 100000,
            begin: '',
            end: ''
        },
        resolver: yupResolver(schema)
    })
    const handleSubmitForm = value => {
        const valueSubmit = { ...value }
        valueSubmit.begin = valueSubmit.begin.toISOString()
        valueSubmit.end = valueSubmit.end.toISOString()
        ;(async () => {
            try {
                await scheduleApi.addSchedule(valueSubmit,
                    {
                        headers: {
                            Authorization: `${localStorage.getItem(
                                'access_token'
                            )}`
                        }
                    }
                )
                toast.success('Tạo lịch khám thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
                onClose()
            }
            catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    return (
        <div className="addSchedule">
            <div className="addSchedule__container">
                <header>Thêm lịch khám</header>
                <form
                    className="form addSchedule__form"
                    onSubmit={form.handleSubmit(handleSubmitForm)}
                >
                    <div className="form__element-two-input">
                        <div>
                            <InputField
                                label="Từ"
                                name="begin"
                                type="datetime-local"
                                form={form}
                                placeholder="Số bệnh nhân tối đa"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Đến"
                                name="end"
                                type="datetime-local"
                                form={form}
                                placeholder="Số bệnh nhân tối đa"
                            />
                        </div>
                    </div>

                    <div className="form__element-two-input">
                        <div>
                            <InputField
                                label="Số lượng"
                                name="maxnumber"
                                type="number"
                                form={form}
                                placeholder="Số bệnh nhân tối đa"
                            />
                        </div>
                        <div>
                            <InputField
                                label="Giá tiền"
                                name="cost"
                                type="number"
                                form={form}
                                placeholder="Số tiền cho mỗi lần khám"
                            />
                        </div>
                    </div>
                    <div className="addSchedule__action">
                        <button type="submit" className="btnSuccess">
                            Tạo lịch khám
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

export default AddSchedule
