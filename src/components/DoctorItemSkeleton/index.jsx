import React from 'react'
import Skeleton from 'react-loading-skeleton'

function DoctorItemSkeleton(mode) {
    return (
        <div className="doctorItem">
            <div
                className={`${
                    mode === 'listColumn' ? 'listColumn-item ' : ''
                }doctorItem__container`}
            >
                <div className="doctorItem__content">
                    <div className="doctorItem__content-img">
                        <Skeleton circle width={50} height = {50}/>
                    </div>
                    <div className="doctorItem__content-main">
                        <span className="doctorItem__content-main-position">
                            <Skeleton width={100} />
                        </span>
                        <span className="doctorItem__content-main-name">
                            <Skeleton width={200} />
                        </span>
                        <span className="doctorItem__content-main-clinic">
                            <Skeleton count={2}/>
                        </span>
                    </div>
                </div>
                <div
                    className={`${
                        mode === 'listColumn'
                            ? 'doctorItem__action--column '
                            : ''
                    }doctorItem__action`}
                >

                    <Skeleton width={100} height= {36}/>

                </div>
            </div>
        </div>
    )
}

export default DoctorItemSkeleton
