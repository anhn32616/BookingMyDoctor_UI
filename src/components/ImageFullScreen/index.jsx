import React from 'react'
import './index.scss'
function ImageFullScreen({ sourceImg, onClose }) {
    const handleOnClick = e => {
        if (e.target.className === 'imageFullScreen') onClose()
    }
    return (
        <div className="imageFullScreen" onClick={handleOnClick}>
            <div className="imageFullScreen__container">
                <img src={sourceImg}/>
            </div>
        </div>
    )
}

export default ImageFullScreen
