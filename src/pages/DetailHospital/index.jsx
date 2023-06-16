import hospitalApi from 'api/hospitalApi'
import DoctorItem from 'components/DoctorItem'
import Loading from 'components/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './index.scss'

function DetailHospital() {
    const { id } = useParams('id')
    const [data, setData] = useState()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        (async () => {
            try {
                const respone = await hospitalApi.getDetailHospital(
                    id
                )
                setData(respone.data)
                setIsLoading(false)
            } catch (err) {
                alert(err)
            }
        })()
    }, [id])
    useEffect(() => {
        document.title = data ? data.name : ''
    }, [data])
    if (isLoading) return <Loading />
    return (
        <div className="detailClinic">
            <div className="detailClinic__container">
                <header>{data.name}</header>
                <p>{data.address}, {data.ward}, {data.district}, {data.city}</p>
                <div className="detailClinic__content">
                    <ul className="detailClinic__content-doctorsList">
                        {data.doctors.length > 0 && data.doctors.map(doctor => (
                            <DoctorItem
                                mode="listColumn"
                                key={doctor.id}
                                data={doctor}
                            />
                        ))}
                        {data.doctors.length <= 0 && <span>Không có bác sĩ nào</span>}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DetailHospital
