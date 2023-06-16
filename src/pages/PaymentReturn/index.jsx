import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function PaymentReturn() {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/system/revenueManagement')
    }, [navigate])
    return <div>payment return</div>
}

export default PaymentReturn
