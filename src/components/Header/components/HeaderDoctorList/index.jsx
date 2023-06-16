import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GrFormPreviousLink } from 'react-icons/gr'
import './index.scss'
import DoctorItem from 'components/DoctorItem'
import SearchInput from 'components/SearchInput'
import doctorApi from 'api/doctorApi'
import queryString from 'query-string'
import { useDebounce } from 'hooks/useDebounce'
import { path } from 'constants/path'

function HeaderDoctorList() {
    const [data, setData] = useState([])
    const location = useLocation()
    const [searchValue, setSearchValue] = useState(() => queryString.parse(location.search).key)
    const debounceValue = useDebounce(searchValue, 500)
    const navigate = useNavigate()
    const handleSearchDoctor = (e) => {
        setSearchValue(e.target.value)
    }
    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search)
        return {
            page: Number.parseInt(params.page) || 0,
            limit: Number.parseInt(params.limit) || 1000,
            keyword: params.key || ''
        }
    }, [location.search])

    useEffect(() => {
        const params = { key: debounceValue }
        navigate(`?${queryString.stringify(params)}`)
        // eslint-disable-next-line
    }, [debounceValue])

    useEffect(() => {
        (async () => {
            try {
                const data = await doctorApi.getAllDoctor(queryParams)
                setData(data.data.listItem)
            }
            catch (err) {
                alert(err)
            }
        })()
    }, [queryParams])
    return (
        <div className="headerLinkComponent">
            <div className="headerLinkComponent__container">
                <header className="headerLinkComponent__header">
                    <button
                        className="headerLinkComponent__header-btn"
                        onClick={() => navigate(path.home)}
                        style={{ paddingTop: 14 }}
                    >
                        <GrFormPreviousLink />
                    </button>
                    <span>Bác sĩ</span>
                </header>
                <div className="headerLinkComponent__search">
                    <SearchInput placeholder="Tìm kiếm bác sĩ" mode="list" handleSearch={handleSearchDoctor} value={searchValue} />
                </div>
                <ul className="headerLinkComponent__list">
                    {data.map(doctor => <DoctorItem data={doctor} key={doctor.id} mode="listColumn" />)}
                </ul>
            </div>
        </div>
    )
}

export default HeaderDoctorList
