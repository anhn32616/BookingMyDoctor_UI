import authApi from 'api/authApi'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import './index.scss'
import Loading from 'components/Loading'
import { Button, Result } from 'antd'
function VerifyEmail() {
    const [isLoading, setIsLoading] = useState(true)
    const [resultApi, setResultApi] = useState()
    useEffect(() => {
        document.title = 'Xác thực email'
    }, [])
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        (async () => {
            try {
                await authApi.verifyAccount(queryString.parse(location.search).token)
                setResultApi(true)
            }
            catch (err) {
                setResultApi(false)
            }
            setIsLoading(false)
        })()
    }, [location, navigate])
    const navigateLoginPage = () => {
        navigate('/login')
    }
    if (isLoading) return <Loading />
    return (
        <div className='verify-wrapper'>
            <div className="card">
                {resultApi !== null && (<>
                    {resultApi == true ? (<>
                        <Result
                            status="success"
                            title="Xác thực thành công!"
                            extra={[
                                <Button type="primary" onClick={navigateLoginPage}>
                                    Đăng nhập
                                </Button>
                            ]}
                        />
                    </>) :
                        (<>
                            <Result
                                status="error"
                                title="Xác thực thất bại!"
                            />
                        </>)}
                </>)}

            </div>
        </div>
    )
}

export default VerifyEmail
