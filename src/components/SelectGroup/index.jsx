import React from 'react'
import './index.scss'

function SelectGroup({ dataSelectGroup, title, form, name }) {
    return (
        <div className="select-group">
            <header className="select-group__title">{title}</header>
            <select {...form.register(name)}>
                {dataSelectGroup.map(item => (
                    <option value={item.name} key={item.code} selected={form.getValues(name) == item.name} >
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectGroup