import { useSelector } from 'react-redux'

export function useSystemAuthenticated() {
    const role = useSelector(state => state.user.profile.roleName)
    if (role && (role === 'ROLE_DOCTOR'))
        return true
    return false
}