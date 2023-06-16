import http from '../utils/http'

const paymentApi = {
    getAmountFee(id, config) {
        return http.get(`/payment/doctor/${id}/info`, config)
    },
    getLinkPayment(id) {
        return http.post('/payment-momo', { doctor_id: id })
    }
}
export default paymentApi
