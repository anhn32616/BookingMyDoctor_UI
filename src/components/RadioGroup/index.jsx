import React from 'react'
import './index.scss'

function RadioGroup({ title, form, name, optionData, disabled, mode }) {
    return (
        <div className="radio-group">
            <label className="radio-group__title">{title}</label>
            <div className={`${mode === 'gender' ? 'list-gender ': ''}radio-group__list`}>
                { form && optionData.map((item, index) => (
                    <label key={index} className="radio-group__item">
                        {item.label}
                        <input
                            type="radio"
                            value={item.value}
                            disabled = {disabled}
                            {...form.register(name)}
                        />
                    </label>
                ))}
                { !form && optionData.map((item, index) => (
                    <label key={index} className="radio-group__item">
                        <input
                            type="radio"
                            value={item.value}
                            disabled = {disabled}
                        />
                        {item.label}
                    </label>
                ))}
            </div>
        </div>
    )
}

export default RadioGroup
