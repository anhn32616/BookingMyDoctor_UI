import React from 'react'
import { useAuthenticated } from 'hooks/useAuthenticated'
import { Navigate, Outlet } from 'react-router-dom'
import { path } from 'constants/path'


function AuthenticatedGuard() {
    const authenticated = useAuthenticated()
    if (!authenticated) return <Navigate to={path.login} />
    return (
        <>
            <Outlet />
        </>
    )
}

export default AuthenticatedGuard
