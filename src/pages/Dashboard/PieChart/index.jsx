import React from 'react'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

function PieChart({ pieChartData }) {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right'
            },
            title: {
                display: true,
                text: 'Biểu đồ doanh thu theo chuyên khoa'
            },
            tooltip: {
                enabled: true
            }
        }
    }
    const data = {
        labels: pieChartData.filter(item => item.revenue > 0).map(item => item.name),
        datasets: [
            {
                label: 'Doanh thu',
                data: pieChartData.filter(item => item.revenue > 0).map(item => item.revenue),
                backgroundColor: [
                    '#FFCD58',
                    '#369CE1',
                    '#4CBABE',
                    '#F99842',
                    '#9965FF',
                    '#FF6285'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    }
    return <Pie data={data} options = {options}/>
}

export default PieChart
