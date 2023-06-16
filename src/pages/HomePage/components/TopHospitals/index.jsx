import hospitalApi from 'api/hospitalApi'
import HospitalItemSkeleton from 'components/HospitalSkeleton'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import HospitalItem from '../../../../components/HospitalItem'
import './index.scss'
function TopHospitals() {
    const [hospitalData, setHospitalData] = useState([])
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 2,
        initialSlide: 0,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false
                }
            }
        ]
    }
    useEffect(() => {
        (async () => {
            const data = await hospitalApi.getAllHospital()
            setHospitalData(data.data.listItem.slice(0, 6))
        })()
    }, [])
    return (
        <div className="topHospitals">
            <div className="topHospitals__container">
                <header>Bệnh viện tiêu biểu</header>
                {hospitalData.length > 0 ? (
                    <Slider {...settings}>
                        {hospitalData.map(hospital => (
                            <HospitalItem
                                key={hospital.id}
                                data={hospital}
                            />
                        ))}
                    </Slider>
                ) : (
                    <Slider {...settings}>
                        {Array(6)
                            .fill(1)
                            .map((item, index) => (
                                <HospitalItemSkeleton key={index} />
                            ))}
                    </Slider>
                )}
            </div>
        </div>
    )
}

export default TopHospitals
