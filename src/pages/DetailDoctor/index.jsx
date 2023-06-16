import doctorApi from 'api/doctorApi'
import Loading from 'components/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookTimeTable from './components/BookTimeTable'
import DoctorProfile from './DoctorProfile'

function DetailDoctor() {
    const { id } = useParams()
    const [doctor, setDoctor] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        (async () => {
            try {
                const respone = await doctorApi.getDetailDoctor(id)
                setDoctor(respone.data)
                setIsLoading(false)
            } catch (err) {
                alert(err)
            }
        })()
    }, [id])
    useEffect(() => {
        document.title = doctor.user ? doctor.user.fullName : ''
    }, [doctor])
    if (isLoading) return <Loading />
    return (
        <div className="detailDoctor">
            <div className="detailDoctor__container">
                <DoctorProfile doctor={doctor} />
                <BookTimeTable doctor={doctor} />
                <div style={{ padding: '30px 0 30px 80px', borderTop: '1px solid rgb(0 0 0 / 22%)' }} dangerouslySetInnerHTML={{ __html: doctor.description }}></div>
            </div>
        </div>
    )
}

export default DetailDoctor
