import React from 'react'
import Skeleton from 'react-loading-skeleton'
function HospitalItemSkeleton({ mode }) {
    return (
        <div className="clinicItem">
            <div className="clinicItem__container">
                <div className={`${mode === 'cpm-list' ? 'clinicItem__content--list ': ''}clinicItem__content`}>
                    <div className={`${mode === 'cpm-list' ? 'clinicItem__content-img-list ' : ''}clinicItem__content-img`}>
                        <Skeleton width={300} height = {160}/>
                    </div>
                    <Skeleton width={300} height = {20}/>
                </div>
            </div>
        </div>
    )
}

export default HospitalItemSkeleton
