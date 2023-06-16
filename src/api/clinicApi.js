import http from '../utils/http'

const clinicApi = {
    getAllClinic(params) {
        return http.get('/clinic', { params: params })
    },
    addClinic(data, config) {
        return http.post('/clinic', data, config)
    },
    updateClinic(data, config) {
        return http.put(`/clinic/${data.get('id')}`, data, config)
    }
}
export default clinicApi