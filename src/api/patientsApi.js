import http from '../utils/http'

const patientsApi = {
    updatePatient(data) {
        return http.put(`/patients/${data.get('id')}`, data)
    },
    getAllPatients(config) {
        return http.get('/patients', config)
    }
}
export default patientsApi