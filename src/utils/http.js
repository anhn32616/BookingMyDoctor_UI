import axios from 'axios'
class Http {
    constructor() {
        this.instance = axios.create({
            baseURL: 'https://localhost:7042/api/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        })
        this.instance.interceptors.response.use(
            reponse => {
                const result = {
                    ...reponse.data,
                    status: reponse.status
                }
                return result
            },
            error => {
                // if (error.response.status === 403) {
                //     localStorage.removeItem('access_token')
                //     localStorage.removeItem('user')
                // }
                return Promise.reject(error.response.data)
            }
        )
        this.instance.interceptors.request.use(
            config => {
                return config
            },
            error => {
                return Promise.reject(error.reponse)
            }
        )
    }
    get(url, config = null) {
        return this.instance.get(url, config)
    }
    post(url, data, config = null) {
        return this.instance.post(url, data, config)
    }
    put(url, data, config = null) {
        return this.instance.put(url, data, config)
    }
    delete(url, data, config = null) {
        return this.instance.delete(url, {
            data,
            ...config
        })
    }
    updateToken(token) {
        this.instance.defaults.headers['Authorization'] = `Bearer ${token}`;
    }
}
const http = new Http()
export default http
