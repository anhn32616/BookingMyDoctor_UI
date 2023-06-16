import http from '../utils/http'

const specialistApi = {
    getAllSpecialist(params) {
        return http.get('/speciatly', { params: params })
    },
    addSpecialist(data, config) {
        return http.post('/speciatly', data, config)
    },
    updateSpecialist(data, config) {
        return http.put(`/speciatly/${data.get('id')}`, data, config)
    },
    getDetailSpecialist(id) {
        return http.get(`/speciatly/${id}`)
    }
}
export default specialistApi
