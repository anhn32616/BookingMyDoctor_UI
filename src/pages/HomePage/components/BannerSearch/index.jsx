import doctorApi from 'api/doctorApi'
import hospitalApi from 'api/hospitalApi'
import specialistApi from 'api/specialistApi'
import images from 'assets'
import SearchInput from 'components/SearchInput'
import useComponentVisible from 'hooks/useComponentVisible'
import { useDebounce } from 'hooks/useDebounce'
import React, { useEffect, useState } from 'react'
import SearchBannerResult from '../SearchBannerResult'
import './index.scss'

function BannerSearch() {
    const { ref, isComponentVisible } =
        useComponentVisible(true)
    const [searchValue, setSearchValue] = useState('')
    const handleSearchInput = e => setSearchValue(e.target.value)
    const debounceValue = useDebounce(searchValue, 500)
    const [doctors, setDoctors] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [specialtys, setSpecialtys] = useState([])
    useEffect(() => {
        (async () => {
            if (debounceValue === '') {
                setDoctors([])
                setHospitals([])
                setSpecialtys([])
                return
            }
            const params = { keyword: debounceValue, page: 0, limit: 5 }
            const respones = await Promise.all([
                doctorApi.getAllDoctor(params),
                hospitalApi.getAllHospital(params),
                specialistApi.getAllSpecialist(params)
            ])
            setDoctors(respones[0].data.listItem)
            setHospitals(respones[1].data.listItem)
            setSpecialtys(respones[2].data.listItem)
        })()
    }, [debounceValue])
    return (
        <div className="bannerSearch">
            <div className="bannerSearch__container">
                <div className="bannerSearch__content">
                    <div className="bannerSearch__title">
                        <h1>Ứng dụng tìm kiếm và đặt lịch bác sĩ</h1>
                        <span>
                            Giải pháp y tế thông minh giúp tối ưu kết
                            nối, chăm sóc sức khỏe tốt hơn cho cả bạn
                            và gia đình
                        </span>
                    </div>
                    <div className="bannerSearch__input-container" ref={ref}>
                        <SearchInput
                            placeholder="Bác sĩ, phòng khám, chuyên khoa ..."
                            handleSearch={handleSearchInput}
                            value={searchValue}
                        />
                        {isComponentVisible && debounceValue &&
                        (
                            <SearchBannerResult
                                doctors={doctors}
                                hospitals={hospitals}
                                specialtys={specialtys}
                            />
                        )}
                    </div>
                </div>

                <div className="bannerSearch__img">
                    <img
                        src={images.bannerSearchImg}
                        alt="bannerSearch Img"
                    />
                </div>
            </div>
        </div>
    )
}

export default BannerSearch
