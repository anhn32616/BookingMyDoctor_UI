import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { path } from 'constants/path'
import { AiFillEdit } from 'react-icons/ai'
import hospitalApi from 'api/hospitalApi'
import './index.scss'
import Loading from 'components/Loading'
import queryString from 'query-string'
import SearchInput from 'components/SearchInput'
import { useDebounce } from 'hooks/useDebounce'
import Pagination from 'components/Pagination'
function HospitalManagement() {
    const [isLoading, setIsLoading] = useState(true)

    const [hospitalList, setHospitalList] = useState([])
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
                const data = await hospitalApi.getAllHospital(queryParams)
                setHospitalList(data.hospital)
                setPagination(data.page)
                setIsLoading(false)
            } catch (err) {
                alert(err)
            }
        })()
    }, [queryParams])
    useEffect(() => {
        document.title = 'Quản lí bệnh viện'
    }, [])
    if (isLoading) return <Loading />
    return (
        <div className="hospitalManagement">
            <div className="hospitalManagement__container">
                <header>Quản lí bệnh viện</header>
                <div className="hospitalManagement__action">
                    <div className="hospitalManagement__action-search">
                        <SearchInput placeholder="Tìm kiếm bệnh viện" mode = "list" handleSearch = {handleOnChangeSearchInput} value = {searchValue}/>
                    </div>
                    <button
                        className="btnSuccess"
                        onClick={() => navigate(path.addHospital)}
                    >
                        Thêm bệnh viện mới
                    </button>

                </div>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên phòng khám</th>
                            <th>Đường</th>
                            <th>Tỉnh, thành phố</th>
                            <th>Chỉnh sửa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospitalList.map(hospitalItem => (
                            <tr key={hospitalItem.id}>
                                <td>{hospitalItem.id}</td>
                                <td>{hospitalItem.name}</td>
                                <td>{hospitalItem.street}</td>
                                <td>{hospitalItem.city}</td>
                                <td>
                                    <Link
                                        to={`/system/updateHospital/${hospitalItem.id}`}
                                        state={{ hospitalItem }}
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
                <div className="hospitalManagement__pagination">
                    <Pagination totalPage={pagination.totalPages} currentPage={pagination.page} onClick = {handlePageChange}/>
                </div>
            </div>
        </div>
    )
}

export default HospitalManagement