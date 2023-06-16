import { Button, Col, Modal, Row } from 'antd';
import React from 'react';
import CardAppointment from './CardAppointment';

function ModalSelectAppointment({ listAppointment, setModalVisible, modalVisible, reloadData }) {
    const handleAccept = () => {
        setModalVisible(false)
        reloadData()
    }
    return (
        <Modal
            title="Appointments of schedule"
            visible={modalVisible}
            width={listAppointment.length > 1 ? 1000 : 500}
            onCancel={() => setModalVisible(false)}
            style={{ maxHeight: 600, overflowY: 'auto' }}
            footer={[]}
        >
            <Row gutter={[12, 12]}>
                {listAppointment && listAppointment.length > 1 ? listAppointment.map((item, index) => (
                    <Col key={index} xs={24} sm={24} md={12} lg={12} xl={12}>
                        <CardAppointment appointment={item}  reloadData={handleAccept} />
                    </Col>
                )) : (<><CardAppointment appointment={listAppointment[0]} reloadData={handleAccept} /></>)}
            </Row>
        </Modal>
    );
}

export default ModalSelectAppointment;