import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Select,
  DatePicker,
  Tag,
  Popconfirm,
  Switch
} from 'antd'


import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import appointmentApi from 'api/appointmentApi'
import userApi from 'api/userApi'
import ModalAppointmentDetail from 'components/appointment/ModalAppointmentDetail'
import { useSelector } from 'react-redux'
const { Option } = Select

//styles
const HeaderTableStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 24px',
  borderBottom: '1px solid #f0f0f0',
  borderRadius: '2px 2px 0 0',
}

// table code start
const columns = [
  {
    key: 'ID',
    title: 'ID',
    dataIndex: 'id',
    width: 50
  },
  {
    key: 'patient',
    dataIndex: 'patient',
    title: 'PATIENT',
  },
  {
    key: 'DATE',
    dataIndex: 'date',
    title: 'TIME',
  },
  {
    key: 'status',
    dataIndex: 'status',
    title: 'STATUS',
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: 'ACTIONS',
    width: 250
  },
]


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
  const dateTime = new Date(dateTimeStr)
  const date = dateTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric' })
  const time = dateTime.toLocaleTimeString('en-GB', { hour: 'numeric', minute: 'numeric' })
  return `${date} ${time}`
}


function AppointmentsTableDoctor() {
  const [dataSource, setDataSource] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalItem, setTotalItem] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [selectedDate, setSelectedDate] = useState()
  const [selectedStatus, setSelectedStatus] = useState()
  const [dataPatient, setDataPatient] = useState([])
  const [visibleModalDetail, setVisibleModalDetail] = useState(false)
  const [apppointmentDetail, setAppointmentDetail] = useState()
  const [hiddenCancel, setHiddenCancel] = useState(false);




  const handleSelectDateTime = (date, dateString) => {
    const parts = dateString.split('/')
    const convertedDate = parts.reverse().join('-')
    setSelectedDate(convertedDate)
  }


  useEffect(() => {
    setPage(1)
    getRecords()
    // eslint-disable-next-line
  }, [pageSize, selectedDate, selectedPatient, selectedStatus, hiddenCancel])

  useEffect(() => {
    getRecords()
    // eslint-disable-next-line
  }, [page, pageSize])

  useEffect(() => {
    const fetchData = async () => {
      try {
        var resPatient = await userApi.getAllPatient();
        setDataPatient(resPatient?.data?.listItem);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [])

  const onDetail = (appointment) => {
    setAppointmentDetail(appointment)
    setVisibleModalDetail(true)
  }

  const getRecords = async () => {
    try {
      setLoading(true)
      let paramQuery = {
        page: page - 1,
        pageSize: pageSize
      }
      if (selectedDate) {
        paramQuery.date = selectedDate
      }
      if (selectedPatient) {
        paramQuery.patientId = selectedPatient
      }
      if (selectedStatus) {
        paramQuery.status = selectedStatus
      }
      if (hiddenCancel) {
        paramQuery.hiddenCancel = hiddenCancel;
      }
      let resApi = await appointmentApi.getAllAppointment(paramQuery)
      const data = []
      if (resApi.data !== null) {
        resApi.data.listItem.forEach((item, index) => {
          data.push({
            key: index,
            id: (
              <>{item.id}</>
            ),
            patient: (
              <>{item.patient.fullName}</>
            ),
            date: (
              <>{convertDateTime(item.date)}</>
            ),
            status: (
              <Tag style={{ padding: 5, width: 80, textAlign: 'center' }} color={colorStatus(item.status)}>{item.status.toUpperCase()}</Tag>
            ),
            actions: (
              <>
                <>
                  <Button style={{ marginRight: 10 }} onClick={() => { onDetail(item) }}>
                    Detail
                  </Button>
                </>
                {item.status === 'Pending' &&
                  (
                    <>
                      <Popconfirm title="Are you sure to accept this appointment?"
                        onConfirm={() => onAccept(item?.id)}>
                        <Button style={{ marginRight: 10 }} type='primary'>
                          Accept
                        </Button>
                      </Popconfirm>
                    </>
                  )
                }
                {(item.status === 'Confirm' || item.status === 'Pending') &&
                  (
                    <>
                      <Popconfirm title="Are you sure to cancel this appointment?"
                        onConfirm={() => onCancel(item?.id)}>
                        <Button type='primary' danger>
                          Cancel
                        </Button>
                      </Popconfirm>
                    </>
                  )
                }
                {item.status === 'Done' &&
                  (
                    <>
                      <Popconfirm title="Are you sure to report this appointment?"
                        onConfirm={() => onReport(item?.id)}>
                        <Button type='primary'>
                          Report
                        </Button>
                      </Popconfirm>
                    </>
                  )
                }
              </>
            )
          })
        })
      }
      setDataSource(data)
      setTotalItem(resApi.data.totalCount)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  
  const optionHiddenCancel = () => (
    <div className="filter-item" style={{marginRight: 20}}>
      <div className="filter-item-label" style={{marginBottom: 17}}>HIDDEN CANCEL</div>
      <Switch style={{position: 'relative', top: '-7px', width: 30}} checked={hiddenCancel} onChange={() => { setHiddenCancel(!hiddenCancel) }} />
    </div>
  )

  const filterPatient = () => (
    <div className='filter-item'>
      <div className='filter-item-label'>PATIENT</div>
      <Select
        showSearch
        placeholder='Select Patient'
        allowClear
        style={{ width: 300 }}
        onChange={(value) => { setSelectedPatient(value) }}
        optionFilterProp='children'
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      >
        {dataPatient?.map((patient) => (
          <Option value={patient.id} key={patient.id} label={patient.fullName}>
            {patient.fullName}
          </Option>
        ))}
      </Select>
    </div>
  )

  const filterDate = () => (
    <div className='filter-item'>
      <div className='filter-item-label'>DATE</div>
      <DatePicker
        name='startTime'
        format={'DD/MM/YYYY'}
        onChange={handleSelectDateTime}
        inputReadOnly
        inputStyle={{ color: 'red' }}
        className='searchDateTime'
        style={{
          height: 'auto',
          width: 'auto',
          borderRadius: '6px',
          fontSize: '14px',
          padding: '8px',
          border: '1px solid #d9d9d9'
        }}
      />
    </div>
  )

  const filterStatus = () => (
    <div className='filter-item'>
      <div className='filter-item-label'>STATUS</div>
      <Select
        showSearch
        placeholder='Status'
        allowClear
        style={{ width: 100 }}
        onChange={(value) => { setSelectedStatus(value) }}
        optionFilterProp='children'
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
      >
        <Option value={'Cancel'} key={'Cancel'}>
          Cancel
        </Option>
        <Option value={'Pending'} key={'Pending'}>
          Pending
        </Option>
        <Option value={'Confirm'} key={'Confirm'}>
          Confirm
        </Option>
        <Option value={'Done'} key={'Done'}>
          Done
        </Option>
        <Option value={'Report'} key={'Report'}>
          Report
        </Option>
        <Option value={'NotCome'} key={'NotCome'}>
          NotCome
        </Option>
      </Select>
    </div>
  )

  const onReport = async (id) => {
    try {
      var res = await appointmentApi.doctorReportAppointment(id);
      toast.success(res.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      getRecords()
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }
  }

  const onAccept = async (id) => {
    try {
      var res = await appointmentApi.doctorAcceptAppointment(id);
      toast.success(res.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      getRecords()
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }
  }

  const onCancel = async (id) => {
    try {
      var res = await appointmentApi.cancelAppontment(id);
      toast.success(res.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
      getRecords()
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    }
  }

  return (
    <>
      <div className='tabled'>
        <Row gutter={[24, 0]}>
          <Col xs='24' xl={24}>
            <Card
              bordered={false}
              className='criclebox tablespace mb-24'
            >
              <div style={HeaderTableStyles}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>List Appointment</span>
                <div className='filter' style={{ display: 'flex', alignItems: 'center' }}>
                  {optionHiddenCancel()}
                  {filterDate()}
                  {filterStatus()}
                  {filterPatient()}
                </div>
              </div>
              <div className='table-responsive'>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  loading={loading}
                  pagination={{
                    position: ['bottomCenter'],
                    current: page,
                    pageSize: pageSize,
                    total: totalItem,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '15', '30'],
                    onChange: (page, pageSize) => {
                      setPage(page)
                      setPageSize(pageSize)
                    }
                  }}
                  className='ant-border-space'
                />
              </div>
            </Card>
          </Col>
        </Row>
        <ModalAppointmentDetail modalVisible={visibleModalDetail} setModalVisible={setVisibleModalDetail}
          appointment={apppointmentDetail} reloadListAppointment={getRecords} />
      </div >
    </>
  )
}

export default AppointmentsTableDoctor
