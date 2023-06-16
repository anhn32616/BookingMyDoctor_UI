import http from '../utils/http'

const messageApi = {
    addMessage(data, config) {
        return http.post('/messagechat', data, config)
    },
    getMessage(config) {
        return http.get('/messagechat', config)
    },
    getListUserChat(idUser, config) {
        return http.get(`/users/${idUser}/userchat`, config)
    }
}
export default messageApi
