import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Tag
} from 'antd';


import { DeleteOutlined, EditTwoTone } from '@ant-design/icons';
import { toast } from 'react-toastify'
import FormDataTimetable from 'components/timetable/FormDataTimetable';
import strftime from 'strftime'
import { useSelector } from 'react-redux';
import timetableApi from 'api/TimetableApi';


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
    key: 'time',
    dataIndex: 'time',
    title: 'TIME',
  },
  {
    key: 'cost',
    dataIndex: 'cost',
    title: 'PRICE',
  },
  {
    key: 'actions',
    dataIndex: 'actions',
    title: 'ACTIONS',
  },
];



function TimetableManage() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [item, setItem] = useState();
  const [isShowForm, setIsShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const doctorId = useSelector(state => state?.user?.profile?.doctorId);



  useEffect(() => {
    setPage(1);
    getRecords();
    // eslint-disable-next-line
  }, [pageSize])

  useEffect(() => {
    getRecords();
    // eslint-disable-next-line
  }, [page, pageSize])



  const onDelete = (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        timetableApi.deleteTimetable(id).then((response) => {
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
      paramQuery.doctorId = doctorId;
      let resApi = await timetableApi.getAllTimetable(paramQuery);
      const data = [];
      if (resApi.data !== null) {
        resApi.data.listItem.forEach((item, index) => {
          data.push({
            key: index,
            id: (
              <>{item.id}</>
            ),
            time: (
              <>{strftime('%H: %M', new Date(item.startTime))} - {strftime('%H: %M', new Date(item.endTime))}</>
            ),
            cost: (
              <>{item.cost.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</>
            ),
            actions: (
              <>
                <EditTwoTone
                  onClick={() => {
                    setIsEditing(true);
                    setItem({ ...item });
                    setIsShowForm(true);
                  }} style={{ fontSize: 18, cursor: 'pointer' }}></EditTwoTone>
                <DeleteOutlined onClick={() => onDelete(item.id)} style={{ fontSize: 18, color: 'red', marginLeft: 12, cursor: 'pointer' }}></DeleteOutlined>
              </>
            )
          })
        })
      }
      setDataSource(data);
      setTotalItem(resApi.data.totalCount);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  

  return (
    <>
      <div className='tabled'>
        <Row gutter={[24, 0]}>
          <Col span={24} xs='24' xl={24}>
            <Card
              bordered={false}
              className='criclebox tablespace mb-24'
            >
              <div style={HeaderTableStyles}>
                <span style={{ fontSize: 20, fontWeight: 600 }}>List timetable</span>
                <div className='filter' style={{ display: 'flex', alignItems: 'center' }}>
                  <div className='filter-item'>
                    <div className='filter-item-label hidden'>Add</div>
                    <Button
                      onClick={() => {
                        setItem(null)
                        setIsAdding(true);
                        setIsShowForm(true);
                      }}
                      style={{ background: '#1890ff', color: '#ffffff' }}>
                      <i className='fa-solid fa-plus' style={{ marginRight: 6 }}></i>
                      Add</Button>
                  </div>
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
                      setPage(page);
                      setPageSize(pageSize);
                    }
                  }}
                  className='ant-border-space'
                />
                {/* form edit add */}
                <FormDataTimetable getRecords={getRecords} item={item}
                  setIsShowForm={setIsShowForm} setIsAdding={setIsAdding} setIsEditing={setIsEditing}
                  isAdding={isAdding} isEditing={isEditing} isShowForm={isShowForm} />
              </div>
            </Card>
          </Col>
        </Row>
      </div >
    </>
  );
}

export default TimetableManage;
