import http from '../utils/http'

const appointmentApi = {
    createAppointment(data, config) {
        return http.post('/appointment/patient-create', data, config)
    },
    getAllAppointment(params) {
        return http.get('/appointment', { params: params })
    },
    getDetailAppointment(id) {
        return http.get(`/appointment/${id}`)
    },
    cancelAppontment(id) {
        return http.put(`/appointment/cancel/${id}`)
    },
    deleteAppointment(id, config) {
        return http.delete(`/appointment/${id}`, { id: id }, config)
    },
    doctorAcceptAppointment(id, config) {
        return http.put(`/appointment/doctor-accept/${id}`, { id: id }, config)
    },
    doctorReportAppointment(id, config) {
        return http.put(`/appointment/doctor-report/${id}`, { id: id }, config)
    }
}
export default appointmentApi
