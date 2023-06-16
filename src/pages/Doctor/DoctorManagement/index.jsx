import doctorApi from 'api/doctorApi'
import { path } from 'constants/path'
import React, { useEffect, useMemo, useState } from 'react'
import { AiFillEdit } from 'react-icons/ai'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './index.scss'
import queryString from 'query-string'
import SearchInput from 'components/SearchInput'
import { useDebounce } from 'hooks/useDebounce'
import Loading from 'components/Loading'
import Pagination from 'components/Pagination'

function DoctorManagement() {
    const [isLoading, setIsLoading] = useState(true)

    const [dataListDoctors, setDataListDoctors] = useState([])
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
            limit: Number.parseInt(params.limit) || 10,
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
            try {
                const data = await doctorApi.getAllDoctor(queryParams)
                setDataListDoctors(data.doctor)
                setPagination(data.page)
                setIsLoading(false)
            } catch (err) {
                alert(err)
            }
        })()
    }, [queryParams])
    useEffect(() => {
        document.title = 'Quản lí bác sĩ'
    }, [])
    if (isLoading) return <Loading />
    return (
        <div className="doctorManagement">
            <div className="doctorManagement__container">
                <header>Quản lí Bác sĩ</header>
                <div className="doctorManagement__action">
                    <button
                        className="btnSuccess"
                        onClick={() => navigate(path.addDoctor)}
                    >
                        Thêm bác sĩ mới
                    </button>
                    <div className="clinicManagement__action-search">
                        <SearchInput
                            placeholder="Tìm kiếm bác sĩ"
                            mode="list"
                            handleSearch={handleOnChangeSearchInput}
                            value={searchValue}
                        />
                    </div>
                </div>
                <div className="table__wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên</th>
                                <th>Ngày sinh</th>
                                <th>Điện thoại</th>
                                <th>Giới tính</th>
                                <th>Email</th>
                                <th>Chuyên khoa</th>
                                <th>Phòng khám </th>
                                <th>Bệnh viện </th>
                                <th>Vi phạm</th>
                                <th>Chỉnh sửa </th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataListDoctors &&
                                dataListDoctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.id}</td>
                                        <td>{`${doctor.user.firsname} ${doctor.user.lastname}`}</td>
                                        <td>
                                            {
                                                doctor.user.birthday.split(
                                                    'T'
                                                )[0]
                                            }
                                        </td>
                                        <td>
                                            {doctor.user.phoneNumber}
                                        </td>
                                        <td>
                                            {doctor.user.gender === 1
                                                ? 'Nam'
                                                : 'Nữ'}
                                        </td>
                                        <td>{doctor.user.email}</td>
                                        <td>
                                            {doctor.specialty.name}
                                        </td>
                                        <td>{doctor.clinic.name}</td>
                                        <td>
                                            {doctor.hospital.name}
                                        </td>
                                        <td>{!doctor.user.violation ? 0 : doctor.user.violation}</td>
                                        <td>
                                            <Link
                                                to={`/system/updateDoctor/${doctor.id}`}
                                                state={{ doctor }}
                                            >
                                                <span className="edit__icon">
                                                    <AiFillEdit />
                                                </span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="doctorManagement__pagination">
                    <Pagination
                        totalPage={pagination.totalPages}
                        currentPage={pagination.page}
                        onClick={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default DoctorManagement
