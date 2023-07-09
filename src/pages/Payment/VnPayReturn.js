import React, { useEffect, useState } from "react";
import { Button, Spin } from "antd";
import numeral from 'numeral';
import paymentApi from "api/paymentApi";
import { useNavigate } from "react-router-dom";
function VnPayReturn() {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        try {
            var currentUrl = window.location.href;
            var url = new URL(currentUrl);
            // Get query string from URL AnhNT282
            var queryString = url.search;
            paymentApi.returnPayment(queryString).then((response) => {
                setPaymentInfo(response)
            })
        } catch (error) {
            console.log(error.message);
        }

    }, []);

    return (
        <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {paymentInfo ?
                (<div className="container mt-5">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <div className="card">
                                <div className="card-body">
                                    {paymentInfo?.statusCode == 200 ? (
                                        <div>
                                            <h1 className="text-center">
                                                Thông tin thanh toán
                                            </h1>
                                            <h3 className="mt-4 text-success">
                                                Thanh toán thành công
                                            </h3>
                                            <div style={{ display: 'flex', gap: 10, fontSize: 18, fontWeight: 500, alignItems: 'center' }}>
                                                <label className="form-label">
                                                    Mã giao dịch:
                                                </label>
                                                <div className="form-control">
                                                    {paymentInfo?.data?.transId}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 10, fontSize: 18, fontWeight: 500, alignItems: 'center' }}>
                                                <label className="form-label">
                                                    Phí tháng:
                                                </label>
                                                <div className="form-control">
                                                    {numeral(paymentInfo?.data?.monthlyFee).format('0,0.00')}đ
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 10, fontSize: 18, fontWeight: 500, alignItems: 'center' }}>
                                                <label className="form-label">
                                                    Phí lịch khám:
                                                </label>
                                                <div className="form-control">
                                                    {
                                                        numeral(paymentInfo?.data
                                                            ?.appointmentFee).format('0,0.00')
                                                    }đ
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 10, fontSize: 18, fontWeight: 500, alignItems: 'center' }}>
                                                <label className="form-label">
                                                    Tổng:
                                                </label>
                                                <div className="form-control">
                                                    {numeral(paymentInfo?.data?.totalFee).format('0,0.00')}đ
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <h3 className="mt-4 text-danger">
                                                Thanh toán thất bại
                                            </h3>
                                            <div>{paymentInfo?.message}</div>
                                        </div>
                                    )}
                                    <Button style={{margin: 'auto', marginTop: 50}} type="primary" onClick={() => {navigate('/')}}>Quay lại trang chủ</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>)
                : <Spin tip="Loading" size="large">
                </Spin>}

        </div>
    );
}

export default VnPayReturn;
