import specialistApi from 'api/specialistApi'
import DoctorItem from 'components/DoctorItem'
import Loading from 'components/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './index.scss'
DetailSpecialist.propTypes = {}

function DetailSpecialist() {
    const { id } = useParams('id')
    const [dataSpecialty, setDataSpecialty] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        (async () => {
            try {
                const respone = await specialistApi.getDetailSpecialist(id)
                setDataSpecialty(respone.data)
                setIsLoading(false)
            } catch (err) {
                alert(err)
            }
        })()
    }, [id])
    useEffect(() => {
        document.title = dataSpecialty ? dataSpecialty.name : ''
    }, [dataSpecialty])
    if (isLoading) return <Loading />
    return (
        <div className="detailSpecialist">
            <div className="detailSpecialist__container">
                <header>Chuyên khoa {dataSpecialty.name}</header>
                <div className="detailSpecialist__content">
                    <ul className="detailSpecialist__content-doctorsList">
                        {
                            dataSpecialty.doctors.length > 0 && dataSpecialty.doctors.map(doctor => <DoctorItem mode="listColumn" key = {doctor.id} data = {doctor} />)
                        }
                        {
                            dataSpecialty.doctors.length <= 0 && <span>Không có bác sĩ nào</span>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default DetailSpecialist
