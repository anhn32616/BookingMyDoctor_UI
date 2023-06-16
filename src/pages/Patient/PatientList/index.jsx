/* eslint-disable no-unused-vars */
import patientsApi from 'api/patientsApi'
import Loading from 'components/Loading'
import React, { useEffect, useMemo, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import queryString from 'query-string'
import SearchInput from 'components/SearchInput'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDebounce } from 'hooks/useDebounce'
import SwitchButton from 'components/SwitchButton'
import userApi from 'api/userApi'
import { toast } from 'react-toastify'
import './index.scss'
import Pagination from 'components/Pagination'
function PatientList() {
    const [isLoading, setIsLoading] = useState(true)
    const [patientsData, setPatientsData] = useState([])
    const [clinicList, setClinicList] = useState([])
    const [pagination, setPagination] = useState({
        totalPages: 3,
        totalElements: 11,
        page: 0
    })
    const handlePageChange = page => {
        const filters = { ...queryParams, page: page }
        navigate(`?${queryString.stringify(filters)}`)
    }
    const location = useLocation()
    const [searchValue, setSearchValue] = useState(
        () => queryString.parse(location.search).key
    )
    const debounceValue = useDebounce(searchValue, 500)
    const navigate = useNavigate()
    const handleOnChangeSearchInput = e => {
        setSearchValue(e.target.value)
    }
    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search)
        return {
            page: Number.parseInt(params.page) || 0,
            size: Number.parseInt(params.size) || 10,
            key: params.key || ''
        }
    }, [location.search])

    useEffect(() => {
        const params = { ...queryParams, key: debounceValue, page: 0 }
        navigate(`?${queryString.stringify(params)}`)
        // eslint-disable-next-line
    }, [debounceValue])
    useEffect(() => {
        (async () => {
            const data = await patientsApi.getAllPatients({
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token'
                    )}`
                },
                params: queryParams
            })
            setPatientsData(data.patients)
            setPagination(data.page)
            setIsLoading(false)
        })()
    }, [queryParams])
    const handleChangeStatus = (id, status) => {
        (async () => {
            try {
                await userApi.toggleStatusUser(id, status, {
                    headers: {
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    }
                })
                const arrTemp = [...patientsData]
                const patientItem = arrTemp.find(x => x.user.id === id)
                patientItem.user.status = !status
                setPatientsData(arrTemp)
                toast.success('Thay đổi trạng thái thành công', {
                    position: toast.POSITION.BOTTOM_RIGHT
                })

            }
            catch (err) {
                toast.error(err.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
        })()
    }
    useEffect(() => {
        document.title = 'Quản lí bệnh nhân'
    }, [])
    if (isLoading) return <Loading />
    return (
        <div className="patientManagement">
            <div className="patientManagement__container">
                <header>Quản lí bệnh nhân</header>
                <div className="patientManagement__action">
                    <div className="patientManagement__action-search">
                        <SearchInput placeholder="Tìm kiếm bệnh nhân" mode = "list" handleSearch = {handleOnChangeSearchInput} value = {searchValue}/>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Họ tên</th>
                            <th>Giới tính</th>
                            <th>Ngày sinh</th>
                            <th>Số điện thoại</th>
                            {/* <th>Địa chỉ</th> */}
                            <th>Vi phạm</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patientsData.map(pateintItem => (
                            <tr key={pateintItem.id}>
                                <td>{pateintItem.id}</td>
                                <td>{pateintItem.user.email}</td>
                                <td>{`${pateintItem.user.firsname} ${pateintItem.user.lastname}`}</td>
                                <td>
                                    {pateintItem.user.gender === true
                                        ? 'Nam'
                                        : 'Nữ'}
                                </td>
                                <td>
                                    {
                                        pateintItem.user.birthday.split(
                                            'T'
                                        )[0]
                                    }
                                </td>
                                <td>
                                    {pateintItem.user.phoneNumber}
                                </td>
                                {/* <td>{pateintItem.user.address}</td> */}
                                <td>{!pateintItem.user.violation ? 0 : pateintItem.user.violation}</td>
                                <td>
                                    <SwitchButton
                                        id={pateintItem.user.id}
                                        status={
                                            pateintItem.user.status
                                        }
                                        handleChangeStatus={
                                            handleChangeStatus
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="patientManagement__pagination">
                    <Pagination totalPage={pagination.totalPages} currentPage={pagination.page} onClick = {handlePageChange}/>
                </div>
            </div>
        </div>
    )
}

export default PatientList