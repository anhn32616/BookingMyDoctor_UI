import React from 'react'
import './index.scss'
function SelectOption({ data, hanleSelectionOnChange }) {
    return (
        <div className="selectOption">
            <div className="selectOption__container">
                <select
                    onChange={choosen =>
                        hanleSelectionOnChange(choosen.target.value)
                    }
                >
                    {data.map(day => (
                        <option value={day.value} key={day.value}>
                            {day.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default SelectOption
