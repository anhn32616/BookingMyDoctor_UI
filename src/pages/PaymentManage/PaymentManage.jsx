import {
  Row,
  Col,
  Card,
  Table,
  Modal,
  Select,
  DatePicker,
  Tag,
  Button,
} from "antd";

import { useEffect, useState } from "react";
import doctorApi from "api/doctorApi";
import { useSelector } from "react-redux";
import paymentApi from "api/paymentApi";
import strftime from "strftime";
import { DeleteOutlined } from "@ant-design/icons";
import { toast } from 'react-toastify'

const { Option } = Select;

//styles
const HeaderTableStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 24px",
  borderBottom: "1px solid #f0f0f0",
  borderRadius: "2px 2px 0 0",
}

// table code start
const columns = [
  {
    key: "ID",
    title: "ID",
    dataIndex: "id",
    width: 50
  },
  {
    key: "datePayment",
    title: "DATE PAYMENT",
    dataIndex: "datePayment",
  },
  {
    key: "monthlyFee",
    dataIndex: "monthlyFee",
    title: "MONTHLY FEE",
  },
  {
    key: "appointmentFee",
    dataIndex: "appointmentFee",
    title: "APPOINTMENT FEE",
  },
  {
    key: "totalFee",
    dataIndex: "totalFee",
    title: "TOTAL FEE",
  },
  {
    key: "status",
    dataIndex: "status",
    title: "STATUS",
  },
  // {
  //   key: "actions",
  //   dataIndex: "actions",
  //   title: "ACTIONS",
  // },
];



function PaymentManage() {

  const [doctorInfo, setDoctorInfo] = useState();
  const doctorId = useSelector(state => state.user.profile.doctorId);
  const [dateHSD, setDateHSD] = useState();
  const [paymentInfo, setPaymentInfo] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const [selectedDate, setSelectedDate] = useState();
  const [selectedStatus, setSelectedStatus] = useState();



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





  const handlePayment = async () => {
    try {
      var res = await paymentApi.createPayment()
      window.location = res.data
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleSelectDateTime = (date, dateString) => {
    const parts = dateString.split('/');
    const convertedDate = parts.reverse().join('-');
    setSelectedDate(convertedDate);
  }


  useEffect(() => {
    setPage(1);
    getRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, selectedDate, selectedStatus])

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize])




  const onDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        paymentApi.deletePayment(id).then((response) => {
          toast.success(response.message, {
            position: toast.POSITION.BOTTOM_RIGHT
          })
          getRecords(page, pageSize);

        }).catch(err => {
          toast.error(err.message, {
            position: toast.POSITION.BOTTOM_RIGHT
          })
        });
      }
    });
  }

  const getRecords = async () => {
    try {
      setLoading(true);
      let paramQuery = {
        page: page - 1,
        pageSize: pageSize
      };
      if (selectedDate) {
        paramQuery.date = selectedDate;
      }
      if (selectedStatus !== null && selectedStatus !== undefined) {
        paramQuery.status = selectedStatus;
      }
      let resApi = await paymentApi.getAllPayment(paramQuery);
      const data = [];
      if (resApi.data !== null) {
        resApi.data.listItem.forEach((item, index) => {
          data.push({
            key: index,
            id: (
              <>{item.id}</>
            ),
            status: (
              <>{item.status}</>
            ),
            appointmentFee: (
              <>{item.appointmentFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
            ),
            monthlyFee: (
              <>{item.monthlyFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
            ),
            totalFee: (
              <>{item.totalFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
            ),
            datePayment: (
              <>{strftime('%d/%m/%y %Hh%M', new Date(item.datePayment))}</>
            ),
            status: (
              <Tag color={item.status === true ? 'green' : 'red'} key={item.status}>
                {item.status === true ? 'Success' : 'Failure'}
              </Tag>
            ),
            actions: (
              <>
                <DeleteOutlined onClick={() => onDelete(item.id)} style={{ fontSize: 18, color: "red", marginLeft: 12, cursor: "pointer" }}></DeleteOutlined>
              </>
            )
          })
        })
      }
      console.log(data);
      setDataSource(data);
      setTotalItem(resApi.data.totalCount);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  const filterDate = () => (
    <div className="filter-item">
      <div className="filter-item-label">DATE</div>
      <DatePicker
        name="startTime"
        format={'DD/MM/YYYY'}
        onChange={handleSelectDateTime}
        inputReadOnly
        inputStyle={{ color: 'red' }}
        className="searchDateTime"
        style={{
          height: "auto",
          width: "auto",
          borderRadius: "6px",
          fontSize: "14px",
          padding: "8px",
          border: "1px solid #d9d9d9"
        }}
      />
    </div>
  )
  const filterStatus = () => (
    <div className="filter-item">
      <div className="filter-item-label">STATUS</div>
      <Select
        showSearch
        placeholder="Status"
        allowClear
        style={{ width: 100 }}
        onChange={(value) => { setSelectedStatus(value) }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      >
        <Option value={true} key={true}>
          Success
        </Option>
        <Option value={false} key={false}>
          Failure
        </Option>
      </Select>
    </div>
  )



  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={24} md={24} lg={16} xl={16}>
          <div className="tabled">
            <Row gutter={[24, 0]}>
              <Col xs="24" xl={24}>
                <Card
                  bordered={false}
                  className="criclebox tablespace mb-24"
                >
                  <a href=""></a>
                  <div style={HeaderTableStyles}>
                    <span style={{ fontSize: 20, fontWeight: 600 }}>List payment</span>
                    <div className="filter" style={{ display: "flex", alignItems: "center" }}>
                      {filterDate()}
                      {filterStatus()}
                    </div>
                  </div>
                  <div className="table-responsive">
                    <Table
                      columns={columns}
                      dataSource={dataSource}
                      loading={loading}
                      pagination={{
                        position: ["bottomCenter"],
                        current: page,
                        pageSize: pageSize,
                        total: totalItem,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '15', '30'],
                        onChange: (page, pageSize) => {
                          setPage(page);
                          setPageSize(pageSize);
                        }
                      }}
                      className="ant-border-space"
                    />

                  </div>
                </Card>
              </Col>
            </Row>

          </div >

        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <Card title="Account" className="account-info">
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
          </Card>
        </Col>
      </Row>

    </>
  );
}

export default PaymentManage;
