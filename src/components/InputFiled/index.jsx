import React from 'react'
import { Controller } from 'react-hook-form'
import './index.scss'

function InputField({
    label,
    name,
    type = 'input',
    form,
    placeholder,
    icon,
    disabled
}) {
    const {
        formState: { errors }
    } = form
    const err = errors[name]
    return (
        <>
            <label className="input-field__label" htmlFor={name}>{label}</label>
            <Controller
                name={name}
                control={form.control}
                render={({
                    field: { onChange, onBlur, name }
                }) => (
                    <div className="input-field__container">
                        <div className="input-field__icon">
                            {icon && <span>{icon}</span>}
                        </div>

                        <input
                            formNoValidate
                            id = {name}
                            onChange={onChange}
                            onBlur={onBlur}
                            value={form.getValues(name)}
                            type={type}
                            placeholder={placeholder}
                            disabled = {disabled}
                            className={`${
                                type === 'date' ? 'inputDate ' : ''
                            }input-field__input`}
                        />
                    </div>
                )}
            />
            <span className="input-field__err">
                {err && err.message}
            </span>
        </>
    )
}

export default InputField
