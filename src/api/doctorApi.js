import http from '../utils/http'

const doctorApi = {
    getAllDoctor(params) {
        return http.get('/doctor', { params: params })
    },
    addDoctor(data, config) {
        return http.post('/doctor', data, config)
    },
    updateDoctor(data, config) {
        return http.put(`/doctor/${data.get('id')}`, data, config)
    },
    getDetailDoctor(id) {
        return http.get(`/doctor/${id}`)
    }

}
export default doctorApi