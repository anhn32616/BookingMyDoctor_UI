import React, { useEffect } from 'react'
import BannerSearch from './components/BannerSearch'
import Introduce from './components/Introduce'
import SpecialistList from './components/SpecialistList'
import TopDoctors from './components/TopDoctors'
import './index.scss'
import TopHospitals from './components/TopHospitals'

function HomePage() {
    useEffect(() => {
        document.title = 'Trang chủ'
    }, [])
    return (
        <div className="homePage">
            <BannerSearch />
            <TopDoctors />
            <SpecialistList />
            <TopHospitals />
            <Introduce />
        </div>
    )
}

export default HomePage
