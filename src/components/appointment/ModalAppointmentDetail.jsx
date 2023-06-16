import { Button, Modal, Rate, Tag } from 'antd';
import React from 'react';
import './ModalAppointmentDetail.css'
import PatientInfo from 'components/patient/PatientInfo';
import { Link } from 'react-router-dom';
import appointmentApi from 'api/appointmentApi';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

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
                {(appointment?.status === 'Pending' || appointment?.status === 'Confirm') &&
                    (
                        <div style={{ textAlign: 'center' }}>
                            <Button type='primary' danger onClick={handleCancelAppointment}>
                                Cancel
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
        </Modal>

    );
}

export default ModalAppointmentDetail;