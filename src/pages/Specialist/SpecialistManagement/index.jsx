import specialistApi from 'api/specialistApi'
import React, { useEffect, useState } from 'react'
import './index.scss'
import { AiFillEdit } from 'react-icons/ai'
import { Link, useNavigate } from 'react-router-dom'
import { path } from 'constants/path'
import Loading from 'components/Loading'
function SpecialistManagement() {
    const [specialistData, setSpecialistData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        (async () => {
            const data = await specialistApi.getAllSpecialist()
            setSpecialistData(data.message)
            setIsLoading(false)
        })()
    }, [])
    useEffect(() => {
        document.title = 'Quản lí chuyên khoa'
    }, [])
    if (isLoading) return <Loading />
    return (
        <div className="specialistManagement">
            <div className="specialistManagement__container">
                <header>Quản lí chuyên khoa</header>
                <div className="specialistManagement__action">
                    <button
                        className="btnSuccess"
                        onClick={() => navigate(path.addSpecialist)}
                    >
                        Thêm chuyên khoa mới
                    </button>
                </div>
                <div className="table__wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên chuyên khoa</th>
                                <th>Mô tả</th>
                                <th>Số lượng bác sĩ</th>
                                <th>Chỉnh sửa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {specialistData.map(specialistItem => (
                                <tr key={specialistItem.id}>
                                    <td>{specialistItem.id}</td>
                                    <td>{specialistItem.name}</td>
                                    <td>
                                        {specialistItem.description}
                                    </td>
                                    <td>
                                        {specialistItem.sum_doctor
                                            ? specialistItem.sum_doctor
                                            : 0}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/system/editSpecialist/${specialistItem.id}`}
                                            state={{ specialistItem }}
                                        >
                                            <span className="edit__icon">
                                                <AiFillEdit />
                                            </span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SpecialistManagement
