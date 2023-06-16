import React from 'react'
import './index.scss'

function BaseTableItem({ data, onClick }) {
    return (
        <li className={`${data.status ? 'baseTableItem--active ': ''}baseTableItem`} onClick = {() => onClick(data.id)}>
            {data.label}
        </li>
    )
}

export default BaseTableItem
