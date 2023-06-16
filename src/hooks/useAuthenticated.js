import { useSelector } from 'react-redux'

export function useAuthenticated() {
    return useSelector(state => state.user.profile.email && Boolean(localStorage.getItem('access_token')))
}
