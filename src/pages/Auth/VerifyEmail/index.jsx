import authApi from 'api/authApi'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import './index.scss'
import Loading from 'components/Loading'
function VerifyEmail() {
    const [isLoading, setIsLoading] = useState(true)
    const [resultApi, setResultApi] = useState(false)
    const [messageApi, setMessageApi] = useState('')
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
                setMessageApi(err.errMessage)
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
                <div className={`${resultApi ? 'card-icon--success' : 'card-icon--fail'} card-icon`}>
                    {resultApi && <i className="checkmark icon-success">✓</i>}
                    {!resultApi && <i className="checkmark icon-fail">X</i>}
                </div>
                <h1 className={`${resultApi ? 'h1--success' : 'h1--fail'}`}>{resultApi ? 'Xác thực thành công' : 'Xác thực thất bại'}</h1>
                {
                    resultApi && <p>
                    Vào trang đăng nhập để
                        <br />sử dụng hệ thống đặt lịch khám!
                    </p>
                }
                {
                    !resultApi && <p>{messageApi}</p>
                }
                {resultApi && <button className='btn btnSuccess' onClick={navigateLoginPage}>Đăng nhập</button>}
            </div>
        </div>
    )
}

export default VerifyEmail
