import React from 'react'
import './index.scss'

function InputShow({ title, content }) {
    return (
        <div className="inputShow">
            <span className="inputShow__title">{title}</span>
            <input defaultValue={content} className = "inputShow__content" readOnly/>
        </div>
    )
}

export default InputShow
