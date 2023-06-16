import React, { useEffect, useState } from 'react'
import './index.scss'
import SpecialistItem from './components/SpecialistItem'
import {
    BsFillArrowUpCircleFill,
    BsFillArrowDownCircleFill
} from 'react-icons/bs'
import specialistApi from 'api/specialistApi'
import SpecialistItemSkeleton from './components/SpecialistItemSkeleton'

function SpecialistList() {
    const [data, setData] = useState([])
    const [dataShow, setDataShow] = useState([])
    const [showAll, setShowAll] = useState(false)
    const toggleShowAll = () => {
        if (showAll) {
            setDataShow(data.slice(0, 6))
            setShowAll(false)
        } else {
            setDataShow(data)
            setShowAll(true)
        }
    }
    useEffect(() => {
        (async () => {
            const respone = await specialistApi.getAllSpecialist()
            setData(respone.data.listItem)
            setDataShow(respone.data.listItem.slice(0, 6))
        })()
    }, [])

    return (
        <div className="specialistList">
            <div className="specialistList__container">
                <header className="specialistList__header">
                    <h1>Đa dạng chuyên khoa khám</h1>
                    <span>
                        Đặt khám dễ dàng và tiện lợi hơn với đầy đủ
                        các chuyên khoa
                    </span>
                </header>
                <div className="specialistList__list">
                    {dataShow.length !== 0
                        ? dataShow.map((item, index) => (
                            <SpecialistItem
                                key={index}
                                data={item}
                            />
                        ))
                        : Array(6)
                            .fill(1)
                            .map((item, index) => (
                                <SpecialistItemSkeleton
                                    key={index}
                                />
                            ))}
                </div>
                {!showAll && (
                    <div
                        className="specialistList__action"
                        onClick={toggleShowAll}
                    >
                        <span>
                            <BsFillArrowDownCircleFill />
                        </span>
                        <span>Xem thêm</span>
                    </div>
                )}
                {showAll && (
                    <div
                        className="specialistList__action"
                        onClick={toggleShowAll}
                    >
                        <span>
                            <BsFillArrowUpCircleFill />
                        </span>
                        <span>Thu gọn</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SpecialistList
