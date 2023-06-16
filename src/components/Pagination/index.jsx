import React from 'react'
import './index.scss'

function Pagination({ totalPage, currentPage, onClick }) {
    const pageNumbers = []
    for (let i = 1; i <= totalPage; i++) pageNumbers.push(i)
    return (
        <nav className="pagination">
            <ul className="pagination__list">
                {pageNumbers.map((page, index) => (
                    <li
                        key={index}
                        className={`${
                            index === currentPage
                                ? 'pagination__list-item--active '
                                : ''
                        }pagination__list-item`}
                        onClick={() => onClick(index)}
                    >
                        {page}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination
