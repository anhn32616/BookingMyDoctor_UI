import doctorApi from 'api/doctorApi'
import DoctorItemSkeleton from 'components/DoctorItemSkeleton'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import DoctorItem from '../../../../components/DoctorItem'
import './index.scss'

function TopDoctors() {
    const [data, setData] = useState([])
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
            const respone = await doctorApi.getAllDoctor()
            setData(respone.data.listItem.slice(0, 6))
        })()
    }, [])
    return (
        <div className="topDoctors">
            <div className="topDoctors__container">
                <header>Bác sĩ tiêu biểu</header>
                {data.length > 0 ? (
                    <Slider {...settings}>
                        {data.map(doctor => (
                            <DoctorItem
                                data={doctor}
                                key={doctor.id}
                            />
                        ))}
                    </Slider>
                ) : (
                    <Slider {...settings}>
                        {Array(6)
                            .fill(1)
                            .map((item, index) => (
                                <DoctorItemSkeleton key={index} />
                            ))}
                    </Slider>
                )}
            </div>
        </div>
    )
}

export default TopDoctors
