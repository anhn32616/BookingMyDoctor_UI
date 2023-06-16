import hospitalApi from 'api/hospitalApi'
import ClinicItem from 'components/HospitalItem'
import SearchInput from 'components/SearchInput'
import { useDebounce } from 'hooks/useDebounce'
import React, { useEffect, useMemo, useState } from 'react'
import { GrFormPreviousLink } from 'react-icons/gr'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import { path } from 'constants/path'

function HeaderClinicList() {
    const [hospitalData, setHospitalData] = useState([])
    const location = useLocation()
    const [searchValue, setSearchValue] = useState(() => queryString.parse(location.search).key)
    const debounceValue = useDebounce(searchValue, 500)
    const navigate = useNavigate()
    const handleSearchClinic = (e) => {
        setSearchValue(e.target.value)
    }
    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search)
        return {
            page: Number.parseInt(params.page) || 0,
            limit: Number.parseInt(params.limit) || 30,
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
                const data = await hospitalApi.getAllHospital(queryParams)
                setHospitalData(data?.data?.listItem)
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
                    >
                        <span>
                            <GrFormPreviousLink />
                        </span>
                    </button>
                    <span>Bệnh viện</span>
                </header>
                <div className="headerLinkComponent__search">
                    <SearchInput placeholder="Tìm kiếm bệnh viện" mode = "list" handleSearch = {handleSearchClinic} value = {searchValue}/>
                </div>
                <ul className="headerLinkComponent__list">
                    {hospitalData.map (hospital => <ClinicItem key={hospital.id} data = {hospital} mode = "cpm-list"/>)}
                </ul>
            </div>
        </div>
    )
}

export default HeaderClinicList
