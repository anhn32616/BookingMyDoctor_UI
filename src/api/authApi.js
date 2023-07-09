import http from '../utils/http'

const authApi = {
    login(data) {
        return http.post('/auth/login', data)
    },
    signup(data, config) {
        return http.post('/auth/register', data, config)
    },
    verifyAccount(token) {
        return http.get(`/auth/verified?token=${token}`)
    },
    forgotPass(data) {
        return http.post(`/auth/forgot`, data)
    }
}
export default authApi
