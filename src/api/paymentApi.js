import http from '../utils/http'

const paymentApi = {
    getAllPayment(params) {
        return http.get('/payment', { params: params })
    },
    getPaymentInfo() {
        return http.get('/payment/info')
    },
    createPayment() {
        return http.post(`/payment`)
    },
    returnPayment(queryString) {
        return http.get(`/payment/return` + queryString)
    },
    getDetailPayment(id) {
        return http.get(`/payment/${id}`)
    },
    deletePayment(id, config) {
        return http.delete(`/payment/${id}`, { id: id }, config)
    }
}
export default paymentApi