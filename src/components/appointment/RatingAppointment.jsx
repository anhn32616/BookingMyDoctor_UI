import { Modal, Rate, Form } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import appointmentApi from 'api/appointmentApi';
import rateApi from 'api/rateApi';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

function RatingAppointment({ modalVisible, setModalVisible, appointmentId, reloadListAppointment }) {
    const [form] = Form.useForm();
    useEffect(() => {
        const fetchData = async () => {
            try {
                var res = await rateApi.getRateByAppointmentId(appointmentId)
                console.log(res.data);
                res.data && form.setFieldsValue(res.data)
            } catch (error) {
                toast.error(error.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        }
        fetchData();
    }, [appointmentId])

    useEffect(() => {
        if (!modalVisible) form.resetFields()
    }, [modalVisible])

    const handleRate = async () => {
        var dataSubmit = form.getFieldsValue();
        dataSubmit.appointmentId = appointmentId;
        try {
            var res = await appointmentApi.patientRateAppointment(appointmentId, dataSubmit)
            setModalVisible(false);
            toast.success(res.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        } catch (error) {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    return (
        <Modal
            title='Appointment review'
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            onOk={() => form.validateFields().then(handleRate)}
            okText='Submit'
            width={500}
        >
            <Form form={form} layout='horizontal'>
                <Form.Item className='horizontal' label='Rate' name='point' rules={[{ required: true }, { type: 'number', min: 1, max: 5 }]}>
                    <Rate style={{
                        marginLeft: 5
                    }} />
                </Form.Item>
                <Form.Item label='Comment' name='comment' labelCol={{ span: 24 }}>
                    <TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default RatingAppointment;