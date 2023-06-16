import http from '../utils/http'

const userApi = {
    changePassword(data, config) {
        return http.post(`/user/password/${data.id}`, data, config)
    },
    updateInfoUser(data, config) {
        return http.put(`/user/${data.get('id')}`, data, config)
    },
    getUserById(idUser, config) {
        return http.get(`/user/${idUser}`, config)
    },

    getMyProfile(config) {
        return http.get('/user/profile', config)
    },
    getAllPatient(params) {
        return http.get('/user', { params: { ...params, roleName: 'ROLE_PATIENT' } })
    },
}
export default userApi