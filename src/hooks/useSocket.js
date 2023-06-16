import { useRef } from 'react'
import { io } from 'socket.io-client'


function useSocket() {
    const { current: socket } = useRef(io('https://bookmydoctor.onrender.com', { transports: ['websocket'] }))
    return socket
}

export default useSocket
