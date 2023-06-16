import React from 'react'
import './index.scss'

function SelectGroup({ dataSelectGroup, title, form, name }) {
    return (
        <div className="select-group">
            <header className="select-group__title">{title}</header>
            <select {...form.register(name)}>
                {dataSelectGroup.map(item => (
                    <option value={item.id} key={item.id} selected = {form.getValues(name) == item.id} >
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SelectGroup