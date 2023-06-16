import 'react-toastify/dist/ReactToastify.css'
import './_setting.scss'
import 'antd/dist/antd.min.css'
import 'assets/styles/main.css'
import 'assets/styles/responsive.css'
import 'assets/styles/public.css'
import { createContext, React } from 'react'
import { ToastContainer } from 'react-toastify'
import RoutesComponent from './routes'

// import { useDispatch, useSelector } from 'react-redux'
// import { getNotifies } from 'components/Header/components/Notification/notificationSlice'
// import { io } from 'socket.io-client'
// import SocketClient from 'SocketClient'
import 'react-loading-skeleton/dist/skeleton.css'
export const SocketContext = createContext()
function App() {
    return (
        <div className='App'>
            <ToastContainer autoClose={2000}/>
            <RoutesComponent />
        </div>
    )
}

export default App
