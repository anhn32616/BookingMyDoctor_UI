import DoctorItem from 'components/DoctorItem'
import HospitalItem from 'components/HospitalItem'
import React from 'react'
import SpecialistItem from '../SpecialistList/components/SpecialistItem'
import './index.scss'

function SearchBannerResult({
    doctors,
    hospitals,
    specialtys
}) {
    return (
        <div className="searchBannerResult">
            <div className="searchBannerResult__container">
                {!(doctors.length > 0 || hospitals.length > 0 || specialtys.length > 0) ? (<><div className="searchBannerResult__item" style={{ padding: 10 }}>Không có kết quả tìm kiếm</div></>) :
                    (<>
                        {doctors.length > 0 && (
                            <div className="searchBannerResult__item">
                                <header>Bác sĩ</header>
                                <ul className="searchBannerResult__item-list">
                                    {doctors.map(doctor => (
                                        <DoctorItem
                                            data={doctor}
                                            key={doctor.id}
                                            mode="listColumn"
                                        />
                                    ))}
                                </ul>
                            </div>
                        )}
                        {hospitals.length > 0 && (
                            <div className="searchBannerResult__item">
                                <header>Bệnh viện</header>
                                <ul className="searchBannerResult__item-list">
                                    {hospitals.map(hospital => (
                                        <HospitalItem
                                            key={hospital.id}
                                            data={hospital}
                                            mode="cpm-list"
                                        />
                                    ))}
                                </ul>
                            </div>
                        )}
                        {specialtys.length > 0 && (
                            <div className="searchBannerResult__item">
                                <header>Chuyên khoa</header>
                                <ul className="searchBannerResult__item-list">
                                    {specialtys.map(specialist => (
                                        <SpecialistItem
                                            data={specialist}
                                            key={specialist.id}
                                            mode="column"
                                        />
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>)}

            </div>
        </div>
    )
}

export default SearchBannerResult
