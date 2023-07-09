import {
  Card,
  Col,
  DatePicker,
  Row,
  Table,
  Typography
} from "antd";

import { useEffect, useState } from "react";
import statisticalApi from "../../api/statisticalApi";
import dayjs from "dayjs";
import doctorApi from "api/doctorApi";
import { useSelector } from "react-redux";
import './Revenue.css'
import paymentApi from "api/paymentApi";
import strftime from "strftime";
import { RiMoneyDollarCircleFill } from 'react-icons/ri'



// table code start
const columns = [
  {
    key: "Id",
    dataIndex: "Id",
    title: "Id",
  },
  {
    key: "Patient",
    dataIndex: "Patient",
    title: "Patient",
  },
  {
    key: "Date",
    dataIndex: "Date",
    title: "Date",
  },
  {
    key: "Paid",
    dataIndex: "Paid",
    title: "Paid",
  }
];

function Revenue() {
  const { Title } = Typography;
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTime, setSelectedTime] = useState(getStartEndDateOfMonth(getCurrentYearMonth()))
  const [dataSource, setDataSource] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState();
  const doctorId = useSelector(state => state.user.profile.doctorId);
  const [dateHSD, setDateHSD] = useState();
  const [paymentInfo, setPaymentInfo] = useState();
  const [revenueInfo, setRevenueInfo] = useState();


  function getCurrentYearMonth() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }


  useEffect(() => {
    getRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTime])

  useEffect(() => {
    try {
      const getPaymentInfo = async () => {
        var res = await paymentApi.getPaymentInfo();
        setPaymentInfo(res.data)
        console.log(res.data);
        var resDoctor = await doctorApi.getDetailDoctor(doctorId)
        setDoctorInfo(resDoctor.data)
        resDoctor?.data?.monthPaid && setDateHSD(new Date(resDoctor?.data?.monthPaid).setDate(new Date(resDoctor?.data?.monthPaid).getDate() + 30))
      }
      getPaymentInfo()
    } catch (error) {
      console.log(error.message);
    }
  }, [])


  const getRecords = async () => {
    setIsLoading(true);

    try {
      let paramQuery = {
        ...selectedTime
      };
      console.log(paramQuery);
      var res = await statisticalApi.getStatisticalOfDoctor(paramQuery)
      setRevenueInfo(res.data)
      const data = [];
      console.log(res.data);
      if (res.data.appointments !== null) {
        res.data.appointments.forEach((item, index) => {
        data.push({
          key: index,
          Id: (
            <>{item.id}</>
          ),
          Date: (
            <>{strftime('%d/%m/%Y %Hh%M', new Date(item.date))}</>
          ),
          Patient: (
            <>{item.patient?.fullName}</>
          ),
          Paid: (
            <>{item.paid ? 'true' : 'false'}</>
          ),
        })
      })
    }
      setDataSource(data);
      setIsLoading(false);
    }

    catch (error) {
      setIsLoading(false);
      console.log(error.message);
    }
  }





  function getStartEndDateOfMonth(monthString) {
    const [year, month] = monthString.split('-');
    const startDate = new Date(year, month - 1, 2);
    const endDate = new Date(year, month, 1);

    const startFormatted = startDate.toISOString().split('T')[0];
    const endFormatted = endDate.toISOString().split('T')[0];

    return {
      startTime: startFormatted,
      endTime: endFormatted
    };
  }
  const onChange = (date, dateString) => {
    console.log(dateString);
    let time = getStartEndDateOfMonth(dateString)
    console.log(time);
    setSelectedTime({ ...time })
  };

  const handlePayment = async () => {
    try {
      var res = await paymentApi.createPayment()
      window.location = res.data
    } catch (error) {
      console.log(error.message);
    }
  }

  const count = [
    {
      name: "Revenue",
      count: revenueInfo?.revenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <RiMoneyDollarCircleFill />,
    },
    {
      name: "Profit",
      count: revenueInfo?.profit?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <RiMoneyDollarCircleFill />,
    },
    {
      name: "Fee",
      count: revenueInfo?.fee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <RiMoneyDollarCircleFill />,
    },
    {
      name: "Fee Paid",
      count: revenueInfo?.feePaid?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <RiMoneyDollarCircleFill />,
    },
  ];



  return (
    <>
      <Row className="rowgap-vbox" gutter={[24, 0]}>
          {count.map((c, index) => (
            <Col
              key={index}
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              className="mb-24"
            >
              <Card bordered={false} className="criclebox ">
                <div className="number">
                  <Row align="middle" gutter={[24, 0]}>
                    <Col xs={18}>
                      <span>{c.name}</span>
                      <Title level={3}>
                        {c.count}
                      </Title>
                    </Col>
                    <Col xs={6}>
                      <div className="icon-box">{c.icon}</div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      <Card title="Appointment Done">
        <div className="layout-content">
          <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0', gap: '10px' }}>
            <h4>Month</h4>
            <DatePicker defaultValue={dayjs(getCurrentYearMonth(), 'YYYY-MM')} onChange={onChange} picker="month" />
          </div>


          <Row gutter={[24, 0]}>
            <Col span={24} className="mb-24">
              <Table
                columns={columns}
                dataSource={dataSource}
                loading={isLoading}
                className="ant-border-space"
                pagination={false}
              />
            </Col>
          </Row>
        </div>
      </Card>
      {/* <Card title="Account" className="account-info" style={{ marginTop: 20 }}>
        <div style={{ marginLeft: 30 }}>
          {doctorInfo && doctorInfo.monthPaid ? (
            <>
              <p>Monthly Fee Payment Date: {strftime('%d/%m/%Y %Hh%M', new Date(doctorInfo.monthPaid))}</p>
              <p>Use Till Date: {strftime('%d/%m/%Y %Hh%M', new Date(dateHSD))}</p> {dateHSD < new Date() && (<> (expired)</>)}
            </>
          ) : (
            <>
              <p>You have not paid the monthly fee</p>
            </>
          )}
          <p>Billing Information:</p>
          <ul>
            <li>Monthly fee: {paymentInfo?.monthlyFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
            <li>Appointment fee: {paymentInfo?.appointmentFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
            <li>Total: {paymentInfo?.totalFee?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</li>
          </ul>
          {paymentInfo?.totalFee != 0 && (<div>
            <Button type="primary" onClick={handlePayment}>Pay</Button>
          </div>)}
        </div>
      </Card> */}
    </>
  );
}

export default Revenue;
