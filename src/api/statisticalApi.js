import http from '../utils/http'

const statisticalApi = {
    getStatisticalOfDoctor(params) {
        return http.get('/statistical/doctor',{ params: params })
    },

}
export default statisticalApi