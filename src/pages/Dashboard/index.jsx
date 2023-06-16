/* eslint-disable no-unused-vars */
import appointmentApi from 'api/appointmentApi'
import clinicApi from 'api/clinicApi'
import doctorApi from 'api/doctorApi'
import hospitalApi from 'api/hospitalApi'
import patientsApi from 'api/patientsApi'
import revenueApi from 'api/revenueApi'
import Loading from 'components/Loading'
import React, { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import { AiFillSchedule } from 'react-icons/ai'
import { FaClinicMedical, FaHospital, FaUserAlt, FaUserNurse } from 'react-icons/fa'
import strftime from 'strftime'
import getArrDateInYear from 'utils/getArrDateInYear'
import DashboardItem from './DashboardItem'
import './index.scss'
import MultiBarChart from './MultiBarChart'
import PieChart from './PieChart'
import ProfitCompanyChart from './ProfitCompanyChart'

function Dashboard() {
    const [isLoading, setIsLoading] = useState(true)
    const [listTime, setListTime] = useState(() => getArrDateInYear())
    const [date, setDate] = useState(() => new Date())
    const [countItems, setCountItems] = useState({
        countClinic: 0,
        countHospital: 0,
        countDoctor: 0,
        countPatient: 0,
        countAppoiment: 0
    })

    const getRevenueAllSpecialties = month => {
        const endDateOfMonth = new Date(
            month.getFullYear(),
            month.getMonth() + 1,
            0
        )
        const valueCall = {
            begin: strftime('%Y-%m-01', month),
            end: strftime('%Y-%m-%d', endDateOfMonth)
        }
        ;(async () => {
            try {
                const respone =
                    await revenueApi.getRevenueAllSpecialist({
                        headers: {
                            Authorization: `${localStorage.getItem(
                                'access_token'
                            )}`
                        },
                        params: valueCall
                    })
                setDataPieChart(respone.message)
            } catch (err) {
                return err.message
            }
        })()
    }
    const [dataPieChart, setDataPieChart] = useState([])
    const handleMonthChange = month => {
        setDate(month)
        getRevenueAllSpecialties(month)
    }
    useEffect(() => {
        getRevenueAllSpecialties(date)
    }, [date])
    //Get Profits of the Company
    const [statisticalData, setStatisticalData] = useState([])
    const getStatisticalInfo = (queryParams) => {
        try {
            const promise = revenueApi.getRevenueStatistical({
                headers: {
                    Authorization: `${localStorage.getItem(
                        'access_token'
                    )}`
                },
                params: queryParams
            })
            return promise
        } catch (err) {
            return err.message
        }
    }
    useEffect(() => {
        (async () => {
            try {
                const dataClinic = await clinicApi.getAllClinic()
                const dataHospital = await hospitalApi.getAllHospital()
                const dataDoctor = await doctorApi.getAllDoctor()
                const dataPatient = await patientsApi.getAllPatients({
                    headers: {
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    }
                })
                const dataAppointment =await appointmentApi.getAllAppointment({
                    headers: {
                        Authorization: `${localStorage.getItem(
                            'access_token'
                        )}`
                    },
                    params: { date: strftime('%Y-%m-%d', new Date()) }
                })
                setCountItems({
                    countClinic: dataClinic.page.totalElements,
                    countHospital: dataHospital.page.totalElements,
                    countDoctor: dataDoctor.page.totalElements,
                    countPatient: dataPatient.page.totalElements,
                    countAppoiment: dataAppointment.page.totalElements
                })
            } catch (err) {
                return err.message
            }
        })()
        const promises = []
        listTime.forEach(time => {
            promises.push(getStatisticalInfo(time))
        })
        Promise.all(promises).then(resultArr => {
            setStatisticalData(resultArr.map(result => result.statistics))
            setIsLoading(false)

        })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        document.title = 'Tổng quan'
    }, [])
    if (isLoading) return <Loading />
    return (
        <div className='dashboard'>
            <div className='dashboard__itemInstance'>
                <DashboardItem name="Phòng khám" count={countItems.countClinic} icon = {<FaClinicMedical />}/>
                <DashboardItem name="Bệnh viện" count={countItems.countHospital} icon = {<FaHospital />}/>
                <DashboardItem name="Bác sĩ" count={countItems.countDoctor} icon = {<FaUserNurse />}/>
                <DashboardItem name="Bệnh nhân" count={countItems.countPatient} icon = { <FaUserAlt />}/>
                <DashboardItem name="Cuộc hẹn hôm nay" count={countItems.countAppoiment} icon = {<AiFillSchedule />}/>
            </div>
            <div className="dashboard__chart">
                <div className="dashboard__chart-barchart">
                    {statisticalData.length > 0 && (
                        <MultiBarChart dataRevenue={statisticalData} />
                    )}
                </div>
                <div className="dashboard__chart-piechart">
                    <div>
                        <label>Tháng/Năm</label>
                        <ReactDatePicker
                            selected={date}
                            showMonthYearPicker
                            onChange={handleMonthChange}
                        />
                    </div>
                    <div>
                        {dataPieChart.length > 0 && (
                            <PieChart pieChartData={dataPieChart} />
                        )}
                    </div>
                </div>

            </div>
            <div className= "dashboard__chart-profits-company">
                <ProfitCompanyChart dataProfitsCompany = {statisticalData} />
            </div>
        </div>
    )
}

export default Dashboard
