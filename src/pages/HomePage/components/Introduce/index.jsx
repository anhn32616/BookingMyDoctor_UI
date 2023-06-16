import React, { useEffect, useRef, useState } from 'react'
import dataIntroduce from './data'
import './index.scss'

function Introduce() {
    const [indexImg, setIndexImg] = useState(0)
    const refInterval = useRef()
    useEffect(() => {
        refInterval.current = setInterval(() => {
            if (indexImg === dataIntroduce.length - 1) setIndexImg(0)
            else setIndexImg(indexImg + 1)
        }, 5000)

        return () => {
            clearInterval(refInterval.current)
        }
    }, [indexImg])
    return (
        <div className="mainlayout-introduce">
            <div className="mainlayout-introduce__container">
                <div className="mainlayout-introduce__header">
                    <span>An tâm tìm bác sĩ</span>
                    <p>
                        Tìm và đặt khám với hơn 250+ bác sĩ hàng đầu
                        Việt Nam
                    </p>
                </div>
                <div className="mainlayout-introduce__content">
                    <div className="mainlayout-introduce__content-img">
                        <img
                            src={dataIntroduce[indexImg].img}
                            alt="IMG introduce"
                        />
                    </div>
                    <div className="mainlayout-introduce__content-detail">
                        {dataIntroduce.map((item, index) => (
                            <div
                                className={`${
                                    index === indexImg
                                        ? 'active-banner '
                                        : ' '
                                }mainlayout-introduce__content-detail-item`}
                                key={index}
                                onClick={() => setIndexImg(index)}
                            >
                                <span
                                    className={`${
                                        index === indexImg
                                            ? 'text-active '
                                            : ''
                                    }`}
                                >
                                    {' '}
                                    {item.title}
                                </span>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Introduce