import React from 'react'
import './index.scss'

function SwitchButton({ id, status, handleChangeStatus }) {
    const handleOnChecked = () => {
        handleChangeStatus(id, status)
    }
    return (
        <label>
            <input
                type="checkbox"
                className="inputCheckbox"
                checked={status}
                readOnly
            />
            <span className="check" onClick={handleOnChecked}></span>
        </label>
    )
}

export default SwitchButton