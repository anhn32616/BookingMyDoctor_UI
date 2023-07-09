import http from '../utils/http'

const timetableApi = {
    getAllTimetable(params) {
        return http.get('/timetable', { params: params })
    },
    addTimetable(data) {
        return http.post('/timetable', data)
    },
    updateTimetable(data, config) {
        console.log(data.id);
        return http.put(`/timetable/${data.id}`, data, config)
    },
    getDetailTimetable(id) {
        return http.get(`/timetable/${id}`)
    },
    deleteTimetable(id, config) {
        return http.delete(`/timetable/${id}`, { id: id }, config)
    }
}
export default timetableApi
