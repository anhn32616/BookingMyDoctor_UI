import { Button, Card } from 'antd';
import React, { useState } from 'react';
import PatientInfo from '../patient/PatientInfo';
import appointmentApi from 'api/appointmentApi';
import { toast } from 'react-toastify';



function CardAppointment({ appointment, handleAction}) {
    const [showOption, setShowOption] = useState(true);
    const handleCancelAppointment = async () => {
        try {
            var res = await appointmentApi.cancelAppontment(appointment.id);
            toast.success(res.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            setShowOption(false);
            reloadData()
        } catch (error) {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    const handleAcceptAppointment = async () => {
        try {
            var res = await appointmentApi.doctorAcceptAppointment(appointment.id);
            toast.success(res.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
            reloadData()
        } catch (error) {
            toast.error(error.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            })
        }
    }
    return (
        <div>
            <Card style={{
                backgroundColor: 'beige',
                height: 350,
                minHeight: 350
            }}>
                <PatientInfo patient={appointment?.patient} />
                <p>
                    <span className="info-label">Symptoms:</span> {appointment?.symptoms}
                </p>
                {showOption &&
                    (<div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'absolute', bottom: 10, width: '100%'
                    }}>
                        <Button type='primary' danger onClick={handleCancelAppointment}>Deny</Button>
                        <Button style={{ marginLeft: 5 }} type='primary' onClick={handleAcceptAppointment}>Accept</Button>
                    </div>)}
            </Card>
        </div >
    );
}

export default CardAppointment;