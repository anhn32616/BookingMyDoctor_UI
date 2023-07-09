import HeaderClinicList from 'components/Header/components/HeaderClinicList'
import HeaderDoctorList from 'components/Header/components/HeaderDoctorList'
import HeaderSpecialist from 'components/Header/components/HeaderSpecialist'
import { path } from 'constants/path'
import AuthenticatedGuard from 'guards/AuthenticatedGuard'
import SystemAuthenticated from 'guards/SystemAuthenticated'
import UnauthenticatedGuard from 'guards/UnauthenticatedGuard'
import AuthLayout from 'layouts/AuthLayout'
import MainLayout from 'layouts/MainLayout'
import SystemLayout from 'layouts/SystemLayout'
import ForgotPassWordForm from 'pages/Auth/ForgotPassword'
import Login from 'pages/Auth/Login'
import Register from 'pages/Auth/Register'
import BookAppointment from 'pages/BookAppointment'
import AddClinic from 'pages/Clinic/AddClinic'
import ClinicManagement from 'pages/Clinic/ClinicManagement'
import UpdateClinic from 'pages/Clinic/UpdateClinic'
import DetailDoctor from 'pages/DetailDoctor'
import DetailSpecialist from 'pages/DetailSpecialist'
import AddDoctor from 'pages/Doctor/AddDoctor'
import DoctorManagement from 'pages/Doctor/DoctorManagement'
import UpdateDoctor from 'pages/Doctor/UpdateDoctor'
import HomePage from 'pages/HomePage'
import AddHospital from 'pages/Hospital/AddHospital'
import HospitalManagement from 'pages/Hospital/HospitalManagement'
import UpdateHospital from 'pages/Hospital/UpdateHospital'
import PatientList from 'pages/Patient/PatientList'
import Profile from 'pages/Profile'
import AddSpecialist from 'pages/Specialist/AddSpecialist'
import EditSpecialist from 'pages/Specialist/EditSpecialist'
import SpecialistManagement from 'pages/Specialist/SpecialistManagement'
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import DetailHospital from 'pages/DetailHospital'
import ScheduleDoctorManagement from 'pages/Schedule/ScheduleDoctorManagement'
import AddSchedule from 'pages/Schedule/AddSchedule'
import AppointmentManagement from 'pages/Appointment/AppointmentManagement'
import AppointmentManager from 'pages/Profile/components/AppointmentManager'
import RevenueManagement from 'pages/Revenue/RevenueManagement'
import MesageApp from 'pages/MessageApp'
import PaymentReturn from 'pages/PaymentReturn'
import Dashboard from 'pages/Dashboard'
import MesageAppLayout from 'pages/MessageAppLayout'
import VerifyEmail from 'pages/Auth/VerifyEmail'
import AppointmentTablePatient from 'pages/Appointment/AppointmentTablePatient/AppointmentTablePatient'
import Main from 'components/layout/Main'
import ScrollToTop from 'components/ScrollToTop/ScrollToTop'
import SchedulesTable from 'pages/Schedule/ScheduleTable/ScheduleTable'
import AppointmentsTableDoctor from 'pages/Appointment/AppointmentTableDoctor/AppointmentTableDoctor'
import Revenue from 'pages/Revenue copy/Revenue'
import VnPayReturn from 'pages/Payment/VnPayReturn'
import MessageProvider from 'Context/MessageContext'
import ChatPage from 'pages/Chat/ChatPage'
import TimetableManage from 'pages/TimetableManage/TimetableManage'
import PaymentManage from 'pages/PaymentManage/PaymentManage'


function RoutesComponent() {
    return (
        <MessageProvider>
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route path={path.veirifyEmail} element={<VerifyEmail />} />
                    <Route element={<MainLayout />}>
                        <Route path={path.home} element={<HomePage />} />
                        <Route path={path.detailDoctor} element={<DetailDoctor />} />
                        <Route path={path.detailSpecialist} element={<DetailSpecialist />} />
                        <Route path={path.detailHospital} element={<DetailHospital />} />
                    </Route>
                    <Route path={path.headerClinic} element={<HeaderClinicList />} />
                    <Route path={path.headerDoctor} element={<HeaderDoctorList />} />
                    <Route path={path.headerSpecialist} element={<HeaderSpecialist />} />
                    <Route path={path.paymentReturn} element={<VnPayReturn />} />
                    <Route element={<SystemAuthenticated />}>
                        <Route path={path.system} element={<Main />}>
                            <Route path={path.specialistManagement} element={<SpecialistManagement />} />
                            <Route path={path.addSpecialist} element={<AddSpecialist />} />
                            <Route path={path.editSpecialist} element={<EditSpecialist />} />
                            <Route path={path.clinicManagement} element={<ClinicManagement />} />
                            <Route path={path.timetableManage} element={<TimetableManage />} />
                            <Route path={path.addClinic} element={<AddClinic />} />
                            <Route path={path.updateClinic} element={<UpdateClinic />} />

                            <Route path={path.hospitalManagement} element={<HospitalManagement />} />
                            <Route path={path.paymentManage} element={<PaymentManage />} />
                            <Route path={path.addHospital} element={<AddHospital />} />
                            <Route path={path.updateHospital} element={<UpdateHospital />} />
                            <Route path={path.patientManagement} element={<PatientList />} />

                            <Route path={path.doctorManagement} element={<DoctorManagement />} />
                            <Route path={path.addDoctor} element={<AddDoctor />} />
                            <Route path={path.updateDoctor} element={<UpdateDoctor />} />
                            <Route path={path.scheduleManagement} element={<SchedulesTable />} />
                            <Route path={path.addSchedule} element={<AddSchedule />} />

                            <Route path={path.appointmentManagement} element={<AppointmentsTableDoctor />} />

                            <Route path={path.revenueManagement} element={<Revenue />} />
                            <Route path={path.dashBoard} element={<Dashboard />} />
                        </Route>
                    </Route>
                    <Route element={<AuthenticatedGuard />}>
                        <Route path={path.messageAppLayout} element={<ChatPage />} />
                        <Route path={path.messageApp} element={<ChatPage />} />
                        <Route element={<MainLayout />}>
                            <Route path={path.profile} element={<Profile />} />
                            <Route path={path.bookAppointment} element={<BookAppointment />} />
                            <Route path={path.myAppointment} element={<AppointmentTablePatient />} />
                        </Route>
                    </Route>
                    <Route element={<UnauthenticatedGuard />}>
                        <Route element={<AuthLayout />}>
                            <Route path={path.login} element={<Login />} />
                            <Route path={path.register} element={<Register />} />
                            <Route path={path.forgotPassword} element={<ForgotPassWordForm />} />
                        </Route>
                    </Route>
                    <Route path={path.returnPayment} element={<PaymentReturn />} />
                </Routes>
            </BrowserRouter>
        </MessageProvider>
    )
}

export default RoutesComponent