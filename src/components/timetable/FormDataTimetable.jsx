import React, { useEffect, useState } from 'react';
import {
    Input,
    Form,
    Modal,
    InputNumber,
    TimePicker,
    Col,
    Row
} from 'antd';
import timetableApi from 'api/TimetableApi';
import { toast } from 'react-toastify';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import moment from 'moment';
import { useSelector } from 'react-redux';





function FormDataTimetable(props) {
    const [form] = Form.useForm();
    const [isLoading, setIsLoading] = useState(false);
    const doctorId = useSelector(state => state.user.profile.doctorId)


    const resetForm = () => {
        form.resetFields();
    }


    useEffect(() => {
        if (props.item) {
            var timetable = props.item;
            timetable.startTime = moment(new Date(timetable.startTime), 'HH:mm');
            timetable.endTime = moment(new Date(timetable.endTime), 'HH:mm');
            form.setFieldsValue(timetable);
        }
        // eslint-disable-next-line
    }, [props.item]);

    useEffect(() => {
        if (!props.isShowForm) {
            form.resetFields();
        }
        // eslint-disable-next-line
    }, [props.isShowForm])


    const onAdd = async () => {
        let startTime = new Date();
        var startHour = new Date(form.getFieldValue('startTime'));
        startTime.setHours(startHour.getHours());
        startTime.setMinutes(startHour.getMinutes());
        let endTime = new Date();
        var endHour = new Date(form.getFieldValue('endTime'));
        endTime.setHours(endHour.getHours());
        endTime.setMinutes(endHour.getMinutes());
        startTime.setHours(startTime.getHours() + 7);
        endTime.setHours(endTime.getHours() + 7);
        const formData = { ...form.getFieldsValue(), startTime: startTime, endTime: endTime, doctorId: doctorId };
        timetableApi.addTimetable(formData, {
            'Content-Type': 'applicaton/json',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
        }).then((response) => {
            toast.success(response.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            setIsLoading(false);
            resetForm();
            props.setIsShowForm(false)
            props.setIsAdding(false);
            props.getRecords();
        }).catch((error) => {
            setIsLoading(false);
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        });

    };
    const onEdit = async () => {
        let startTime = new Date(form.getFieldValue('date'));
        var startHour = new Date(form.getFieldValue('startTime'));
        startTime.setHours(startHour.getHours());
        startTime.setMinutes(startHour.getMinutes());
        let endTime = new Date(form.getFieldValue('date'));
        var endHour = new Date(form.getFieldValue('endTime'));
        endTime.setHours(endHour.getHours());
        endTime.setMinutes(endHour.getMinutes());
        startTime.setHours(startTime.getHours() + 7);
        endTime.setHours(endTime.getHours() + 7);
        const formData = { ...form.getFieldsValue(), startTime: startTime, endTime: endTime, doctorId: doctorId };
        formData.id = props.item.id;
        await timetableApi.updateTimetable(formData).then((response) => {
            toast.success(response.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            props.getRecords();
        }).catch((error) => {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        });
        setIsLoading(false);
        props.setIsShowForm(false)
        props.setIsEditing(false);
    };





    const formItemStartTime = () => (
        <Form.Item labelCol={12} wrapperCol={12} name='startTime' label='Start Time' rules={[{ required: true, message: 'Start time is required' }]}>
            <TimePicker
                format={'HH:mm'}
                style={{
                    height: 'auto',
                    borderRadius: '6px',
                    fontSize: '14px',
                    padding: '8px',
                }}
            />
        </Form.Item>
    )
    const formItemEndTime = () => (
        <Form.Item labelCol={12} wrapperCol={12} name='endTime' label='End Time' rules={[{ required: true, message: 'Start time is required' }]}>
            <TimePicker
                format={'HH:mm'}
                style={{
                    height: 'auto',
                    borderRadius: '6px',
                    fontSize: '14px',
                    padding: '8px',
                }}
            />
        </Form.Item>
    )

    const formItemCount = () => (
        <Form.Item
            name='count'
            label='Count'
            rules={[
                {
                    required: true,
                },
                {
                    type: 'number',
                    min: 1,
                }
            ]}
        >
            <InputNumber style={{ width: '100%', borderRadius: '6px' }} />
        </Form.Item>
    )

    const formItemPrice = () => (
        <Form.Item
            name='cost'
            label='Price'
            rules={[
                {
                    required: true,
                },
                {
                    type: 'number',
                    min: 10000,
                    max: 10000000,
                }
            ]}
        >
            <InputNumber style={{ width: '100%', borderRadius: '6px' }} />
        </Form.Item>
    )


    return (
        <div>
            {isLoading && <LoadingSpinner />}
            <Modal forceRender

                title={props.isAdding ? 'Add Timetable' : 'Edit Timetable'}
                visible={props.isShowForm}
                okText='Submit'
                onCancel={() => {
                    props.setIsShowForm(false); props.setIsAdding(false); props.setIsEditing(false);
                }}
                onOk={() => {
                    form.validateFields().then(async () => {
                        const { startTime, endTime } = form.getFieldValue();
                        // Kiểm tra endTime > startTime
                        if (endTime <= startTime) {
                            form.setFields([
                                {
                                    name: 'endTime',
                                    errors: ['EndTime must be greater than StartTime'],
                                },
                            ]);
                            return;
                        }
                        setIsLoading(true);
                        props.isAdding ? onAdd() : onEdit();
                    });
                }}
            >
                <Form
                    form={form}
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 18 }}
                    layout='horizontal'
                >
                    {props.isEditing && <Form.Item name='id' label='Id' rules={[{ required: true }]}>
                        <Input disabled />

                    </Form.Item>}
                    <Row span={24} style={{ marginLeft: 15 }}>
                        <Col span={12}>
                            {formItemStartTime()}
                        </Col>
                        <Col span={12}>
                            {formItemEndTime()}
                        </Col>
                    </Row>

                    {props.isAdding && formItemCount()}
                    {formItemPrice()}
                </Form>
            </Modal>
        </div>
    );
}

export default FormDataTimetable;