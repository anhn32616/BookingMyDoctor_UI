import React from 'react'
import { Navigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { path } from 'constants/path'
import { useAuthenticated } from 'hooks/useAuthenticated'

function UnauthenticatedGuard() {
    const authenticated = useAuthenticated()

    if (authenticated) return <Navigate to={path.home} />
    return (
        <>
            <Outlet />
        </>
    )
}
export default UnauthenticatedGuard
