import React from 'react'
import Skeleton from 'react-loading-skeleton'

function SpecialistItemSkeleton({ mode }) {
    return (
        <div
            className={`${
                mode === 'column' ? 'specialistItem--column ' : ''
            }specialistItem`}
        >
            <div className="specialistItem__img">
                <Skeleton circle width={66} height={66} />
            </div>
            <span className="specialistItem__title">
                <Skeleton width={100} height={28} />
            </span>
        </div>
    )
}

export default SpecialistItemSkeleton
