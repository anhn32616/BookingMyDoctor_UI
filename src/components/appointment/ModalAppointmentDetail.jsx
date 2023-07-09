import { Button, Modal, Rate, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import './ModalAppointmentDetail.css'
import PatientInfo from 'components/patient/PatientInfo';
import { Link } from 'react-router-dom';
import appointmentApi from 'api/appointmentApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { addNotification } from 'utils/firebase/NotificationFb';
import strftime from 'strftime';
import rateApi from 'api/rateApi';

const colorStatus = (status) => {
    switch (status) {
        case 'Cancel':
            return 'gray'
        case 'Pending':
            return '#108ee9'
        case 'Confirm':
            return '#faae2b'
        case 'Report':
            return '#f50'
        case 'Done':
            return '#87d068'
        case 'NotCome':
            return '#001858'
        default:
            break
    }
}

// Convert datetime Local to format YYYY-MM-DD HH:MM 
function convertDateTime(dateTimeStr) {
    const dateTime = new Date(dateTimeStr);
    const date = dateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const time = dateTime.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' });
    return `${date} ${time}`;
}

function ModalAppointmentDetail({ appointment, setModalVisible, modalVisible, reloadListAppointment }) {
    const role = useSelector(state => state.user.profile.roleName)
    const [rate, setRate] = useState();

    useEffect(() => {
        const getRateOfAppointment = async () => {
            if (appointment?.status === "Done") {
                try {
                    var res = await rateApi.getRateByAppointmentId(appointment.id)
                    if (res?.data) setRate(res.data.point); else setRate(null)
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        getRateOfAppointment();
    }, [appointment])


    const handleCancelAppointment = () => {
        Modal.confirm({
            title: 'Are you sure you want to cancel?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                appointmentApi.cancelAppontment(appointment.id).then((response) => {
                    toast.success(response.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                    if (role === "ROLE_PATIENT") {
                        const action = appointment.status === 'PENDING' ? 'từ chối' : 'hủy'
                        const message = `Bác sĩ ${appointment.schedule.doctorName} đã ${action} lịch hẹn ngày ${strftime('%d/%m/%Y %Hh%M', new Date(appointment.date))}`
                        addNotification(appointment.patientId, message)
                    } else if (role === 'ROLE_DOCTOR') {
                        const message = `Bệnh nhân ${appointment.patient.fullName} đã hủy lịch hẹn ngày ${strftime('%d/%m/%Y %Hh%M', new Date(appointment.date))}`
                        addNotification(appointment.schedule.userId, message)
                    }
                    setModalVisible(false)
                    reloadListAppointment()
                }).catch(err => {
                    toast.error(err.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                });
            }
        });
    }
    const handleReportAppointment = () => {
        Modal.confirm({
            title: 'Are you sure you want to report?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                appointmentApi.doctorReportAppointment(appointment.id).then((response) => {
                    toast.success(response.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                    const message1 = `Bác sĩ ${appointment.schedule.doctorName} đã báo cáo bệnh nhân ${appointment.patient.fullName} không đến khám ngày ${strftime('%d/%m/%Y %Hh%M', new Date(appointment.date))}`
                    const message2 = `Bác sĩ ${appointment.schedule.doctorName} đã báo cáo bạn không đến khám ngày ${strftime('%d/%m/%Y %Hh%M', new Date(appointment.date))}`
                    addNotification('admin', message1)
                    addNotification(appointment.patientId, message2)
                    setModalVisible(false)
                    reloadListAppointment()
                }).catch(err => {
                    toast.error(err.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                });
            }
        });
    }
    const handleAcceptAppointment = () => {
        Modal.confirm({
            title: 'Are you sure you want to accept?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                appointmentApi.doctorAcceptAppointment(appointment.id).then((res) => {
                    toast.success(res.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                    setModalVisible(false)
                    const message = `Bác sĩ ${appointment.schedule.doctorName} đã xác nhận lịch hẹn ngày ${strftime('%d/%m/%Y %Hh%M', new Date(appointment.date))}`
                    addNotification(appointment.patientId, message)
                    res.data && res.data.forEach((notification) => addNotification(notification.userId, notification.message))
                    reloadListAppointment()
                }).catch(err => {
                    toast.error(err.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    })
                });
            }
        });
    }

    return (
        <Modal
            title='Appointment details'
            visible={modalVisible}
            width={800}
            onCancel={() => setModalVisible(false)}
            footer={[]}
            className='appointment-modal'
            style={{
                top: 30,
            }}
        >
            <div className='appointment-info'>
                {
                    rate && (
                        <p>
                            <span className='info-label'>Rate: </span>
                            <Rate disabled value={rate} />
                        </p>
                    )
                }
                <p>
                    <span className='info-label'>ID:</span> {appointment?.id}
                </p>
                <p>
                    <span className='info-label'>Status:</span>
                    <Tag style={{ marginLeft: 5, padding: 2, width: 80, textAlign: 'center' }} color={colorStatus(appointment?.status)}>{appointment?.status.toUpperCase()}</Tag>
                </p>
                <p>
                    <span className='info-label'>Date:</span> {convertDateTime(appointment?.date)}
                </p>
                <p>
                    <span className='info-label'>Symptoms:</span> {appointment?.symptoms}
                </p>
                {(appointment?.status !== 'Cancel' && appointment?.status !== 'NotCome') &&
                    (
                        <>
                            <p>
                                <span className='info-label'>Cost:</span> {appointment?.schedule?.cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </p>
                            {appointment?.rate && <Rate disabled allowHalf defaultValue={appointment?.rate} />}
                        </>
                    )}
                <span className='info-label'>Patient:</span>
                <PatientInfo style={{ marginBottom: 5 }} patient={appointment?.patient}></PatientInfo>
                <p>
                    <span className='info-label'>Doctor: </span>
                    <Link to={`/detailDoctor/${appointment?.schedule?.doctorId}`} target="_blank">
                        {appointment?.schedule?.doctorName}
                    </Link>
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {(appointment?.status === 'Pending' || appointment?.status === 'Confirm') &&
                        (
                            <div style={{ textAlign: 'center' }}>
                                <Button type='primary' danger onClick={handleCancelAppointment}>
                                    Cancel
                                </Button>
                            </div>
                        )}
                    {(appointment?.status === 'Pending' && role === 'ROLE_DOCTOR') &&
                        (
                            <div style={{ textAlign: 'center', marginLeft: 5 }}>
                                <Button type='primary' onClick={handleAcceptAppointment}>
                                    Accept
                                </Button>
                            </div>
                        )}
                    {(appointment?.status === 'Done' && role === 'ROLE_DOCTOR') &&
                        (
                            <div style={{ textAlign: 'center' }}>
                                <Button type='primary' danger onClick={handleReportAppointment}>
                                    Report
                                </Button>
                            </div>
                        )}
                </div>

            </div>
        </Modal>

    );
}

export default ModalAppointmentDetail;