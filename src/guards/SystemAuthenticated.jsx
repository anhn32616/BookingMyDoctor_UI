import React from 'react'
import { useSystemAuthenticated } from 'hooks/useSystemAuthenticated'
import { Navigate, Outlet } from 'react-router-dom'
import { path } from 'constants/path'


function SystemAuthenticated() {
    const systemAuthenticated = useSystemAuthenticated()
    if (!systemAuthenticated) return <Navigate to={path.home} />
    return (
        <>
            <Outlet />
        </>
    )
}

export default SystemAuthenticated
