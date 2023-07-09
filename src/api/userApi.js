import http from '../utils/http'

const userApi = {
    changePassword(data, config) {
        return http.put(`/user/changepass`, data, config)
    },
    updateInfoUser(data, config) {
        return http.put(`/user/profile`, data, config)
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
    getAdminId() {
        return http.get('/user/getAdminId')
    },
    getBaseProfile() {
        return http.get('/user/users-base-info')
    },
    getBaseProfileById(id) {
        return http.get('/user/users-base-info', { params : {userId: id}})
    },
}
export default userApi