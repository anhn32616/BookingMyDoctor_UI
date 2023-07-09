import { Button, Col, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import CardAppointment from './CardAppointment';

function ModalSelectAppointment({ listAppointment, setModalVisible, modalVisible, reloadData }) {
    const [count, setCount] = useState(listAppointment.length);
    useEffect(() => {
        setCount(listAppointment.length)
    },[listAppointment.length])

    useEffect(() => {
        if(count === 0) setModalVisible(false);
        reloadData()
    }, [count])

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
                        <CardAppointment appointment={item} setCount={setCount} />
                    </Col>
                )) : (<><CardAppointment appointment={listAppointment[0]} setCount={setCount} /></>)}
            </Row>
        </Modal>
    );
}

export default ModalSelectAppointment;