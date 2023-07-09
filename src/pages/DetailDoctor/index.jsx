import doctorApi from 'api/doctorApi'
import Loading from 'components/Loading'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookTimeTable from './components/BookTimeTable'
import DoctorProfile from './DoctorProfile'
import rateApi from 'api/rateApi'
import PatientFeedback from 'components/PatientFeedback/PatientFeedback'
import './index.scss'

function DetailDoctor() {
    const { id } = useParams()
    const [doctor, setDoctor] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [rates, setRates] = useState([])
    useEffect(() => {
        (async () => {
            try {
                const respone = await doctorApi.getDetailDoctor(id)
                setDoctor(respone.data)
                setIsLoading(false)
                const resRate = await rateApi.getAllRate({doctorId: id})
                setRates(resRate.data)
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
        <div className="detailDoctor" style={{width: '85%', margin: 'auto'}}>
            <div className="detailDoctor__container">
                <DoctorProfile doctor={doctor} />
                <BookTimeTable doctor={doctor} />
                <div className='doctor_description' style={{ padding: '30px 50px 30px 50px', borderTop: '1px solid rgb(0 0 0 / 22%)'}} dangerouslySetInnerHTML={{ __html: doctor.description }}></div>
                {rates && (<PatientFeedback rates={rates}/>)}
            </div>
        </div>
    )
}

export default DetailDoctor
